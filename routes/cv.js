var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Book = require('../models/cv');

/* GET ALL BOOKS */
router.get('/', function(req, res, next) {
  Book.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function(req, res, next) {
  Book.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE BOOK */
router.post('/', function(req, res, next) {
  Book.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE BOOK */
router.put('/:id', function(req, res, next) {
  Book.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE BOOK */
router.delete('/:id', function(req, res, next) {
  Book.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/download/:id', function (req, res)
{
    if (!req.user) // Authentication | Checks for an authenticated user if not send back error
    {
        return res.send(401);
    }

    var id           = req.params.id, // ID will be used when creating the archive
        fileContents = req.body.fileData, // The data to be written to our file
        output       = fs.createWriteStream('downloads/' + id + '.zip'), // Create a write stream for the archive
        archive      = archiver('zip'); // Set our archive to zip format

    fs.writeFile('downloads/file_' + id + '.pdf', fileContents, function (err) // Create a html file using the fileContents
    {
        if (err) // Error when creating file send back error...
        {
            return res.send(500);
        }

        archive.pipe(output);

        archive.bulk([
          {cwd: 'downloads', src: ['file_' + id + '.pdf'], dest: '/', expand : true} // Add the newly created .html file to the archive
        ]);

        archive.on('end', function () // Once the archive has been created...
        {   
            fs.unlink('downloads/file_' + id + '.pdf'); // Delete the temporary file
            return res.json({success : true}); // Return success message
        });

        archive.finalize(); // Complete our archive now we have added the 'end' event callback         
    });
});

router.get('file/:id', function (req, res)
{
    var error    = false, // Set a flag to check for errors in downloading the file
        filePath = 'downloads/' + req.params.id + '.zip'; // Store the path to the file
        stream = fs.createReadStream(filePath, {bufferSize: 64 * 1024}); // Create a readstream for our file

    stream.pipe(res);

    stream.on('error', function (err) // Error when downloading...
    {
        error = true; 
    });

    stream.on('close', function () // Finished downloading...
    {   
        if (!error) // If no errors occured
        {
            fs.unlink(filePath); // Delete the archive
        }
    });            
});

module.exports = router;
