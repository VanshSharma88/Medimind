const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/authMiddleware");

// Apply middleware to all routes
router.use(authMiddleware);

// Get all medicines for the logged-in user
router.get("/", async (req, res) => {
    try {
        const medicines = await Medicine.find({ user: req.user.id }).sort({ createdAt: -1 });
        const formattedMedicines = medicines.map(m => ({
            id: m._id,
            ...m._doc
        }));
        res.json(formattedMedicines);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Add new medicine
router.post("/", async (req, res) => {
    const { name, description, category, price, quantity, expiryDate, supplier } = req.body;
    try {
        const medicine = await Medicine.create({
            name,
            description,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            expiryDate: new Date(expiryDate),
            supplier,
            user: req.user.id, // Associate with logged-in user
        });
        res.status(201).json({ id: medicine._id, ...medicine._doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update medicine
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, quantity, expiryDate, supplier } = req.body;
    try {
        const medicine = await Medicine.findOneAndUpdate(
            { _id: id, user: req.user.id }, // Ensure user owns the medicine
            {
                name,
                description,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                expiryDate: new Date(expiryDate),
                supplier,
            },
            { new: true }
        );

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found or unauthorized" });
        }

        res.json({ id: medicine._id, ...medicine._doc });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete medicine
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const medicine = await Medicine.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure user owns the medicine

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found or unauthorized" });
        }

        res.json({ message: "Medicine deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
