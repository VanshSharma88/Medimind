
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Modal from "../components/Modal";

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [type, setType] = useState("Sales Report");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [format, setFormat] = useState("PDF");
    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:4000/api/reports/recent?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token} ` },
            });
            setReports(res.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const generateFile = (data, fileName, type, format) => {
        if (format === "PDF") {
            const doc = new jsPDF();
            doc.text(type, 14, 20);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

            if (type === "Sales Report") {
                const tableColumn = ["Date", "Total", "Items"];
                const tableRows = data.map(sale => [
                    new Date(sale.date).toLocaleDateString(),
                    `₹${sale.total.toFixed(2)}`,
                    sale.items.length
                ]);

                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 40
                });
            } else if (type === "Inventory Status") {
                const tableColumn = ["Name", "Category", "Quantity", "Price", "Expiry"];
                const tableRows = data.map(item => [
                    item.name,
                    item.category,
                    item.quantity,
                    `₹${item.price.toFixed(2)}`,
                    new Date(item.expiryDate).toLocaleDateString()
                ]);

                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 40
                });
            }

            doc.save(fileName);
        } else if (format === "CSV") {
            let csvContent = "data:text/csv;charset=utf-8,";

            if (type === "Sales Report") {
                csvContent += "Date,Total,Items\n";
                data.forEach(sale => {
                    const row = `${new Date(sale.date).toLocaleDateString()},${sale.total},${sale.items.length}`;
                    csvContent += row + "\n";
                });
            } else if (type === "Inventory Status") {
                csvContent += "Name,Category,Quantity,Price,Expiry Date\n";
                data.forEach(item => {
                    const row = `${item.name},${item.category},${item.quantity},${item.price},${new Date(item.expiryDate).toLocaleDateString()}`;
                    csvContent += row + "\n";
                });
            }

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:4000/api/reports/generate",
                { type, startDate, endDate, format },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { data, fileName } = res.data;

            if (!data || data.length === 0) {
                setModal({
                    isOpen: true,
                    title: "Info",
                    message: "No data found for the selected criteria.",
                    type: "info"
                });
                setLoading(false);
                return;
            }

            generateFile(data, fileName, type, format);

            setModal({
                isOpen: true,
                title: "Success",
                message: `Report generated: ${fileName}`,
                type: "success"
            });

            fetchReports(); // Refresh recent list
        } catch (error) {
            console.error("Error generating report:", error);
            setModal({
                isOpen: true,
                title: "Error",
                message: error.response?.data?.message || error.message || "Failed to generate report. Please try again.",
                type: "danger"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:4000/api/reports/download/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data, fileName, type, format } = res.data;
            generateFile(data, fileName, type, format);

        } catch (error) {
            console.error("Error downloading report:", error);
            setModal({
                isOpen: true,
                title: "Error",
                message: error.response?.data?.message || "Failed to download report.",
                type: "danger"
            });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Generate Report Form */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold">Generate Custom Report</h2>
                <div className="bg-card p-8 rounded-xl border border-gray-800 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Report Type</label>
                        <select
                            className="input-field"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option>Sales Report</option>
                            <option>Inventory Status</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                className="input-field"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                className="input-field"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Format</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="format"
                                    value="PDF"
                                    checked={format === "PDF"}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="accent-primary"
                                />
                                <span>PDF</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="format"
                                    value="CSV"
                                    checked={format === "CSV"}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="accent-primary"
                                />
                                <span>CSV</span>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn-primary w-full py-3 flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        <FileText size={20} /> {loading ? "Generating..." : "Generate Report"}
                    </button>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Recent Reports</h2>
                <div className="space-y-4">
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-card p-4 rounded-xl border border-gray-800 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{report.name}</p>
                                        <p className="text-xs text-gray-400">{report.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownload(report.id)}
                                    className="text-gray-400 hover:text-white"
                                    title="Download"
                                >
                                    <Download size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent reports</p>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmText={modal.confirmText}
                onConfirm={modal.onConfirm}
            />
        </div>
    );
}
