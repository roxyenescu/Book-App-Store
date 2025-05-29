const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const { authenticateToken } = require("./userAuth-route");
const stats = require("../controllers/statsController");

// PLACE ORDER
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();

            // Save Order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id },
            });

            // Clear cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id },
            });
        }

        return res.json({
            status: "Success",
            message: "Order Placed Successfully!"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET ORDER HISTORY OF PARTICULAR USER
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });

        const orderData = userData.orders.reverse();

        return res.json({
            status: "Success",
            data: orderData,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET ALL ORDERS
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
            .populate({
                path: "book",
            })
            .populate({
                path: "user",
            })
            .sort({
                createdAt: -1
            });

        return res.json({
            status: "Success",
            data: userData,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// UPDATE ORDER - ADMIN
router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await Order.findByIdAndUpdate(id, { status: req.body.status });

        return res.json({
            status: "Success",
            message: "Status Updated Successfully!"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GENRE SALES CURRENT YEAR
router.get("/stats/genre-sales-year", authenticateToken, async (req, res) => {
    return stats.genreSalesYear(req, res);
});

// STATUS DISTRIBUTION
router.get("/stats/status-distribution", authenticateToken, async (req, res) => {
    return stats.statusDistributionYear(req, res);
});


module.exports = router;