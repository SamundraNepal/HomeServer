const imageModel = require('../Model/imageSchema');
const ExifReader = require('exifreader');
const resHandler = require('../../Utils/Error Handler/errorHandler');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { request } = require('http');
const convert = require('heic-convert');
const { promisify } = require('util');
const videoModel = require('../Model/videosSchema');


const convertHeicFile = async function (req, AlbumName) {
  try {
    //get the file first
    const inputBuffer = await promisify(fs.readFile)(req.mergedFile);
    //convert the file
    const convertedHeicFile = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1,
    });
    //create the path
    const createPath = `Storage/${req.user.id}/Images/`;


    //create the name of the new file
    const fileName = `SAM${Date.now()}.jpg`;
    //save the file to the path created
    await promisify(fs.writeFile)(
      path.join(createPath, fileName),
      convertedHeicFile
    );
    //delete the previous file heic file
    // await promisify(fs.unlink)(req.mergedFile);


    return {
      imageName: fileName,
      imageSize: fs.statSync(req.mergedFile).size,
      imageURL: `${req.protocol}://${req.get(
        'host'
      )}/${createPath}/${fileName}`,
      photoAlbums: AlbumName || [],
    };
  } catch (err) {
    console.log('failed to convert heic file ', err.message);
  }
};


const readPhotoData = async function (req) {
  if (!req.mergedFile) return null;


  return new Promise((resolve) => {
    setTimeout(async () => {
      if (!fs.existsSync(req.mergedFile)) {
        console.error(`🚨 File still missing after delay: ${req.mergedFile}`);
        return resolve(null);
      }


      try {
        const exifData = await ExifReader.load(req.mergedFile);
        resolve(exifData); // Return extracted metadata
      } catch (error) {
        console.error('Error reading EXIF data:', error);
        resolve(null);
      }
    }, 500); // Wait 500ms before reading the file
  });
};

const readImageMetaData = async function (req) {

  const tag = await readPhotoData(req);
  if (!tag) return;
  const whiteSpaceRemoved = req.body?.albumName?.replace(/\s+/g, '');
  const AlbumName = whiteSpaceRemoved?.toLowerCase();


  const imageMetaDataProcesssing = {
    make: tag.Make?.description,
    model: tag.Model?.description,
    dateTimeOriginal:
      tag.DateTimeOriginal?.description &&
      new Date(
        tag.DateTimeOriginal.description.slice(0, 10).replace(/:/g, '-') +
          tag.DateTimeOriginal.description.slice(10)
      ).toString(),
    offsetTime: tag.OffsetTime?.description,
    pixelXDimension: tag.PixelXDimension?.description,
    pixelYDimension: tag.PixelYDimension?.description,
    gPSLatitudeRef: tag.GPSLatitudeRef?.description,
    gPSLatitude: tag.GPSLatitude?.value,
    gPSLongitudeRef: tag.GPSLongitudeRef?.description,
    gPSLongitude: tag.GPSLongitude?.value,
    gPSAltitudeRef: tag.GPSAltitudeRef?.description,
    gPSAltitude: tag.GPSAltitude?.value,
  };


  const isHEIC = path.extname(req.mergedFile);


  let imageDataProcessed = {};
  if (isHEIC === '.heic') {
    imageDataProcessed = await convertHeicFile(req, AlbumName);
  } else {
    // Process merged file data (no need for `req.files`)
    imageDataProcessed = {
      imageName: req.mergedFile.split('/').pop(),
      imageSize: fs.statSync(req.mergedFile).size,
      imageURL: `${req.protocol}://${req.get('host')}/${req.mergedFile}`,
      photoAlbums: AlbumName || [],
    };
  }


  // Combine the data
  return { ...imageDataProcessed, ...imageMetaDataProcesssing };




};


exports.uploadChunks = (req, res, next) => {
  const { fileName, totalChunks, chunkIndex } = req.body;


  try {
    const tempPath = `Storage/${req.user.id}/Images/temp/`;


    if (fs.existsSync(tempPath)) {
      const files = fs.readdirSync(tempPath);
      const matchingFiles = files.filter((file) =>
        file.startsWith(`TEMP_${fileName.split('.')[0]}`)
      );


      // get the file extension
      const extension = path.extname(fileName);


      if (matchingFiles.length === parseInt(totalChunks)) {
        console.log('ruuning');
        const finalPath = `Storage/${
          req.user.id
        }/Images/SAM_${Date.now()}${extension}`; // Final merged file
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


            fs.unlinkSync(chunkPath); // Delete chunk after merging fix this later
        }


        writeStream.end();


        req.mergedFile = finalPath;


        console.log(`✅ Merged Image saved at: ${finalPath}`);
      }
    } else {
      console.error('Directory does not exist:', tempPath);
    }


    next();
  } catch (err) {
    console.error('heres the error man :' + err.message);
  }
};


exports.createImage = async (req, res) => {
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
    

   //gets the processed data from the reqs
    const imageMetaData = await readImageMetaData(req);

    if (!imageMetaData) {
      return resHandler(res, 400, 'Failed', 'No metadata found for the image.');
    }
    //creating the image schema based on the user id
    const userRelatedImageSchema = await imageModel(req.user.id);

    // Database Created
    const createData = await userRelatedImageSchema.create(imageMetaData);

    resHandler(res, 200, 'Success', { result:  createData });
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Failed to upload image ' + err.message);
  }
};

exports.getAllImage = async (req, res) => {
  try {
    const createdUserImageSchema = imageModel(req.user.id);

    const imagedata = await createdUserImageSchema.find({
      isActive: true,
      photoAlbums: { $size: 0 }, // Find documents where photoAlbums is an empty array
    });

    if (imagedata.length < 1) {
      return resHandler(res, 200, 'Success', 'No data avaliable');
    }

    // Corrected reduce function
    const totalSize = imagedata.reduce((acc, cur) => {
      return acc + Number(cur.imageSize); // Ensure cur.imageSize is a number
    }, 0);

    const stats = await createdUserImageSchema.aggregate([
      {
        $match: { isActive: true, photoAlbums: { $size: 0 } }, // Filter to only get documents with isActive true
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
      total: imagedata.length,
      result: stats,
      totalSize,
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


exports.getSearchFiles = async (req, res) => {

  try {


    const createdUserImageSchema = imageModel(req.user.id);

    const imagedata = await createdUserImageSchema.find({
      isActive: true,
      photoAlbums: { $size: 0 }, // Find documents where photoAlbums is an empty array
    });


 
    const stats = imagedata
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



    if (imagedata.length < 1) {
      return resHandler(res, 200, 'Success', imagedata);
    }
   
   resHandler(
    res,
    201,
    'success',
    {
      total: imagedata.length,
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

exports.softDeleteImage = async (req, res) => {
  try {
    const createdUserImageSchema = imageModel(req.user.id);

    const imageId = req.params.id;

    if (!imageId) {
      return resHandler(res, 400, 'Failed', 'Image ID is required');
    }

    const deleteImageId = await createdUserImageSchema.findByIdAndUpdate(
      imageId,
      {
        isActive: false,
        $set: { photoAlbums: [] },
      }
    );

    if (!deleteImageId) {
      return resHandler(res, 400, 'Failed', 'ID does not exits');
    }
    resHandler(res, 200, 'Success', 'Image is deleted');
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Failed to delete the image');
  }
};

exports.getSoftDeletedImages = async (req, res) => {
  try {
    const createdUserImageSchema = imageModel(req.user.id);

    const deleteImages = await createdUserImageSchema.find({
      isActive: false,
    });

    if (!deleteImages) {
      return resHandler(res, 400, 'Failed', 'Images does not exits');
    }

    const totalSize = deleteImages.reduce((acc, cur) => {
      return acc + Number(cur.imageSize);
    }, 0);
    resHandler(res, 200, 'Success', {
      message: 'Image deleted',
      deleteImages,
      totalSize,
    });
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Failed to get deleted images');
  }
};

exports.hardDeleteImage = async (req, res) => {
  try {
    const createdUserImageSchema = imageModel(req.user.id);
    const imageId = req.params.id;
    if (!imageId) {
      return resHandler(res, 400, 'Failed', 'Image ID is required');
    }
    const deleteImageId = await createdUserImageSchema.findByIdAndDelete(
      imageId
    );

    if (!deleteImageId) {
      return resHandler(res, 400, 'Failed', 'Image does not exits');
    }

    //to delete files from the database

    fs.unlink(
      `Storage/${req.user.id}/Images/${deleteImageId.imageName}`,
      (err) => {
        if (err) {
          console.log('Image file is not deleted ' + err.message);
        } else {
          console.log('Image file is deleted');
        }
      }
    );
    resHandler(
      res,
      200,
      'Success',
      'Image MetaData + Image Files is permanently deleted'
    );
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Failed to delete the image');
  }
};

exports.restoreImage = async (req, res) => {
  try {
    const createdUserImageSchema = imageModel(req.user.id);
    const imageId = req.params.id;
    if (!imageId) {
      resHandler(res, 400, 'Failed', 'Invalid id');
    }
    const deleteImageId = await createdUserImageSchema.findByIdAndUpdate(
      imageId,
      {
        isActive: true,
      }
    );

    if (!deleteImageId) {
      resHandler(res, 400, 'Failed', 'Image does not exits');
    }
    resHandler(res, 200, 'Success', 'Image is restored');
  } catch (err) {
    resHandler(res, 400, 'Failed', 'Failed to restore the image');
  }
};

//Album handle
exports.getAlbumImage = async (req, res) => {

  try {
    const createdUserImageSchema = await imageModel(req.user.id);

    const whiteSpaceRemoved = req.body.albumName.replace(/\s+/g, '');
    const albname = whiteSpaceRemoved.toLowerCase();

    const imagedata = await createdUserImageSchema.find({
      isActive: true,
      photoAlbums:albname,
    });

    if (imagedata.length < 1) {
      return resHandler(res, 200, 'Success', 'No data avaliable');
    }

    const stats = await createdUserImageSchema.aggregate([
      {
        $match: { isActive: true, photoAlbums:albname }, // Filter to only get documents with isActive true
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
      total: imagedata.length,
      result: stats,
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

exports.addImageToAlbum = async (req, res) => {
  try {
    const whiteSpaceRemoved = req.body.imageToAlbumName.replace(/\s+/g, '');
    const AlbumName = whiteSpaceRemoved.toLowerCase();
    const id = req.params.id;
    const createdUserImageSchema = imageModel(req.user.id);

    const imagedata = await createdUserImageSchema.updateMany(
      {
        _id: id,
        photoAlbums: { $size: 0 },
      },
      {
        $set: { photoAlbums: AlbumName }, // Correct syntax for $set
      }
    );

    if (!imagedata) {
      return resHandler(res, 400, 'failed', 'Already in album ');
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

exports.removeImageFromAlbum = async (req, res) => {
  try {
    const id = req.params.id;
    const createdUserImageSchema = imageModel(req.user.id);

    const imagedata = await createdUserImageSchema.updateMany(
      {
        _id: id,
      },
      {
        $set: { photoAlbums: [] }, // Correct syntax for $set
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


exports.Base64Converter = async function (req,res) {


  try {


    const dirpath = path.join("D:", "Samundra_memories", "Samundra Photos"); // Correctly formatted path
const urlpath = req.body.imageurl.slice(31); // Extract relevant part of the URL
    const resolvedPath = path.join(dirpath , urlpath);


    if (!fs.existsSync(resolvedPath)) {
      return resHandler(res, 404, 'Failed', 'Image not found at ' + resolvedPath);
    }


    const resizedBuffer = await sharp(resolvedPath)
    .resize(500, 500)
    .jpeg({ quality: 90 })
    .toBuffer({ resolveWithObject: false });
  
  
  

    const base64String = resizedBuffer.toString('base64');

    const base64Data = 'data:image/jpeg;base64,' + base64String;

    
   resHandler(res, 200, 'Success', base64Data);


  } catch (err) {
    console.log(err.message)
    return resHandler(res, 400, 'Failed', "Failed to send the base64 data : " + err.message);

  }
};


async function updateMissingValue() {
  try {
    const createdUserImageSchema = imageModel('671e37bae42b013510d77f4fs');

    const result = await createdUserImageSchema.updateMany(
      {
        storageCheck: { $exists: false },
      },
      {
        $set: {
        
          storageCheck:true
        },
      }
    );

    console.log(`${result.modifiedCount} documents have been updated`);
  } catch (err) {
    console.log('Failed to update: ' + err.message);
  }
}


// Update all documents
async function updateAllImagesToBase64() {
  try {

    const createdUserImageSchema = imageModel("672eff57d10b5e767a104914");

    // Step 1: Find all documents with imageURL (or without it) and update imageBase64
    const documents = await createdUserImageSchema.find({ imageURL: { $exists: true } });

    // Step 2: Loop through all documents and update the imageBase64
    for (let doc of documents) {
      const imageURL = doc.imageURL;  // Get the imageURL from the document

      // Convert the imageURL to Base64
      const base64Image = await Base64Converter(imageURL);

      // Update the document with the new imageBase64 value
      await createdUserImageSchema.updateOne(
        { _id: doc._id },  // Find the document by its _id
        { $set: { imageBase64: base64Image } }  // Update the imageBase64 field
      );
    }

    console.log('All documents updated successfully');
  } catch (error) {
    console.error('Error updating documents:', error);
  }
}

async function updateURL() {

  const items = await videoModel('675a637cb1da94fab48fd5dd');
  var number =0;

  const data = await items.find();

  data.forEach(async(item) =>{
    if(item.videoURL.startsWith('http://202.62.144.165:53284/'))
    {
      const updatedurl = item.videoURL.replace('http://202.62.144.165:53284/' , 'https://api.snapforlifes.online/');
      item.videoURL = updatedurl;
      await item.save();
      number += 1;
     
    }

    console.log(number + 'has been updated');

  })

}
