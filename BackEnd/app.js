
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors'); // Import the cors package
var cookieParser = require('cookie-parser');

//for security
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

app.use(express.json()); // Middleware to parse incoming JSON bodies
app.set("trust proxy", 1); // Trust first proxy (set to true or a number depending on your setup)



//Global
app.use(cors({origin:'https://memories.snapforlifes.online'}));

//limit request
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 100, //1 hrs request limit

  message:
    'Too many request received. Server is in cool down period. Server will be back after an hour',
});
app.use('/v1', limiter);

app.use(mongoSanitize()); // prevent no sql attacks

//data sanitize
app.use(xss());

app.use(cookieParser());
app.use(express.json({ limit: '900mb' }));
app.use(express.urlencoded({ limit: '900mb', extended: true }));
app.use((req, res, next) => {
    res.setHeader('Transfer-Encoding', 'chunked');
    next();
});


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://memories.snapforlifes.online');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
  }
  
  next();
});






// Import route files
const imagesRoute = require('./Routes/imageRoute');
const videosRoute = require('./Routes/videoRoute');
const userRoutes = require('./Routes/userRoute');
const whiteListRoute = require('./Routes/whitelist');

// Serve static files
app.use('/Storage', express.static(path.join(__dirname, 'Storage')));

// Set up routes
app.use('/v1/memories/images', imagesRoute);
app.use('/v1/memories/videos', videosRoute);
app.use('/v1/memories', userRoutes);
app.use('/v2/memories/whiteList', whiteListRoute);

// Export app module
module.exports = app;
