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

// GET Original Picks — public
// Top 4 books with positive originality aspect, 5 stars and positive reviews
router.get('/original-picks', async (req, res) => {
    try {
        const agg = await Review.aggregate([
            {
                $match: {
                    rating: 5,
                    sentiment: 'positive',
                    'aspects.originality': 'positive'
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
            {
                $limit: 4
            }
        ]);

        const bookIds = agg.map(item => item._id);
        let books = await Book.find({ _id: { $in: bookIds } }).lean();

        books = bookIds
            .map(id => books.find(b => b._id.toString() === id.toString()))
            .filter(Boolean);

        res.json({ status: 'Success', data: books });
    } catch (err) {
        console.error('Error in /original-picks:', err);
        res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
});

// GET Laugh-Out-Loud Reads — public
// Top 4 books with positive humor aspect, 5 stars and positive reviews
router.get('/laugh-out-loud-reads', async (req, res) => {
    try {
        const agg = await Review.aggregate([
            {
                $match: {
                    rating: 5,
                    sentiment: 'positive',
                    'aspects.humor': 'positive'
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
            {
                $limit: 4
            }
        ]);

        const bookIds = agg.map(item => item._id);
        let books = await Book.find({ _id: { $in: bookIds } }).lean();

        books = bookIds
            .map(id => books.find(b => b._id.toString() === id.toString()))
            .filter(Boolean);

        res.json({ status: 'Success', data: books });
    } catch (err) {
        console.error('Error in /laugh-out-loud-reads:', err);
        res.status(500).json({ status: 'Error', message: 'Internal server error' });
    }
});

module.exports = router;