const router = require("express").Router();
const Review = require('../models/review');
const Book = require("../models/book");
const Order = require('../models/order');
const axios = require('axios');
const { authenticateToken } = require("./userAuth-route");

// GET  which authors/genres each user enjoys or dislikes
router.get('/user-sentiments', authenticateToken, async (req, res) => {
    const userId = req.headers.id;
    // Fetch all this user’s reviews including book data
    const reviews = await Review.find({ user: userId })
        .populate('book', 'author genre');

    // Build counters
    const posAuth = {}, negAuth = {};
    const posGenre = {}, negGenre = {};

    reviews.forEach(r => {
        r.book.genre.forEach(g => {
            if (r.sentiment === 'positive') posGenre[g] = (posGenre[g] || 0) + 1;
            if (r.sentiment === 'negative') negGenre[g] = (negGenre[g] || 0) + 1;
        });
        const a = r.book.author;
        if (r.sentiment === 'positive') posAuth[a] = (posAuth[a] || 0) + 1;
        if (r.sentiment === 'negative') negAuth[a] = (negAuth[a] || 0) + 1;
    });

    res.json({
        status: 'Success',
        data: { posAuth, negAuth, posGenre, negGenre }
    });
});

// Helper for user-sentiments
async function fetchUserSentiments(userId, authHeader) {
    const res = await axios.get(
        'http://localhost:1000/api/v1/user-sentiments',
        {
            headers: {
                id: userId,
                authorization: authHeader
            }
        }
    );
    return res.data.data;
}

// GET positive-based recommendations
router.get('/recommend-from-sentiment', authenticateToken, async (req, res) => {
    const userId = req.headers.id;
    const authHdr = req.headers.authorization;

    // 1) Get user’s sentiment profile
    const { posAuth, posGenre } = await fetchUserSentiments(userId, authHdr);

    // 2) Pick top author and genre
    const topAuthor = Object.entries(posAuth).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topGenre = Object.entries(posGenre).sort((a, b) => b[1] - a[1])[0]?.[0];

    // 3) Fetch all books and filter out ones already reviewed
    const allBooks = await Book.find().lean();
    const userReviews = await Review.find({ user: userId }).select('book');
    const reviewedIds = new Set(userReviews.map(r => String(r.book)));

    // 4) Recommend by matching topAuthor or topGenre
    const recs = allBooks.filter(b => {
        if (reviewedIds.has(String(b._id))) return false;
        if (b.author === topAuthor) return true;
        if (b.genre.includes(topGenre)) return true;
        return false;
    }).slice(0, 8);

    res.json({ status: 'Success', data: { topAuthor, topGenre, recs } });
});

// GET recommendations after very positive review
// -> rating ≥ 4 
// -> positive sentiment  
// -> positive "book"/"story" aspects
router.get('/recommend-by-review/:bookId', authenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id;
        const reviewedBookId = req.params.bookId;

        // Check if the current review left is positive or not
        const hasPerfectReview = await Review.exists({
            user: userId,
            book: reviewedBookId,
            rating: 5
        });
        if (!hasPerfectReview) {
            return res.json({ status: 'Success', data: [] });
        }

        // Get the genres of the reviewed book
        const baseBook = await Book.findById(reviewedBookId).lean();
        if (!baseBook) return res.status(404).json({ message: 'Book not found' });
        const genres = baseBook.genre;

        // Find out what books the user has already purchased (not to recommend them)
        const userOrders = await Order.find({ user: userId }).select('book');
        const purchasedIds = userOrders.map(o => String(o.book));

        // Find all books in the same genres, excluding already purchased and reviewed ones
        const candidates = await Book.find({
            _id: { $nin: [...purchasedIds, reviewedBookId] },
            genre: { $in: genres },
        }).select('_id').lean();
        const candidateBookIds = candidates.map(b => b._id);

        if (candidateBookIds.length === 0) {
            return res.json({ status: 'Success', data: [] });
        }

        // Filter them by rating ≥ 4 + only reviews with positive sentiment + OR between the three scenarios:
        // a) positive book + story does NOT exist
        // b) positive story + book does NOT exist
        // c) both positive
        const goodReviews = await Review.find({
            book: { $in: candidateBookIds },
            rating: { $gte: 4 },
            sentiment: 'positive',
            $or: [
                { 'aspects.book': 'positive', 'aspects.story': { $exists: false } },
                { 'aspects.story': 'positive', 'aspects.book': { $exists: false } },
                { 'aspects.book': 'positive', 'aspects.story': 'positive' }
            ]
        })
            .select('book')
            .lean();

        const uniq = [...new Set(goodReviews.map(r => String(r.book)))].slice(0, 4);
        const recBooks = await Book.find({ _id: { $in: uniq } }).lean();

        return res.json({ status: 'Success', data: recBooks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
);


module.exports = router;
