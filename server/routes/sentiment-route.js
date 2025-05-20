const router = require("express").Router();
const Review = require('../models/review');
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


module.exports = router;
