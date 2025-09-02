const multer = require('multer');


const path = require('path');
const fs = require('fs');


const createUserFolder = function (req) {
  const storageFolder = `Storage/${req.user.id}/Videos/`;
  const tempFolder = path.join(storageFolder, 'temp');


  try {
    if (!fs.existsSync(tempFolder)) {
      fs.mkdirSync(tempFolder, { recursive: true });
      console.log('Folder is created');
    }
  } catch (err) {
    console.log(err.message);
  }
};


storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    //cb means Call Back function


    createUserFolder(req);
    cb(null, `Storage/${req.user.id}/Videos/temp`);
  },


  filename: async function (req, file, cb) {
    const { filename, chunkIndex } = req.query;

    const ext = file.mimetype.split('/')[1];
    cb(null, `TEMP_${filename.split('.')[0]}.${chunkIndex}`);
  },
});


const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith('video') ? cb(null, true) : cb('wrong type', false);
};


const upload = multer({ storage: storage, fileFilter: multerFilter }).array(
  'chunk',
  50000
);


// Middleware to handle file count
exports.videoUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (req.files.length > 50000) {
      return res
        .status(400)
        .json({ status: 'Failed', message: 'Too much files upload at once' });
    } else if (req.files.length === 0) {
      return res.status(400).json({
        status: 'failed',
        message: 'Failed to upload video data ' + err,
      });
    }


    next();
  });
};





