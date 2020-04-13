const path = require('path');

const mongoose = require('mongoose');

const coverBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    coverImageName: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    pagesCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    }
});

bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImageName) {
        return (path.join('/', coverBasePath, this.coverImageName));
    }
})

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverBasePath = coverBasePath;