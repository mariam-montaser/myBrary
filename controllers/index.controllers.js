const Book = require('../models/book');

exports.getHomepage = async (req, res) => {
    let books;
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10);
    } catch (error) {
        books = [];
    }
    res.render('index', { books });
}