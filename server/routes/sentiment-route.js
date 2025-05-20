const router = require("express").Router();
const Review = require('../models/review');
const Book = require("../models/book");
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


module.exports = router;
