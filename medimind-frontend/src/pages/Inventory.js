import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import Modal from "../components/Modal";

export default function Inventory() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
    });

    const location = useLocation();

    useEffect(() => {
        fetchMedicines();
    }, []);

    // Handle Filters from Dashboard
    useEffect(() => {
        if (location.state?.filter) {
            // Logic handled in filteredMedicines, just triggering re-render
        }
    }, [location.state]);

    const fetchMedicines = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:4000/api/medicines?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedicines(res.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setModal({
            isOpen: true,
            title: "Delete Medicine",
            message: "Are you sure you want to delete this medicine? This action cannot be undone.",
            type: "danger",
            confirmText: "Delete",
            onConfirm: () => handleDelete(id),
        });
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:4000/api/medicines/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedicines(medicines.filter((m) => m.id !== id));
            setModal({ ...modal, isOpen: false });
        } catch (error) {
            console.error("Error deleting medicine:", error);
            setModal({ ...modal, isOpen: false });
        }
    };

    const filteredMedicines = medicines.filter((m) => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (location.state?.filter === "lowStock") {
            return matchesSearch && m.quantity < 10;
        }

        if (location.state?.filter === "nearExpiry") {
            const expiryDate = new Date(m.expiryDate);
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            const today = new Date();
            return matchesSearch && expiryDate <= thirtyDaysFromNow && expiryDate >= today;
        }

        return matchesSearch;
    });

    const getPageTitle = () => {
        if (location.state?.filter === "lowStock") return "Low Stock Inventory";
        if (location.state?.filter === "nearExpiry") return "Near Expiry Inventory";
        return "Inventory Management";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    {getPageTitle()}
                </h2>
                <div className="flex gap-3">
                    {location.state?.filter && (
                        <Link to="/inventory" state={{ filter: null }} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">
                            Show All
                        </Link>
                    )}
                    <Link to="/inventory/add" className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Add New Medicine
                    </Link>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-card p-4 rounded-lg border border-gray-800 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        className="input-field !pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-card rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50 text-gray-400 text-sm">
                        <tr>
                            <th className="p-4">Medicine Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Expiry Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center">Loading inventory...</td></tr>
                        ) : filteredMedicines.length > 0 ? (
                            filteredMedicines.map((medicine) => (
                                <tr key={medicine.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 font-medium">{medicine.name}</td>
                                    <td className="p-4 text-gray-400">{medicine.category}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${medicine.quantity < 10 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                                            }`}>
                                            {medicine.quantity} units
                                        </span>
                                    </td>
                                    <td className="p-4">₹{medicine.price.toFixed(2)}</td>
                                    <td className="p-4 text-gray-400">
                                        {new Date(medicine.expiryDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/inventory/edit/${medicine.id}`}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(medicine.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No medicines found</td></tr>
                        )}
                    </tbody>
                </table>
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
