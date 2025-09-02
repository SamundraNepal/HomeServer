const mongoose = require('mongoose');

const video_Schema = new mongoose.Schema({
  viodeoName: { type: String, default: 'Memoreis' },
  videoURL: { type: String, default: 'missing' },
  thumbnailsURL: { type: String, default: 'missing' },

  backUpDate: { type: String, default: new Date() },

  make: { type: String, default: 'Memoreis_SAM' },
  model: { type: String, default: 'Memories_SAM_V_1.0' },

  videoDuration: { type: String, default: 'Missing' },

  dateTimeOriginal: { type: String, default: new Date() },

  videoWidthAndHeight: { type: String, default: 'Missing' },
  videoMegaPixels: { type: String, default: 'Missing' },

  videoTakenPlace: { type: String, default: 'Missing' },

  gPSLatitudeAndLongitude: { type: String, default: '00000S 00000N' },

  videoFileSize: { type: String},

  videoAlbums: { type: [String], default: [] },

  isActive: { type: Boolean, default: true, select: false },
  storageCheck :{type:Boolean, default:true}

});

video_Schema.pre('save', function (next) {
  this.videoFileSize = (parseFloat(this.videoFileSize / 1024) / 1024).toFixed(
    2
  );
  

    // Convert videoDuration from object to seconds if needed
    if (typeof this.videoDuration === 'object' && this.videoDuration.Scale && this.videoDuration.Value) {
      const seconds = this.videoDuration.Scale * this.videoDuration.Value;
      this.videoDuration = `${Math.floor(seconds)} seconds`;
    }
  next();
});

const videoModel = function (userId) {
  return mongoose.model(`videoModel_schema/${userId}`, video_Schema);
};

module.exports = videoModel;
