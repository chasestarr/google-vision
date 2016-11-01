const vision = require('node-cloud-vision-api');
const express = require("express");
const multer  = require('multer');
const crypto = require('crypto');
const path = require('path');

vision.init({auth: 'AIzaSyB34hbutVzDgi6foXkDZ5kIjsQtu1zAthU'});

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, 'username' + path.extname(file.originalname));
  },
});
const upload = multer({ storage : storage}).single('userPhoto');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        let username = 'username';
        let image = require('path').resolve(__dirname, 'uploads/' + username + '.JPG');
        console.log('about to ocr');


        // ==== Google vision api ====
        const req = new vision.Request({
          image: new vision.Image(image),
          features: [
            new vision.Feature('TEXT_DETECTION', 10)
          ]
        });

        vision.annotate(req).then((result) => {
          // handling response
          let description = result.responses[0].textAnnotations[0].description;
          res.json(description);
        }, (e) => {
          console.log('Error: ', e)
        });
    });
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});