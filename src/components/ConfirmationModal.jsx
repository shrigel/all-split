import Modal from "./Modal";

export default function ConfirmationModal({
    isOpen,
    btnLabel = "Kembali",
    onClose,
    onConfirm,
    confirmationMessage
}) {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className=" flex justify-between items-center p-4 gap-2 border-b border-outline-variant/40">
                <div className=" flex items-center gap-4">
                    <span className="material-symbols-outlined text-[20px] text-primary">
                        warning
                    </span>

                    <div className="flex flex-col">
                        <span className="text-md font-bold">
                            Peringatan
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                >
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </button>
            </div>

            <div className="p-4">
                <p className="text-sm text-on-surface-variant text-center">
                    {confirmationMessage}
                </p>
            </div>

            <div className="flex items-center p-4 gap-2">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-colors"
                >
                    Batal
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
                >
                    {btnLabel}
                </button>
            </div>
        </Modal>
    );
}
