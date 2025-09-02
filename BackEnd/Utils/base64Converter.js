const sharp = require('sharp');
const path = require('path');

exports.Base64Converter = async function (filePath) {
  try {
    const resolvedPath = path.resolve(filePath);
    const resizeImagePath = await sharp(resolvedPath)
      .resize(5, 5)
      .jpeg({ quality: 10 }) // Optional: adjust quality for smaller size (adjust as needed)
      .toBuffer();
    const base64String = resizeImagePath.toString('base64');

    return 'data:image/jpeg;base64,' + base64String;
  } catch (err) {
   
    console.log('failed to create base64 String' + err.message);
  }
};
