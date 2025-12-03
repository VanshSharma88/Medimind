import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, ShoppingCart, Search } from "lucide-react";
import Modal from "../components/Modal";

export default function Sales() {
    const [medicines, setMedicines] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
    });

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:4000/api/medicines?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedicines(res.data);
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    // Filter medicines for dropdown
    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = () => {
        if (!selectedMedicine || quantity <= 0) return;
        const medicine = medicines.find((m) => m.id === selectedMedicine);
        if (!medicine) return;

        if (medicine.quantity < quantity) {
            setModal({
                isOpen: true,
                title: "Insufficient Stock",
                message: `Only ${medicine.quantity} units available for ${medicine.name}.`,
                type: "danger"
            });
            return;
        }

        const existingItem = cart.find((item) => item.medicineId === medicine.id);
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.medicineId === medicine.id
                        ? { ...item, quantity: item.quantity + parseInt(quantity) }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    medicineId: medicine.id,
                    name: medicine.name,
                    price: medicine.price,
                    quantity: parseInt(quantity),
                },
            ]);
        }
        setQuantity(1);
        setSelectedMedicine("");
        setSearchTerm(""); // Reset search
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item.medicineId !== id));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:4000/api/sales",
                { items: cart },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModal({
                isOpen: true,
                title: "Success",
                message: "Sale recorded successfully!",
                type: "success",
                onConfirm: () => setModal({ ...modal, isOpen: false })
            });
            setCart([]);
            fetchMedicines(); // Refresh stock
        } catch (error) {
            console.error("Error recording sale:", error);
            setModal({
                isOpen: true,
                title: "Error",
                message: "Failed to record sale. Please try again.",
                type: "danger"
            });
        }
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Form */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold">New Sale</h2>
                <div className="bg-card p-6 rounded-xl border border-gray-800 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Search & Select Medicine (Combined) */}
                        <div className="md:col-span-2 space-y-2 relative">
                            <label className="block text-sm font-medium text-gray-400">Select Medicine</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search and select medicine..."
                                    className="input-field w-full !pl-10"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setSelectedMedicine(""); // Clear selection when searching
                                    }}
                                    onFocus={() => setSearchTerm(searchTerm)} // Ensure dropdown opens or logic handles it
                                />
                                {searchTerm && !selectedMedicine && (
                                    <div className="absolute z-10 w-full mt-2 bg-card border border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {filteredMedicines.length > 0 ? (
                                            filteredMedicines.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className={`p-3 hover:bg-gray-800 cursor-pointer transition-colors flex justify-between items-center ${m.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
                                                        }`}
                                                    onClick={() => {
                                                        if (m.quantity > 0) {
                                                            setSelectedMedicine(m.id);
                                                            setSearchTerm(m.name);
                                                        }
                                                    }}
                                                >
                                                    <div>
                                                        <p className="font-medium text-white">{m.name}</p>
                                                        <p className="text-xs text-gray-400">{m.category}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-green-400 font-medium">₹{m.price}</p>
                                                        <p className={`text-xs ${m.quantity < 10 ? "text-red-400" : "text-gray-400"}`}>
                                                            {m.quantity} in stock
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">No medicines found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="block text-sm font-medium text-gray-400">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                className="input-field w-full"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={addToCart}
                            disabled={!selectedMedicine}
                            className="btn-primary h-[46px] px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={20} /> Add to Cart
                        </button>
                    </div>
                </div>

                {/* Cart Table */}
                <div className="bg-card rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4">Medicine</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Qty</th>
                                <th className="p-4 text-right">Total</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <tr key={item.medicineId}>
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4">₹{item.price.toFixed(2)}</td>
                                        <td className="p-4">{item.quantity}</td>
                                        <td className="p-4 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => removeFromCart(item.medicineId)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        Cart is empty
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Summary</h2>
                <div className="bg-card p-6 rounded-xl border border-gray-800 space-y-4">
                    <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Tax (0%)</span>
                        <span>₹0.00</span>
                    </div>
                    <div className="border-t border-gray-800 pt-4 flex justify-between text-xl font-bold text-white">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full btn-primary py-3 mt-4 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={20} /> Complete Sale
                    </button>
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
