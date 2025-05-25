const router = require('express').Router();
const Review = require('../models/review');
const Book = require('../models/book');
const Order = require('../models/order');

// GET Hot This Week — public
// Group the positive 5 stars reviews from the last 7 days
router.get('/hot-this-week', async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const agg = await Review.aggregate([
            {
                $match: {
                    createdAt: { $gte: oneWeekAgo },
                    rating: 5,
                    sentiment: 'positive'
                }
            },
            {
                $group: {
                    _id: '$book',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            { $limit: 4 }
        ]);

        const bookIds = agg.map(a => a._id);
        const books = await Book.find({ _id: { $in: bookIds } }).lean();
        res.json({ status: 'Success', data: books });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET Most Purchased This Week — public
// Top 4 books most purchased in the last 7 days
router.get('/most-purchased-this-week', async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const agg = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: oneWeekAgo }
                }
            },
            {
                $group: {
                    _id: '$book',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            { $limit: 4 }
        ]);

        const bookIds = agg.map(a => a._id);
        const books = await Book.find({ _id: { $in: bookIds } }).lean();
        res.json({ status: 'Success', data: books });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
