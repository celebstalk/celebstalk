var express = require("express");
var multer  = require("multer");
var crypto= require('crypto');
var ejs     = require ("ejs");
var bodyparser= require("body-parser");
var mongoose= require("mongoose");
var path    = require("path");
var GridFsStorage  = require("multer-gridfs-storage");
var Grid  = require("gridfs-stream");
var methodOverride  = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var app= express();
app.set("view engine", "ejs");
app.use(express.static('./public'));
app.use(bodyparser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/views'));
const mongoURI='mongodb://kshitijshrm:kshitij48@ds231961.mlab.com:31961/celebstalk';
const conn= mongoose.createConnection(mongoURI); 

//passport Configuration
app.use(require("express-session")({
    secret:"I love Ananya",
    resave:false,
    saveUninitialised:false
}));

//init gfs
let gfs;

conn.once('open',()=>{
    //init stream
    gfs=Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})
//set storage engine
var storage= new GridFsStorage({
    url: mongoURI,
    file : (req,file) =>{
    return new Promise((resolve,reject)=>{
        crypto.randomBytes(16,(err,buf)=>{
            if(err){
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename :filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    });
}
});
const upload = multer({storage});
app.get("/", function(req, res){
    res.render("index");
})


app.get("/uploadimage", function(req, res){
    res.render("uploadimage");
})

app.get("/about", function(req, res){
    res.render("about");
})

app.get("/aishwarya", function(req, res){
    res.render("aishwarya");
})

app.get("/alia", function(req, res){
    res.render("alia");
})

app.get("/anushka", function(req, res){
    res.render("anushka");
})

app.get("/deepika", function(req, res){
    res.render("deepika");
})

app.get("/katrina", function(req, res){
    res.render("katrina");
})

app.get("/contact", function(req, res){
    res.render("contact");
})


app.get("/imagegallery", function(req, res){
    gfs.files.find().toArray((err, files) => {
        // check if file
        if(!files || files.length === 0) {
            res.render('theimagegallery', {files :false});
        }
        else{
            files.map(file =>{
                if(file.contentType==='image/jpeg' ||file.contentType==='image/jpg' || file.contentType==='image/png')
                {
                    file.isImage= true;
                } else {
                    file.isImage= false;
                    res.send("go back and upload only image file")
                }
            });
           res.render('theimagegallery', {files :files});    
        }
        
    });
})


app.post('/upload', upload.single('file'), (req, res) =>{
    
    res.redirect('/');
});

app.get('/files', (req,res) =>{
    gfs.files.find().toArray((err, files) => {
        // check if file
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // file exist
        return res.json(files);
    });
}); 


    // route get file name
    app.get('/files/:filename', (req,res) =>{
        gfs.files.findOne({filename: req.params.filename},(err,file) =>{
            // check if file
            if(!file || file.length=== 0){
                return res.status(404).json({
                    err: 'No file exists'
                });
            }
            // file exist
            return res.json(file);
        });
    }); 
    
     // route get image name
    app.get('/image/:filename', (req,res) =>{
        gfs.files.findOne({filename: req.params.filename},(err,file) =>{
            // check if file
            if(!file || file.length=== 0){
                return res.status(404).json({
                    err: 'No file exists'
                });
            }
            // check if image
            if(file.contenType === 'image/jpeg' || file.contentType==='image/jpeg' || file.contentType === 'image/png'){
                // read output  to browser
                const readstream= gfs.createReadStream(file.filename);
                readstream.pipe(res);
            }
            else
            res.status(404).json({
                err :'not an image'
            });
        });
    }); 
// open port
app.listen(process.env.PORT, process.env.IP , function(){
    console.log("server has started");
});