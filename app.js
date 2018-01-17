const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
var multer = require('multer');

// Connect To Database
mongoose.connect(config.database, {
  useMongoClient: true,
  /* other options */
});

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');
const cv = require('./routes/cv');

// Port Number
const port = process.env.PORT || 8888;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/cv', cv);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './public/assets/downloads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

var upload = multer({ //multer settings
              storage: storage
          }).single('file');

/** API path that will upload the files */
app.post('/public/assets/downloads', function(req, res) {
  upload(req,res,function(err){
      console.log(req.file);
      if(err){
           res.json({error_code:1,err_desc:err});
           return;
      }
       res.json({error_code:0,err_desc:null});
  });
});


// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});


