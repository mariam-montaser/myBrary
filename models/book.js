const path = require('path');  // multer

const mongoose = require('mongoose');

const coverBasePath = 'uploads/bookCovers'; // multer

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    coverImageName: { //multer
        type: String,
        required: true
    },
    // coverImage: {
    //     type: Buffer,
    //     required: true
    // },
    // coverImageType: {
    //     type: String,
    //     required: true
    // },
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

// multer
bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImageName) {
        return (path.join('/', coverBasePath, this.coverImageName));
    }
})

// filepond
// bookSchema.virtual('coverImagePath').get(function () {
//     if (this.coverImage && this.coverImageType) {
//         return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
//     }
// })

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverBasePath = coverBasePath; // multer