import Modal from "../../../components/Modal";
import { formatIDR } from "../../../utils/formatter";
import { calculateBillTotal } from "../../../utils/calculations";
import Button from "../../../components/Button";
import BillDetailItemsSection from "./BillDetailItemsSection";
import BillDetailAdjustmentsSection from "./BillDetailAdjustmentsSection";

export default function BillDetailModal({ isOpen, onClose, bill, participants = [] }) {
    if (!bill) return null;

    const payerName = participants.find((p) => p.id === bill.payerId)?.name || "Tidak diketahui";
    const billTotal = calculateBillTotal(bill);

    const items = bill.items ?? [];
    const adjustments = bill.adjustments ?? [];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-between items-center p-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                            receipt_long
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base font-bold text-on-surface">
                            {bill.name}
                        </h2>
                        <span className="text-xs text-slate-500">
                            Ditalangi oleh <strong className="text-slate-700">{payerName}</strong>
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label="Tutup detail tagihan"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            <div className="p-4 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                <BillDetailItemsSection
                    items={items}
                    participants={participants}
                />

                {adjustments.length > 0 && (
                    <BillDetailAdjustmentsSection
                        adjustments={adjustments}
                    />
                )}

                <div className="p-3 bg-surface-container rounded-xl flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">Total Tagihan</span>
                    <span className="text-base font-bold text-primary">{formatIDR(billTotal)}</span>
                </div>
            </div>

            <div className="p-4 border-t border-outline-variant/30">
                <Button
                    variant="tonal"
                    onClick={onClose}
                    className="w-full"
                >
                    Tutup
                </Button>
            </div>
        </Modal>
    );
}