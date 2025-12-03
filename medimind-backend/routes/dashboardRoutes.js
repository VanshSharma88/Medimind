
const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

router.use(authMiddleware);

router.get("/stats", async (req, res) => {
    try {
        const totalSalesResult = await Sale.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } }, // Filter by user
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].total : 0;

        const totalMedicines = await Medicine.countDocuments({ user: req.user.id });

        const lowStock = await Medicine.countDocuments({ user: req.user.id, quantity: { $lt: 10 } });

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const nearExpiry = await Medicine.countDocuments({
            user: req.user.id,
            expiryDate: { $gte: new Date(), $lte: thirtyDaysFromNow }
        });

        // Get recent sales for trend (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentSales = await Sale.find({ user: req.user.id, date: { $gte: sevenDaysAgo } })
            .sort({ date: 1 });

        const formattedRecentSales = recentSales.map(s => ({
            id: s._id,
            ...s._doc
        }));

        res.json({
            totalSales,
            totalMedicines,
            lowStock,
            nearExpiry,
            recentSales: formattedRecentSales,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
