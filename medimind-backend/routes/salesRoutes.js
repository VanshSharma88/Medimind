const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/authMiddleware");

// Apply middleware
router.use(authMiddleware);

// Get all sales for logged-in user
router.get("/", async (req, res) => {
    try {
        const sales = await Sale.find({ user: req.user.id }).sort({ date: -1 });
        const formattedSales = sales.map(s => ({
            id: s._id,
            ...s._doc
        }));
        res.json(formattedSales);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Record a new sale
router.post("/", async (req, res) => {
    const { items } = req.body; // items: [{ medicineId, quantity }]
    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items in sale" });
    }

    try {
        let total = 0;
        const saleItemsData = [];
        const medicinesToUpdate = [];

        // 1. Validate all items and check stock (scoped to user)
        for (const item of items) {
            const medicine = await Medicine.findOne({ _id: item.medicineId, user: req.user.id });

            if (!medicine) {
                return res.status(404).json({ message: `Medicine not found` });
            }

            if (medicine.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${medicine.name} (Available: ${medicine.quantity})` });
            }

            total += medicine.price * item.quantity;
            saleItemsData.push({
                medicineId: medicine._id,
                name: medicine.name,
                quantity: item.quantity,
                price: medicine.price,
            });

            medicinesToUpdate.push({ medicine, quantity: item.quantity });
        }

        // 2. Update stock (only if all validations pass)
        for (const update of medicinesToUpdate) {
            update.medicine.quantity -= update.quantity;
            await update.medicine.save();
        }

        // 3. Create Sale record
        const sale = await Sale.create({
            total,
            items: saleItemsData,
            user: req.user.id, // Associate with user
        });

        res.status(201).json({ id: sale._id, ...sale._doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
