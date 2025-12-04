import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, User, LogOut } from "lucide-react";
import Lottie from "lottie-react";

import animationData from "../assets/pharmacy-animation.json";

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", role: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const menuItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/inventory", icon: Package, label: "Inventory" },
        { path: "/sales", icon: ShoppingCart, label: "Sales" },
        { path: "/reports", icon: BarChart3, label: "Reports" },
    ];

    return (
        <div className="flex h-screen bg-dark text-text">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-gray-800 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white">+</span>
                    </div>
                    <h1 className="text-xl font-bold">MediMind</h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Lottie Animation Replacement */}
                <div className="p-4 border-t border-gray-800 flex flex-col items-center">
                    <div className="w-full h-32 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-dark border-b border-gray-800 flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold capitalize">
                        {location.pathname.split("/")[1] || "Dashboard"}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-white">{user.name || "Pharmacist"}</p>
                                <p className="text-xs text-gray-400">{user.role || "Admin"}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <User size={20} className="text-gray-300" />
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-2 p-2 text-gray-400 hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
