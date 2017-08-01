/**
 * Created by harshitbisht96 on 26/7/17.
 */
const express=require('express');
const fs=require('fs');
const path=require('path');
var hbs = require('hbs');
const app=express();
const bp = require('body-parser');
const cp=require('cookie-parser');
const multer=require('multer');
const mongo=require('mongodb');
const homeRoute=require('./routes/home');
var db=require('./database.js');

// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/uploads/')); // static files & images placed here

// const Grid=require('gridfs-stream');
var file2upload,fileName,filePath;
// const db = new mongo.Db('gridDb', new mongo.Server("127.0.0.1", 27017));
// const gfs = Grid(db, mongo);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        file2upload=file.originalname;
        fileName=file.fieldname + '-' + Date.now()+'.'+file.mimetype.toString().split("/")[1];
        cb(null, fileName);
        filePath=path.join(__dirname,'uploads/');
        filePath+=fileName;
    }
});
filePath=path.join(__dirname,'uploads/');
filePath+=fileName;
var upload = multer({ storage: storage }).single('avatar');

app.use(bp.json());
app.use(bp.urlencoded());
app.use(cp());

// gfs.files.find({ aliases: 2 }).toArray(function (err, files) {
//     if (err) {
//         console.log(err);
//
//     }
//     console.log(files);
//
// });

app.use('/',homeRoute);

app.post('/upload', function (req, res) {

    upload(req, res, function (err) {

        if (err) {
            // An error occurred when uploading
            console.log(err);
            return;
        }

        db.then(function(data){
           var postStory=req.body.story;
            var imageCollection=data.collection('images');
           imageCollection.insert({"story":postStory,"image":filePath}).then(function(){
                console.log("Success");
            })
        })

        // console.log(file2upload);
        // db.open(function (err) {
        //     if (err){
        //         console.log(err);
        //         return;
        //     }
        //
        //     console.log(gfs.files);
        //     console.log("Database is ready..")
        //
        //     var writestream = gfs.createWriteStream({
        //         filename: file2upload,
        //         aliases:2
        //     });
        //
        //     fs.createReadStream(filePath).pipe(writestream);
        //     writestream.on('close',function(file){
        //         console.log(file.filename+' written to database');
        //     })
        // });


        res.redirect('/');

    })


});


    // res.send("Yo")


app.listen(1111,function(){
    console.log("app running at http://localhost:1111");
});

