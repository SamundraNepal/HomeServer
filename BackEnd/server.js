const app = require('./app.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Corrected the typo here

//global varibables
dotenv.config({ path: './config.env' });

mongoose
  .connect('mongodb://localhost:27017')
  .then(() => {
    console.log('Connection to Data Base is Successfull');
  })
  .catch((err) => {
    'Failed to connect to the DataBase. Error reason: ' + err;
  });
  app.get('/',(req , res ) =>{
    res.send("yo hamro pachadi ko ho yaad ko");
  })

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Samundra photos is listening on port ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
  );
});
