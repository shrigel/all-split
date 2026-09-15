import { useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";
import Button from "../../components/Button";
import BillList from "./components/BillList";
import SessionOverview from "./components/SessionOverview";
import SessionBottomNav from "../../components/SessionBottomNav";

export default function Bills({
    session,
    onAddBill,
    onEditBill,
    onDeleteBill,
    onCalculateSession,
    onBack
}) {
    const {
        name: sessionName,
        participants,
        bills
    } = session;

    const [billToDelete, setBillToDelete] = useState(null);

    const handleRequestDeleteBill = (bill) => {
        setBillToDelete(bill);
    };

    const handleConfirmDeleteBill = () => {
        if (!billToDelete) {
            return;
        }

        onDeleteBill(billToDelete.id);
        setBillToDelete(null);
    };

    return (
        <>
            <main className="flex-1 flex flex-col gap-6 w-full max-w-app mx-auto px-4 py-6 pb-24">
                <div>
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-2 text-primary bg-surface-container/75 px-2 py-1 rounded-full border border-outline-variant/40 hover:bg-surface-container-high transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            arrow_back
                        </span>

                        <span className="text-sm">
                            Kembali
                        </span>
                    </button>
                </div>

                <SessionOverview
                    sessionName={sessionName}
                    participants={participants}
                    bills={bills}
                />

                <BillList
                    participants={participants}
                    bills={bills}
                    onEditBill={onEditBill}
                    onRequestDeleteBill={handleRequestDeleteBill}
                />

                <div className="flex flex-col gap-2.5">
                    <Button
                        variant="tonal"
                        iconStart="add"
                        onClick={onAddBill}
                    >
                        Tambah Tagihan
                    </Button>

                    <Button
                        disabled={bills.length === 0}
                        onClick={onCalculateSession}
                        iconStart="calculate"
                    >
                        Hitung Patungan
                    </Button>
                </div>
            </main>

            <SessionBottomNav
                activePage="bills"
                canOpenBills={participants.length >= 2}
                onParticipantsClick={onBack}
            />

            <ConfirmationModal
                btnLabel="Hapus"
                btnVariant="danger"
                isOpen={Boolean(billToDelete)}
                onClose={() => setBillToDelete(null)}
                onConfirm={handleConfirmDeleteBill}
                confirmationMessage={`Apakah Anda yakin ingin menghapus tagihan "${billToDelete?.name}"?`}
            />
        </>
    );
}
