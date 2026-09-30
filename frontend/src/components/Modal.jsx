import { useEffect } from "react";

export default function Modal({
    isOpen,
    onClose,
    children,
}) {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-xs animate-modal-backdrop"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-white shadow-xl animate-modal-card"
            >
                {children}
            </div>
        </div>
    );
}