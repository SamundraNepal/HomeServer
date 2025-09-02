
const express = require('express');
const router = express.Router();

//Inheritance
const imageController = require('../ModelViewController/Controller/imageController');
const authController = require('../ModelViewController/Controller/authController');
const videoController = require('../ModelViewController/Controller/videoController');


router
.route('/getImageBase64Code')
.post(authController.protect, imageController.Base64Converter);


module.exports = router;
