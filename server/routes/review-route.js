const router = require('express').Router();
const Review = require('../models/review');
const Order = require('../models/order');
const { authenticateToken } = require('./userAuth-route');

// ADD REVIEW
router.post('/add-review', authenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { bookId, rating, comment } = req.body;

        // Verify user has bought this book
        const purchased = await Order.exists({ user: userId, book: bookId });
        if (!purchased) {
            return res.status(403).json({ message: 'You can only review books you purchased.' });
        }

        // Upsert a review (one per user/book)
        const review = await Review.findOneAndUpdate(
            { user: userId, book: bookId },
            { rating, comment },
            { upsert: true, new: true }
        );

        res.json({ status: 'Success', data: review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET REVIEWS OF A BOOK
router.get('/get-reviews/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });
        res.json({ status: 'Success', data: reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
