const Author = require('../models/author');
const Book = require('../models/book');

exports.newAuthorPage = (req, res) => {
    res.render('authors/new', {
        author: new Author()
    })
}

exports.createAuthor = async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`/authors/${newAuthor._id}`);
    } catch (error) {
        res.render('authors/new', {
            author,
            error: 'Error creating new author.'
        })
    }
}

// exports.createAuthor = (req, res) => {
//     const author = new Author({
//         name: req.body.name
//     });
//     author.save((err, newAuthor) => {
//         if (err) {
//             res.render('authors/new', {
//                 author,
//                 error: 'Error creating new author.'
//             })
//         } else {
//             // res.redirect(`/authors/${newAuthor._id}`);
//             res.redirect(`/authors`);
//         }
//     })
// }

exports.allAuthors = async (req, res) => {
    let searchOption = {};
    if (req.query.name != null && req.query.name !== "") {
        searchOption.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchOption);
        res.render('authors/index', { authors, searchOption: req.query });
    } catch (error) {
        res.redirect('/');
    }
}

exports.getAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author._id }).limit(5);
        res.render('authors/show', { author, books });
    } catch (error) {
        res.redirect('/');
    }
}

exports.editAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author });
    } catch (error) {
        res.redirect('/authors');
    }
}

exports.updateAuthor = async (req, res) => {
    let author;
    try {
        author = await Author.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/authors/' + author._id);
    } catch (error) {
        res.render('authors/edit', { author, error: 'Error Updating Author.' })
    }
}

exports.deleteAuthor = async (req, res) => {
    try {
        console.log('success')
        await Author.remove({ _id: req.params.id }, { multi: false });
        res.redirect('/authors/');
    } catch (error) {
        console.log(error)
        res.redirect(`/authors/${req.params.id}`);
    }
}