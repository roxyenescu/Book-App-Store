const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth-route");

// ADD BOOK - ADMIN
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            res.status(400).json({ message: "You have not access to perform admin work!" });
        }

        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({ message: "Book added successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// UPDATE BOOK - ADMIN
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;

        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });

        res.status(200).json({ message: "Book updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// DELETE BOOK - ADMIN
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);

        res.status(200).json({ message: "Book deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET ALL BOOKS
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "Success",
            data: books,
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET RECENTLY ADDED BOOKS (limit 4)
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "Success",
            data: books,
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET BOOK BY ID
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        return res.json({
            status: "Success",
            data: book,
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

});

module.exports = router;