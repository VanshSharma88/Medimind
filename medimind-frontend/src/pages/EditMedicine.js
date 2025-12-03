import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import Modal from "../components/Modal";

export default function EditMedicine() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        expiryDate: "",
        supplier: "",
    });
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
    });

    useEffect(() => {
        fetchMedicine();
    }, []);

    const fetchMedicine = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:4000/api/medicines?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Since we don't have a single medicine endpoint yet, find it from the list
            // Or we can use the list we already have if we passed it via state, but fetching list is safer
            const medicine = res.data.find((m) => m.id === id);
            if (medicine) {
                setFormData({
                    name: medicine.name,
                    description: medicine.description || "",
                    category: medicine.category,
                    price: medicine.price,
                    quantity: medicine.quantity,
                    expiryDate: new Date(medicine.expiryDate).toISOString().split("T")[0],
                    supplier: medicine.supplier || "",
                });
            }
        } catch (error) {
            console.error("Error fetching medicine:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:4000/api/medicines/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModal({
                isOpen: true,
                title: "Success",
                message: "Medicine updated successfully!",
                type: "success",
                onConfirm: () => {
                    setModal({ ...modal, isOpen: false });
                    navigate("/inventory");
                }
            });
        } catch (error) {
            console.error("Error updating medicine:", error);
            setModal({
                isOpen: true,
                title: "Error",
                message: "Failed to update medicine. Please try again.",
                type: "danger"
            });
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/inventory")} className="text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">Edit Medicine</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl border border-gray-800 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Medicine Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="">Select Category</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Syrup">Syrup</option>
                            <option value="Injection">Injection</option>
                            <option value="Capsule">Capsule</option>
                            <option value="Ointment">Ointment</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Supplier</label>
                        <input
                            type="text"
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="input-field resize-none"
                    ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full py-3 flex justify-center items-center gap-2">
                    <Save size={20} /> Update Medicine
                </button>
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
