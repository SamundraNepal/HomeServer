const ffmpeg = require('fluent-ffmpeg');

exports.snapScreenShots = async function (filePath,req) {

    console.log(filePath);
    const imageName = `SAM_THUMB_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const folderPath = `Storage/${req.user.id}/Thumbnails`;

  return new Promise((resolve, reject) => {
    try {
      // Extract the first frame
      ffmpeg(filePath)
        .screenshots({
          count: 1,          // Number of frames to capture
          filename: imageName, // Output filename
          folder: folderPath, // Output folder
          timemarks: ['0']    // Time position in the video (0 = first frame)
        })
        .on('end', () => {
          console.log('First frame extracted successfully!');
          resolve(`${folderPath}/${imageName}`);
        })
        .on('error', (err) => {
          console.error('Error extracting frame:', err.message);
          reject(err);
        });
    } catch (err) {
      console.error('Unexpected error:', err.message);
      reject(err);
    }
  });
};
