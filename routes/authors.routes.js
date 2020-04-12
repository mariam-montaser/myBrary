const express = require('express');

const authorsControllers = require('../controllers/authors.controllers');

const router = express.Router();

router.get('/', authorsControllers.allAuthors);
router.get('/new', authorsControllers.newAuthorPage);
router.post('/', authorsControllers.createAuthor);


module.exports = router;