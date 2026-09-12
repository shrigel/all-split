import { formatIDR } from "../../../utils/formatter";
import { calculateBillTotal } from "../../../utils/calculations";

export default function BillItem({
    bill,
    participants,
    onEditBill,
    onRequestDelete
}) {
    const payerName = participants.find((p) => p.id === bill.payerId)?.name || "Tidak diketahui";
    const billTotal = calculateBillTotal(bill);

    return (
        <div className="p-4 flex items-start justify-between gap-3 bg-white">
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
                            {payerName}
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
                        aria-label={`Edit tagihan ${bill.name}`}
                        title="Edit Tagihan"
                        onClick={() => onEditBill(bill)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-outline hover:text-primary transition-colors"
                    >
                        <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px]"
                        >
                            edit
                        </span>
                    </button>

                    <button
                        type="button"
                        aria-label={`Hapus tagihan ${bill.name}`}
                        title="Hapus Tagihan"
                        onClick={() => onRequestDelete(bill)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-outline hover:text-rose-500 transition-colors"
                    >
                        <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px]"
                        >
                            delete
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
