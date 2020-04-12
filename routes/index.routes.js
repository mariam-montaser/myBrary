const express = require('express');

const indexController = require('../controllers/index.controllers')

const router = express.Router();

router.get('/', indexController.getHomepage)

module.exports = router;