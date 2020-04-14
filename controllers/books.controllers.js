const fs = require('fs');
const path = require('path');

const Book = require('../models/book');
const Author = require('../models/author');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const uploadedPath = path.join('public', Book.coverBasePath); //multer

exports.newBookPage = async (req, res) => {
    renderPage(res, new Book(), 'new');
    // try {
    //     const authors = await Author.find();
    //     const book = new Book();
    //     res.render('books/new', {
    //         book,
    //         authors
    //     })
    // } catch (error) {
    //     res.redirect('/books');
    // }
}

exports.createBook = async (req, res) => {
    console.log(req.body)
    const fileName = (req.file) ? req.file.filename : null; //multer
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        pagesCount: req.body.pagesCount,
        coverImageName: fileName, //multer
        publishDate: new Date(req.body.publishDate)
    });
    // filepond
    // saveCover(book, req.body.cover)
    try {
        const newBook = await book.save();
        res.redirect(`/books/${newBook._id}`);
    } catch (error) {
        console.log(error)
        removeBookCover(book, coverImageName); //multer
        renderPage(res, book, 'new', true);
    }
}

exports.allBooks = async (req, res) => {
    let query = Book.find();
    if (req.query.title && req.query.title !== '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore && req.query.publishedBefore !== '') {
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter && req.query.publishedAfter !== '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    try {
        const books = await query.exec();
        res.render('books/index', { books, searchOption: req.query })
    } catch (error) {
        res.redirect('/');
    }
}

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author');
        res.render('books/show', { book })
    } catch (error) {
        res.redirect('/');
    }
}

exports.editBook = async (req, res) => {
    const book = await Book.findById(req.params.id);
    renderPage(res, book, 'edit');
}

exports.updateBook = async (req, res) => {
    console.log(req.body)
    let book;
    try {
        book = await Book.findById(req.params.id);
        const fileName = (req.file) ? req.file.filename : book.coverImageName; //multer
        book.title = req.body.title;
        book.author = req.body.author;
        book.description = req.body.description;
        book.pagesCount = req.body.pagesCount;
        book.coverImageName = fileName; //multer
        book.publishDate = new Date(req.body.publishDate);
        await book.save();
        res.redirect(`/books/${book._id}`);
    } catch (error) {
        console.log(error)
        removeBookCover(book, coverImageName); //multer
        renderPage(res, book, 'edit', true);
    }
}

exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndRemove(req.params.id);
        res.redirect('/books')
    } catch (error) {
        redirect(`/books/${req.body.id}`);
    }
}

async function renderPage(res, book, page, hasError = false) {
    try {
        const authors = await Author.find();
        const data = {
            book,
            authors
        }
        if (hasError) {
            data.error = `Error saving book.`;
        }
        res.render(`books/${page}`, data);
    } catch (error) {
        res.redirect('/books');
    }
}

// for deleting cover if there's an error // multer
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadedPath, fileName), err => {
        if (err) console.error(err);
    });
}

// filepond
// const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
// function saveCover(book, coverData) {
//     if (!coverData) return;
//     const cover = JSON.parse(coverData);
//     if (cover != null && imageMimeTypes.includes(cover.type)) {
//         book.coverImage = new Buffer.from(cover.data, 'base64');
//         book.coverImagetype = cover.type;
//     }

// }