const path = require('path');

const multer = require('multer');
const express = require('express');

const booksControllers = require('../controllers/books.controllers');
const Book = require('../models/book');

const uploadedPath = path.join('public', Book.coverBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
    dest: uploadedPath,
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))
    }
})


const router = express.Router();

router.get('/', booksControllers.allBooks);
router.get('/new', booksControllers.newBookPage);
router.post('/', upload.single('cover'), booksControllers.createBook);


module.exports = router;