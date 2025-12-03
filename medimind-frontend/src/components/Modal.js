import React from "react";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function Modal({ isOpen, onClose, title, message, onConfirm, confirmText = "Confirm", cancelText = "Cancel", type = "info" }) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case "danger":
                return <AlertTriangle className="text-red-500" size={32} />;
            case "success":
                return <CheckCircle className="text-green-500" size={32} />;
            default:
                return <Info className="text-blue-500" size={32} />;
        }
    };

    const getConfirmButtonClass = () => {
        switch (type) {
            case "danger":
                return "bg-red-500 hover:bg-red-600 text-white";
            case "success":
                return "bg-green-500 hover:bg-green-600 text-white";
            default:
                return "bg-blue-500 hover:bg-blue-600 text-white";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-card border border-gray-800 rounded-xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className={`p-3 rounded-full bg-opacity-10 ${type === "danger" ? "bg-red-500" : type === "success" ? "bg-green-500" : "bg-blue-500"}`}>
                            {getIcon()}
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-gray-400">{message}</p>

                    <div className="flex gap-3 justify-center mt-6">
                        {onConfirm && (
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                            >
                                {cancelText}
                            </button>
                        )}

                        <button
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                else onClose();
                            }}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${getConfirmButtonClass()} ${!onConfirm ? "w-full" : ""}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
