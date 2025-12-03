const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
    name: String, // Store name to preserve history if medicine is deleted
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const saleSchema = new mongoose.Schema({
    items: [saleItemSchema],
    total: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
