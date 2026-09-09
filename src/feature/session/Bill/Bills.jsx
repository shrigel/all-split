import { useState } from "react";
import { formatIDR } from "../../../utils/formatter";
import { calculateBillTotal, calculateSessionTotal } from "../../../utils/calculations";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function Bills({
    session,
    onAddBill,
    onEditBill,
    onDeleteBill,
    onCalculateSession,
    onBack
}) {
    const sessionName = session.name;
    const participants = session.participants;
    const bills = session.bills;
    const totalSession = calculateSessionTotal(bills);

    const [isBackModalOpen, setIsBackModalOpen] = useState(false);
    const [billToDelete, setBillToDelete] = useState(null);

    const getPayerName = (payerId) => {
        const participant = participants.find((p) => p.id === payerId);

        return participant.name;
    };

    const AVATAR_PALETTES = [
        { bg: 'bg-[#5B8FB9]/15', text: 'text-[#5B8FB9]' },
        { bg: 'bg-emerald-100', text: 'text-emerald-700' },
        { bg: 'bg-amber-100', text: 'text-amber-700' },
        { bg: 'bg-purple-100', text: 'text-purple-700' },
        { bg: 'bg-rose-100', text: 'text-rose-700' },
        { bg: 'bg-indigo-100', text: 'text-indigo-700' }
    ];

    return (
        <>
            <main className="flex-1 flex flex-col gap-6 w-full max-w-app mx-auto px-4 py-6">
                <div>
                    <button
                        type="button"
                        onClick={() => { bills.length > 0 ? setIsBackModalOpen(true) : onBack(); }}
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

                <div className="flex justify-between items-center bg-surface-container-low px-6 py-4 rounded-xl">
                    <div className="flex flex-col">
                        <span className="text-sm ">
                            Sesi Patungan
                        </span>

                        <span className="text-lg font-semibold">
                            {sessionName}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[20px]">
                            group
                        </span>

                        <span className="text-sm">
                            {participants.length}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-outline-variant/40">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">
                            Tagihan
                        </h1>

                        <span className="text-sm">
                            {bills.length} tagihan
                        </span>
                    </div>

                    <span className="text-primary font-bold text-3xl tracking-tight">
                        {formatIDR(totalSession)}
                    </span>
                </div>

                <div className="flex items-center gap-2 pb-1 flex-wrap">
                    {participants.map((p, index) => {
                        const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

                        return (
                            <div key={p.id} className="flex items-center gap-2 bg-white px-2.5 py-2 rounded-xl shadow-sm shrink-0">
                                <div className={`w-5 h-5 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center text-[10px] font-bold`}>
                                    {p.name.charAt(0).toUpperCase()}
                                </div>

                                <span className="text-xs font-medium text-on-surface">
                                    {p.name}
                                </span>
                            </div>
                        )
                    })}
                </div>

                <section className="flex flex-col">
                    {bills.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl flex flex-col items-center justify-center gap-2 bg-surface-container-lowest">
                            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary mb-1">
                                <span className="material-symbols-outlined text-[28px]">
                                    receipt_long
                                </span>
                            </div>

                            <h3 className="text-sm font-semibold text-on-surface">
                                Belum Ada Tagihan
                            </h3>
                            <p className="text-xs text-on-surface-variant max-w-xs">
                                Mulai tambahkan tagihan makan, belanja, atau transportasi yang ingin dibagi bersama teman.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col bg-white rounded-2xl shadow-xs border border-outline-variant/40 divide-y divide-outline-variant/20 overflow-hidden">
                            {bills.map((bill) => {
                                const billTotal = calculateBillTotal(bill);
                                const payer = getPayerName(bill.payerId);

                                return (
                                    <div key={bill.id} className="p-4 flex items-start justify-between gap-3 hover:bg-surface-container-lowest transition-colors">
                                        <div className="flex gap-3 min-w-0">

                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-on-surface truncate">
                                                    {bill.name}
                                                </span>

                                                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                                                    <span>
                                                        Ditalangi oleh
                                                    </span>

                                                    <span className="font-semibold text-on-surface bg-surface-container px-1.5 py-0.5 rounded text-[11px]">
                                                        {payer}
                                                    </span>
                                                </div>

                                                <span className="text-[11px] text-outline mt-1">
                                                    {(bill.items || []).length} item
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end shrink-0 gap-1">
                                            <span className="text-sm font-bold text-on-surface">
                                                {formatIDR(billTotal)}
                                            </span>

                                            <div className="flex items-center gap-5 mt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onEditBill(bill)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="Edit Tagihan"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        edit
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setBillToDelete(bill)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-outline hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                                    title="Hapus Tagihan"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <div className="flex flex-col gap-2.5">
                    <button
                        type="button"
                        onClick={onAddBill}
                        className="w-full h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>

                        <span>Tambah Tagihan</span>
                    </button>

                    <button
                        type="button"
                        disabled={bills.length === 0}
                        onClick={onCalculateSession}
                        className={`w-full h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${bills.length > 0
                            ? 'bg-primary hover:bg-primary-hover active:scale-[0.99] cursor-pointer'
                            : 'bg-outline-variant/60 opacity-60 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">calculate</span>

                        <span>Hitung Patungan</span>
                    </button>
                </div>
            </main>

            <ConfirmationModal
                isOpen={isBackModalOpen}
                onConfirm={onBack}
                onClose={() => setIsBackModalOpen(false)}
                confirmationMessage="Apakah Anda yakin ingin kembali? Tagihan yang telah dimasukkan akan hilang."
            />

            <ConfirmationModal
                btnLabel="Hapus"
                isOpen={Boolean(billToDelete)}
                onClose={() => setBillToDelete(null)}
                onConfirm={() => {
                    if (billToDelete) {
                        onDeleteBill(billToDelete.id);
                        setBillToDelete(null);
                    }
                }}
                confirmationMessage={`Apakah Anda yakin ingin menghapus tagihan "${billToDelete?.name}"?`}
            />
        </>
    );
}
