const fs = require('fs');
const path = require('path');

const Book = require('../models/book');
const Author = require('../models/author');

const uploadedPath = path.join('public', Book.coverBasePath);

exports.newBookPage = async (req, res) => {
    renderPage(res, new Book());
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
    console.log(req.body.publishDate);
    console.log(req.body.author);
    const fileName = (req.file != null) ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        pagesCount: req.body.pagesCount,
        coverImageName: fileName,
        publishDate: new Date(req.body.publishDate)
    });
    try {
        const newBook = await book.save();
        // res.redirect(`/books/${newBook._id}`);
        res.redirect('/books');
    } catch (error) {
        removeBookCover(book.coverImageName);
        renderPage(res, book, true);
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

async function renderPage(res, book, hasError = false) {
    try {
        const authors = await Author.find();
        const data = {
            book,
            authors
        }
        if (hasError) {
            data.error = 'Error creating a new book.';
        }
        res.render('books/new', data);
    } catch (error) {
        res.redirect('/books');
    }
}

// for deleting cover if there's an error
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadedPath, fileName), err => {
        if (err) console.error(err);
    });
}