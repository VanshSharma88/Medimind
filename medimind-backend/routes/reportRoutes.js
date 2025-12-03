const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

const Report = require("../models/Report");

// Generate Report
router.post("/generate", async (req, res) => {
    const { type, startDate, endDate, format } = req.body;

    try {
        let data;
        const query = { user: req.user.id };

        if (type === "Sales Report") {
            if (startDate && endDate) {
                query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
            }
            data = await Sale.find(query).sort({ date: -1 });
        } else if (type === "Inventory Status") {
            data = await Medicine.find({ user: req.user.id }).sort({ name: 1 });
        } else {
            return res.status(400).json({ message: "Invalid report type" });
        }

        const fileName = `${type.replace(" ", "_")}_${Date.now()}.${format.toLowerCase()}`;

        // Save Report History
        const newReport = new Report({
            user: req.user.id,
            name: fileName,
            type,
            format,
            startDate: startDate || null,
            endDate: endDate || null
        });
        await newReport.save();

        res.json({
            message: "Report generated successfully",
            data: data,
            fileName: fileName,
            reportId: newReport._id
        });
    } catch (err) {
        console.error("Report generation error:", err);
        res.status(500).json({ message: err.message || "Server error generating report" });
    }
});

// Get Recent Reports
router.get("/recent", async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10);

        // Format date for frontend
        const formattedReports = reports.map(r => ({
            id: r._id,
            name: r.name,
            date: new Date(r.createdAt).toLocaleDateString(),
            type: r.format,
            reportType: r.type, // Needed for regeneration
            startDate: r.startDate,
            endDate: r.endDate
        }));

        res.json(formattedReports);
    } catch (err) {
        console.error("Error fetching recent reports:", err);
        res.status(500).json({ message: "Server error fetching reports" });
    }
});

// Re-download (Regenerate) Report Data
router.get("/download/:id", async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user.id });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        let data;
        if (report.type === "Sales Report") {
            const query = { user: req.user.id };
            if (report.startDate && report.endDate) {
                query.date = { $gte: report.startDate, $lte: report.endDate };
            }
            data = await Sale.find(query).sort({ date: -1 });
        } else if (report.type === "Inventory Status") {
            data = await Medicine.find({ user: req.user.id }).sort({ name: 1 });
        }

        res.json({
            data,
            fileName: report.name,
            type: report.type,
            format: report.format
        });
    } catch (err) {
        console.error("Error downloading report:", err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid report ID. This might be an old mock report." });
        }
        res.status(500).json({ message: "Server error downloading report" });
    }
});

module.exports = router;
