import Modal from "../../../components/Modal";
import { formatIDR, capitalizeWords } from "../../../utils/formatter";
import { calculateBillTotal } from "../../../utils/calculations";

export default function BillDetailModal({ isOpen, onClose, bill, participants = [] }) {
    if (!bill) return null;

    const payer = participants.find((p) => p.id === bill.payerId)?.name || "Tidak diketahui";
    const billTotal = calculateBillTotal(bill);

    const itemsSubtotal = (bill.items || []).reduce(
        (sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1),
        0
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-between items-center p-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">
                            receipt_long
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base font-bold text-on-surface">
                            {bill.name}
                        </h2>
                        <span className="text-xs text-slate-500">
                            Ditalangi oleh <strong className="text-slate-700">{payer}</strong>
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            <div className="p-4 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Item Dipesan ({(bill.items || []).length})
                    </span>

                    <div className="flex flex-col bg-surface-container-low/50 rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/20 px-3">
                        {(bill.items || []).map((item) => {
                            const isAll = item.assignedParticipantIds.includes('all') || item.assignedParticipantIds.length === participants.length;

                            return (
                                <div key={item.id} className="py-2.5 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-on-surface">
                                                {capitalizeWords(item.name)}
                                            </span>
                                            <span className="text-[11px] text-slate-500">
                                                {item.quantity} × {formatIDR(item.unitPrice)}
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold text-on-surface">
                                            {formatIDR(item.quantity * item.unitPrice)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 flex-wrap">
                                        <span className="text-[10px] text-slate-400">Untuk:</span>
                                        {isAll ? (
                                            <span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-medium">
                                                Semua Orang
                                            </span>
                                        ) : (
                                            item.assignedParticipantIds.map((pId) => {
                                                const pName = participants.find((p) => p.id === pId)?.name;
                                                return (
                                                    <span key={pId} className="text-[10px] bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded font-medium">
                                                        {pName}
                                                    </span>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {(bill.adjustments || []).length > 0 && (
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Biaya Tambahan & Diskon
                        </span>

                        <div className="flex flex-col bg-surface-container-low/50 rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/20 px-3">
                            {bill.adjustments.map((adj) => (
                                <div key={adj.id} className="py-2 flex justify-between items-center text-xs">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-700">{adj.name}</span>
                                        <span className="text-[10px] text-slate-400">
                                            {adj.allocationType === "proportional" ? "Proporsional" : "Bagi Rata"}
                                        </span>
                                    </div>
                                    <span className={`font-bold ${adj.type === "charge" ? "text-red-500" : "text-green-600"}`}>
                                        {adj.type === "charge" ? `+${formatIDR(adj.amount)}` : `-${formatIDR(adj.amount)}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-3 bg-surface-container rounded-xl flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">Total Tagihan</span>
                    <span className="text-base font-bold text-primary">{formatIDR(billTotal)}</span>
                </div>
            </div>

            <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low/40">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                    Tutup
                </button>
            </div>
        </Modal>
    );
}