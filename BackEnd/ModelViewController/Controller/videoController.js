const { exiftool } = require('exiftool-vendored');
const video_Schema = require('../Model/videosSchema');
const resHandler = require('../../Utils/Error Handler/errorHandler');
const fs = require('fs');
const { format } = require('express/lib/response');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { snapScreenShots } = require('../../Utils/thumbnailGenerator');
const { promisify, parseArgs } = require('util');
const path = require('path');
const { error } = require('console');
ffmpeg.setFfmpegPath(ffmpegPath);


const getVideoMetaData = async function (req) {
  if (!req.mergedFile) return null;


  return new Promise((resolve) => {
    setTimeout(async () => {
      if (!fs.existsSync(req.mergedFile)) {
        console.error(`🚨 File still missing after delay: ${req.mergedFile}`);
        return resolve(null);
      }


      try {
        const exifData = await exiftool.read(req.mergedFile);
        resolve(exifData); // Return extracted metadata
      } catch (error) {
        console.error('Error reading EXIF data:', error);
        resolve(null);
      }
    }, 500); // Wait 500ms before reading the file
  });
};


const readVideoMetaData = async function (req) {
  try {
    const tag = await getVideoMetaData(req);

    if (!tag) return;

    const whiteSpaceRemoved = req.body?.albumName?.replace(/\s+/g, '');
    const AlbumName = whiteSpaceRemoved?.toLowerCase();

    const videoMetaDataProcesssing = {
      make: tag?.AndroidModel,
      videoDuration:
      tag?.Duration && typeof tag.Duration === 'object'
        ? `${Math.floor(tag.Duration.scale * tag.Duration.value)} seconds`
        : tag?.Duration || 'Missing',
          dateTimeOriginal:
        tag.CreateDate?.rawValue &&
        new Date(
          tag.CreateDate?.rawValue.slice(0, 10).replace(/:/g, '-') +
            tag.CreateDate?.rawValue.slice(10)
        ).toString(),
      videoWidthAndHeight: tag?.ImageSize,
      videoMegaPixels: tag?.Megapixels,
      videoTakenPlace: tag.CreateDate?.zoneName,
      gPSLatitudeAndLongitude: tag?.GPSCoordinates,
    };

    const extension = path.extname(req.mergedFile);
    let videoDataProcessed = {};


    if (extension !== '.mp4') {
      videoDataProcessed = await convertToMp4(req, AlbumName);
    } else {
      const thumbnailPath = await processVideo( req.mergedFile,
        req
      ); // Await thumbnail processing

      videoDataProcessed = {
        viodeoName: req.mergedFile.split('/').pop(),
        videoFileSize: fs.statSync(req.mergedFile).size,
        thumbnailsURL:  `${req.protocol}://${req.get('host')}/${thumbnailPath}`,
        videoURL: `${req.protocol}://${req.get('host')}/${req.mergedFile}`,
        videoAlbums: AlbumName || [],
      };

    }

    // Combine the data
    return { ...videoDataProcessed, ...videoMetaDataProcesssing };
  } catch (error) {
    console.error('Error processing video metadata:', error);
    return { error: 'Failed to process video metadata' };
  }
};



const convertToMp4 = async function (req, AlbumName) {
  try {
    // Read the file into a buffer
    const inputBuffer = await promisify(fs.readFile)(req.mergedFile);
    const OutputBuffer = `C_SAM_${Date.now()}.mp4`; // Define the output filename
    const OutputPath = `Storage/${req.user.id}/Videos/`; // Define the destination directory
    const combinePath = path.join(OutputPath, OutputBuffer); // Full output path


    // Save the inputBuffer to a temporary file
    const tempInputFile = path.join(OutputPath, `temp-${Date.now()}.tmp`);
    await promisify(fs.writeFile)(tempInputFile, inputBuffer);


    const thumbnailPath = await processVideo(req.mergedFile, req); // Await thumbnail processing


    // Convert the file using ffmpeg
    await ffmpeg(tempInputFile)
      .output(combinePath) // Define the output path for the converted file
      .on('end', () => {
        console.log('Converted to mp4 successfully');


        // Clean up temporary file after conversion
        fs.unlink(tempInputFile, (err) => {
          if (err) console.error('Error deleting temp file:', err.message);
        });


        // Clean up old file after conversion
        fs.unlink(req.mergedFile, (err) => {
          if (err) console.error('Error deleting temp file:', err.message);
        });
      })
      .on('error', (err) => {
        console.log('Error occurred: ', err.message);
        fs.unlink(tempInputFile, (err) => {
          if (err) console.error('Error deleting temp file:', err.message);
        });
      })
      .run(); // Run the conversion process


    return {
      viodeoName: OutputBuffer,
      videoFileSize: fs.statSync(req.mergedFile).size,
      videoURL: `${req.protocol}://${req.get(
        'host'
      )}/${OutputPath}/${OutputBuffer}`,
      videoAlbums: AlbumName || [],
      thumbnailsURL: `${req.protocol}://${req.get('host')}/${thumbnailPath}`,
    };
  } catch (err) {
    console.error('Conversion failed:', err.message);
  }
};


exports.uploadChunks = async (req, res, next) => {
  const { fileName, totalChunks, chunkIndex } = req.body;


  try {
    const tempPath = `Storage/${req.user.id}/Videos/temp/`;


    if (fs.existsSync(tempPath)) {
      const files = fs.readdirSync(tempPath);
      const matchingFiles = files.filter((file) =>
        file.startsWith(`TEMP_${fileName.split('.')[0]}`)
      );


      // get the file extension
      const extension = path.extname(fileName);


      if (matchingFiles.length === parseInt(totalChunks)) {
        const finalPath = `Storage/${
          req.user.id
        }/Videos/SAM_${Date.now()}${extension}`; // Final merged file
        const writeStream = fs.createWriteStream(finalPath);


        for (let i = 0; i < totalChunks; i++) {
          const chunkPath = path.join(
            tempPath,
            `TEMP_${fileName.split('.')[0]}.${i}`
          );


          if (!fs.existsSync(chunkPath)) {
            console.error(`🚨 Chunk ${i} is missing!`);
            return;
          }


          const data = fs.readFileSync(chunkPath);
          writeStream.write(data);
          fs.unlinkSync(chunkPath); // Delete chunk after merging
        }
        writeStream.end();
        req.mergedFile = finalPath;
        console.log(`✅ Merged video saved at: ${finalPath}`);
      }
    } else {
      console.error('Directory does not exist:', tempPath);
    }


    next();
  } catch (err) {
    console.error(err.message);
  }
};


exports.createVideo = async (req, res) => {

  try {

    const { totalChunks, chunkIndex } = req.body;


    if(parseInt(chunkIndex )+1 < parseInt(totalChunks))
    {
      return resHandler(
        res,
        200,
        'Sucess',
        'Chunk is assembling'
      );
    }


    const videoMetaData = await readVideoMetaData(req);

  if (!videoMetaData) {
      return resHandler(
        res,
        400,
        'Failed',
        'No metadata found for the video files'
      );
    }


   const userRelatedVideoSchema = await video_Schema(req.user.id);
    const createData = await userRelatedVideoSchema.create(videoMetaData);

    resHandler(res, 200, 'Success', createData);

  } catch (err) {

    console.log(err.message);
    resHandler(res, 400, 'Failed', 'Failed to create video ' + err.message);
  }
};

exports.getAllVideo = async (req, res) => {
  try {
    const createdUserVideoSchema = await video_Schema(req.user.id);

    const videodata = await createdUserVideoSchema.find({
      isActive: true,
      videoAlbums: { $size: 0 }, // Find documents where photoAlbums is an empty array
    });
    if (videodata.length < 1) {
      return resHandler(res, 200, 'Success', 'No data avaliable');
    }

    const totalSize = videodata.reduce((acc, cur) => {
      return acc + Number(cur.videoFileSize); // Ensure cur.imageSize is a number
    }, 0);

    const stats = await createdUserVideoSchema.aggregate([
      {
        $match: {
          isActive: true,
          videoAlbums: { $size: 0 }, // Find documents where photoAlbums is an empty array
        }, // Filter to only get documents with isActive true
      },
      {
        $addFields: {
          // Use regex to extract the parts needed for a valid ISO date
          parsedDate: {
            $dateFromString: {
              dateString: {
                $substr: [
                  '$dateTimeOriginal',
                  0,
                  24, // Extract the first 24 characters (this should cover "Thu Sep 19 2024 21:58:44")
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            // Format the date as YYYY-MM-DD for grouping
            $dateToString: { format: '%Y-%m-%d', date: '$parsedDate' },
          },
          fileDatas: { $push: '$$ROOT' }, // Group items with the same date
        },
      },
      {
        $sort: { _id: -1 }, // Sort by _id (which is dateOnly) in descending order
      },
    ]);

    resHandler(res, 200, 'Success', {
      total: videodata.length,
      result: stats,
      totalSize,
    });
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Failed to get the data');
  }
};

exports.getSearchFiles = async (req, res) => {
  try {

    const createdUserVideoSchema = video_Schema(req.user.id);

    const videodata = await createdUserVideoSchema.find({
      isActive: true,
      videoAlbums: { $size: 0 }, // Find documents where photoAlbums is an empty array
    });


 
    const stats = videodata
  .filter((el) => {
    // Convert 'dateTimeOriginal' to Date and extract year
    const date = new Date(el.dateTimeOriginal).getFullYear();
    const searchYear = new Date(req.body.searchDate).getFullYear(); // Extract year from searchDate

    // Filter to only include entries matching the search year
    return date === searchYear;
  })
  .reduce((acc, el) => {
    // Format the date as 'YYYY-MM-DD' (same as MongoDB aggregation)
    const date = new Date(el.dateTimeOriginal).toISOString().slice(0, 10);

    // If this date group doesn't exist yet, create an empty array for it
    if (!acc[date]) {
      acc[date] = {
        _id: date,  // Add the date as '_id', just like the MongoDB group
        fileDatas: [], // This is the equivalent of $push in aggregation
      };
    }

    // Push the current element into the fileDatas array for this date group
    acc[date].fileDatas.push(el);

    return acc;
  }, {}); // Initialize with an empty object

// Convert the grouped object into an array and sort by date in descending order
const sortedStats = Object.values(stats)
  .sort((a, b) => new Date(b._id) - new Date(a._id)); // Sort by _id (date) in descending order



    if (videodata.length < 1) {
      return resHandler(res, 200, 'Success', videodata);
    }
   

   resHandler(
    res,
    201,
    'success',
    {
      total: videodata.length,
      result: sortedStats,
    }
  );
  } catch (err) {

    resHandler(
      res,
      400,
      'Failed',
      'Failed to get image metadata ' + err.message
    );
  }
};  

exports.softDeleteVideo = async (req, res) => {
  try {
    const createdUserVideoSchema = await video_Schema(req.user.id);

    // Check if videoId is provided
    const videoId = req.params.id;
    if (videoId.length < 12) {
      return resHandler(res, 400, 'Failed', 'Video ID is required');
    }

    const deletevideoId = await createdUserVideoSchema.findByIdAndUpdate(
      videoId,
      {
        isActive: false,
        $set: { videoAlbums: [] },
      }
    );

    if (!deletevideoId) {
      return resHandler(res, 400, 'Failed', 'ID does not exits');
    }

    return resHandler(res, 200, 'Success', 'Video ID is deleted');
  } catch (err) {
    res
      .status(400)
      .json({ status: 'Failed', message: 'Failed to delete the Video' });
  }
};

exports.getSoftDeletedVideos = async (req, res) => {
  try {
    const createdUserVideoSchema = video_Schema(req.user.id);

    const deleteVideos = await createdUserVideoSchema.find({
      isActive: false,
    });

    if (!deleteVideos) {
      return resHandler(res, 400, 'Failed', 'Videos does not exits');
    }

    const totalSize = deleteVideos.reduce((acc, cur) => {
      return acc + Number(cur.videoFileSize);
    }, 0);
    resHandler(res, 200, 'Success', {
      message: 'Image deleted',
      deleteVideos,
      totalSize,
    });
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Failed to get deleted Videos');
  }
};

exports.hardDeleteVideo = async (req, res) => {
  try {
    const createdUserVideoSchema = await video_Schema(req.user.id);

    const videoID = req.params.id;
    if (!videoID) {
      return resHandler(res, 400, 'Failed', 'Video ID is required');
    }
    const deleteVideoId = await createdUserVideoSchema.findByIdAndDelete(
      videoID
    );

    if (!deleteVideoId) {
      return resHandler(res, 400, 'Failed', 'Video does not exits');
    }

    //to delete files from the database
 

    fs.unlink(
      `Storage/${req.user.id}/Videos/${deleteVideoId.viodeoName}`,
      (err) => {
        if (err) {
          console.log('Video file is not deleted ' + err);
        } else {
          console.log('Video file is deleted');
        }
      }
    );

    const deleteThubnail =deleteVideoId.thumbnailsURL.split("Thumbnails/")[1];
    fs.unlink(
      `Storage/${req.user.id}/Thumbnails/${deleteThubnail}`,
      (err) => {
        if (err) {
          console.log('Thumbnail file is not deleted ' + err);
        } else {
          console.log('Thumbnail file is deleted');
        }
      }
    );

    resHandler(
      res,
      200,
      'Success',
      'Video MetaData + Video Files is permanently deleted'
    );
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Failed to delete the Video ' + err.message);
  }
};

exports.restoreVideo = async (req, res) => {
  try {
    const createdUserVideoSchema = await video_Schema(req.user.id);

    const videoID = req.params.id;

    if (videoID.length < 12) {
      return resHandler(res, 400, 'Failed', 'Video ID is required');
    }

    const deletevideoID = await createdUserVideoSchema.findByIdAndUpdate(
      videoID,
      {
        isActive: true,
      }
    );

    if (!deletevideoID) {
      return resHandler(res, 400, 'Failed', 'ID does not exits');
    }
    resHandler(res, 200, 'Success', 'Video ID is restored');
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Video ID is not restore ' + err.message);
  }
};

//Album handler
exports.getAlbumVideo = async (req, res) => {
  try {
    const createdUserVideoSchema = await video_Schema(req.user.id);

    const whiteSpaceRemoved = req.body.albumName.replace(/\s+/g, '');
    const albname = whiteSpaceRemoved.toLowerCase();


    const videoData = await createdUserVideoSchema.find({
      isActive: true,
      videoAlbums:albname,
    });

    if (videoData.length <= 0) {
      return resHandler(res, 200, 'Success', 'No data avaliable');
    }

  
    const stats = await createdUserVideoSchema.aggregate([
      {
        $match: { isActive: true, videoAlbums:albname }, // Filter to only get documents with isActive true
      },
      {
        $addFields: {
          // Use regex to extract the parts needed for a valid ISO date
          parsedDate: {
            $dateFromString: {
              dateString: {
                $substr: [
                  '$dateTimeOriginal',
                  0,
                  24, // Extract the first 24 characters (this should cover "Thu Sep 19 2024 21:58:44")
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            // Format the date as YYYY-MM-DD for grouping
            $dateToString: { format: '%Y-%m-%d', date: '$parsedDate' },
          },
          fileDatas: { $push: '$$ROOT' }, // Group items with the same date
        },
      },
      {
        $sort: { _id: -1 }, // Sort by _id (which is dateOnly) in descending order
      },
    ]);

    resHandler(res, 200, 'Success', {
      total: videoData.length,
      result: stats
    });
  } catch (err) {
    resHandler(
      res,
      400,
      'Failed',
      'Failed to get image metadata ' + err.message
    );
  }
};

//add videos to album

exports.addVideoToAlbum = async (req, res) => {
  try {
    const whiteSpaceRemoved = req.body.imageToAlbumName.replace(/\s+/g, '');
    const AlbumName = whiteSpaceRemoved.toLowerCase();

    const id = req.params.id;
    const createdVideoSchema = video_Schema(req.user.id);

    const imagedata = await createdVideoSchema.updateMany(
      {
        _id: id,
        videoAlbums: { $size: 0 },
      },
      {
        $set: { videoAlbums: AlbumName }, // Correct syntax for $set
      }
    );

    if (!imagedata) {
      return resHandler(res, 400, 'failed', 'Already in album');
    }

    resHandler(res, 200, 'Success', {
      result: `${id} have been updated to ${AlbumName}`,
    });
  } catch (err) {
    resHandler(
      res,
      400,
      'Failed',
      'Failed to add to the album    ' + err.message
    );
  }
};

//remove videos from the album
exports.removeVideosFromAlbum = async (req, res) => {
  try {
    const id = req.params.id;
    const createdUserVideoSchema = video_Schema(req.user.id);

    const imagedata = await createdUserVideoSchema.updateMany(
      {
        _id: id,
      },
      {
        $set: { videoAlbums: [] }, // Correct syntax for $set
      }
    );

    if (!imagedata) {
      return resHandler(res, 400, 'failed', 'Already in album ');
    }

    resHandler(res, 200, 'Success', {
      result: `${id} have been removed`,
    });
  } catch (err) {
    resHandler(
      res,
      400,
      'Failed',
      'Failed to remove to the album    ' + err.message
    );
  }
};


async function processVideo(filePath,req) {
  try {
    // Call the function and await the result
    const thumbnailPath = await snapScreenShots(filePath,req);
    
    // You can return the path if needed for further use
    return thumbnailPath;

  } catch (error) {
    console.error('Failed to create thumbnail:', error.message);
  }
}



// Update all documents