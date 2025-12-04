import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import Modal from "../components/Modal";

export default function AddMedicine() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        expiryDate: "",
        supplierId: "",
    });

    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:4000/api/medicines", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setModal({
                isOpen: true,
                title: "Success",
                message: "Medicine added successfully!",
                type: "success",
                onConfirm: () => {
                    setModal({ ...modal, isOpen: false });
                    navigate("/inventory");
                }
            });
        } catch (error) {
            console.error("Error adding medicine:", error);
            setModal({
                isOpen: true,
                title: "Error",
                message: "Failed to add medicine. Please try again.",
                type: "danger"
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Medicine</h2>

            <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl border border-gray-800 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Medicine Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="input-field"
                        placeholder="e.g. Paracetamol 500mg"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea
                        name="description"
                        className="input-field h-24 resize-none"
                        placeholder="Brief description..."
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                        <select name="category" className="input-field" onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Syrup">Syrup</option>
                            <option value="Injection">Injection</option>
                            <option value="Ointment">Ointment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Price (per unit)</label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            required
                            className="input-field"
                            placeholder="0.00"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            required
                            className="input-field"
                            placeholder="0"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            required
                            className="input-field"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                    <button
                        type="button"
                        onClick={() => navigate("/inventory")}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <X size={18} /> Cancel
                    </button>
                    <button type="submit" className="btn-primary flex items-center gap-2">
                        <Save size={18} /> Save Medicine
                    </button>
                </div>
            </form>

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
