import Modal from "../../../../components/Modal";

export default function ScanReceiptModal({
    isOpen,
    onClose,
}) {
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
                        <h2 className="text-md font-bold">
                            Pemberitahuan
                        </h2>
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

            <div className=" flex flex-col p-4">
                <p className="text-base">
                    Mohon maaf, untuk saat ini fitur scan struk belum tersedia dan masih dalam tahap pengembangan.
                </p>
            </div>
        </Modal>
    );
}