import Modal from "../../../components/Modal";
import Button from "../../../components/Button";

export default function BlockedRemovalModal({
    isOpen,
    onClose,
    participant,
    usage
}) {
    if (!isOpen || !participant || !usage) {
        return null;
    }

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
                            Peserta Tidak Dapat Dihapus
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

            <div className="p-4 flex flex-col gap-2">
                <p className="text-sm text-on-surface-variant">
                    <span className="font-bold">{participant.name}</span> tidak dapat dihapus karena masuk ke tagihan berikut:
                </p>

                <ul>
                    {usage.bills.map((bill) => (
                        <li key={bill.id}>
                            <span className="text-sm font-bold">
                                {bill.name}
                            </span>
                        </li>
                    ))}
                </ul>

                <p className="text-sm text-on-surface-variant">
                    Ubah atau hapus tagihan tersebut terlebih dahulu sebelum menghapus peserta.
                </p>
            </div>

            <div className="flex items-center p-4 border-t border-outline-variant/40">
                <Button
                    variant="tonal"
                    onClick={onClose}
                    className="flex-1"
                >
                    Tutup
                </Button>
            </div>
        </Modal>
    );
}