const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user', 
            required: true
        },
        book: {
            type: mongoose.Types.ObjectId,
            ref: 'books', 
            required: true
        },
        rating: {
            type: Number, min: 1, max: 5,
            required: true
        },
        comment: {
            type: String,
            trim: true

        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('review', reviewSchema);
