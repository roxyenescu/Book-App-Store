const Order = require("../models/order");

// Books sold by genre this year
exports.genreSalesYear = async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const data = await Order.aggregate([
            {
                $match: {
                    status: "Delivered",
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "bookDoc"
                }
            },
            { $unwind: "$bookDoc" },
            { $unwind: "$bookDoc.genre" },
            {
                $group: {
                    _id: "$bookDoc.genre",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Distribution of orders by status in the current year
exports.statusDistributionYear = async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const data = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
