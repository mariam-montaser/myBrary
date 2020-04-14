const express = require('express');

const authorsControllers = require('../controllers/authors.controllers');

const router = express.Router();

router.get('/', authorsControllers.allAuthors);
router.get('/new', authorsControllers.newAuthorPage);
router.post('/', authorsControllers.createAuthor);
router.get('/:id', authorsControllers.getAuthor);
router.get('/edit/:id', authorsControllers.editAuthor);
router.put('/:id', authorsControllers.updateAuthor);
router.delete('/:id', authorsControllers.deleteAuthor);


module.exports = router;