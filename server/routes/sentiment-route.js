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

// GET personalized "For You" recommendations based on aspect pairs
router.get('/recommend-for-you', authenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id;

        // Extract the books purchased by the user (to exclude them)
        const userOrders = await Order.find({ user: userId }).select('book').lean();
        const purchasedIds = new Set(userOrders.map(o => String(o.book)));

        // Define the aspect pairs and their labels
        const aspectPairs = [
            { key: 'story_themes', label: 'Rich story & deep themes', a1: 'story', a2: 'themes' },
            { key: 'characters_suspense', label: 'Complex characters & high suspense', a1: 'characters', a2: 'suspense' },
            { key: 'book_story', label: 'Well-crafted book & captivating story', a1: 'book', a2: 'story' },
            { key: 'characters_themes', label: 'Deep characters & meaningful themes', a1: 'characters', a2: 'themes' },
            { key: 'book_themes', label: 'Well-crafted book & deep themes', a1: 'book', a2: 'themes' },
            { key: 'book_suspense', label: 'Well-crafted book & high suspense', a1: 'book', a2: 'suspense' },
            { key: 'story_suspense', label: 'Engaging story & high suspense', a1: 'story', a2: 'suspense' },
            { key: 'characters_book', label: 'Complex characters & well-crafted book', a1: 'characters', a2: 'book' },
            { key: 'themes_suspense', label: 'Deep themes & high suspense', a1: 'themes', a2: 'suspense' },
            { key: 'characters_story', label: 'Rich characters & captivating story', a1: 'characters', a2: 'story' },
            { key: 'writing_style_translation', label: 'Polished writing style & accurate translation', a1: 'writing style', a2: 'translation' },
            { key: 'writing_style_plot', label: 'Exquisite writing style & strong plot', a1: 'writing style', a2: 'plot' },
            { key: 'translation_plot', label: 'Accurate translation & strong plot', a1: 'translation', a2: 'plot' },
            { key: 'translation_pacing', label: 'Accurate translation & good pacing', a1: 'translation', a2: 'pacing' },
            { key: 'dialogue_pacing', label: 'Witty dialogue & good pacing', a1: 'dialogue', a2: 'pacing' },
            { key: 'dialogue_suspense', label: 'Witty dialogue & high suspense', a1: 'dialogue', a2: 'suspense' },
            { key: 'plot_pacing', label: 'Engaging plot & steady pacing', a1: 'plot', a2: 'pacing' },
            { key: 'plot_themes', label: 'Engaging plot & meaningful themes', a1: 'plot', a2: 'themes' },
            { key: 'writing_style_story', label: 'Exquisite writing style & captivating story', a1: 'writing style', a2: 'story' },
            { key: 'dialogue_story', label: 'Witty dialogue & captivating story', a1: 'dialogue', a2: 'story' }
        ];

        const result = {};

        for (const { key, label, a1, a2 } of aspectPairs) {
            // Check if the user has ever had a review with both positive aspects
            const hasPair = await Review.exists({
                user: userId,
                [`aspects.${a1}`]: 'positive',
                [`aspects.${a2}`]: 'positive',
                rating: { $gte: 4 }
            });
            if (!hasPair) {
                result[key] = { label, books: [] };
                continue;
            }

            // Collect reviews from other users that have both positive aspects + rating ≥ 4 + positive sentiment
            const good = await Review.find({
                rating: { $gte: 4 },
                sentiment: 'positive',
                [`aspects.${a1}`]: 'positive',
                [`aspects.${a2}`]: 'positive'
            })
                .select('book')
                .lean();

            // Extract unique IDs and exclude what has already been purchased
            const uniq = Array.from(new Set(
                good.map(r => String(r.book))
                    .filter(id => !purchasedIds.has(id))
            )).slice(0, 4);

            const books = await Book.find({ _id: { $in: uniq } }).lean();

            result[key] = { label, books };
        }

        return res.json({ status: 'Success', data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
