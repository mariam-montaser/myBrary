const Author = require('../models/author');

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
        // res.redirect(`/authors/${newAuthor._id}`);
        res.redirect('/authors');
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