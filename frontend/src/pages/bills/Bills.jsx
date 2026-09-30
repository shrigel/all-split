import { useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";
import Button from "../../components/Button";
import BillList from "./components/BillList";
import SessionOverview from "./components/SessionOverview";
import SessionBottomNav from "../../components/SessionBottomNav";

export default function Bills({
    session,
    sessionValidation,
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

    const validationErrors = sessionValidation?.errors ?? [];

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

                {validationErrors.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-xl border border-error/30 bg-error-container/30 p-4">
                        <div className="flex items-center gap-2 text-error">
                            <span className="material-symbols-outlined">
                                error
                            </span>

                            <p className="font-semibold">
                                Tagihan belum dapat dihitung
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 text-sm">
                            {validationErrors.map((error, index) => {
                                if (error.code === "INVALID_BILL") {
                                    const bill = bills[error.billIndex];

                                    return (
                                        <div
                                            key={`${error.code}-${error.billIndex}`}
                                            className="flex flex-col gap-1"
                                        >
                                            <p className="font-medium">
                                                {bill?.name ?? `Tagihan ${error.billIndex + 1}`}
                                            </p>

                                            <ul className="list-disc pl-5">
                                                {error.errors.map((billError) => (
                                                    <li key={billError.code}>
                                                        {billError.message}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }

                                return (
                                    <p key={`${error.code}-${index}`}>
                                        {error.message}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                )}

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
