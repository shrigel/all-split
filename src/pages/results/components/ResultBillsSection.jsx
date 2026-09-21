import { formatIDR } from "../../../utils/formatter";
import { calculateBillTotal } from "../../../domain/calculation";

export default function ResultBillsSection({
    bills,
    participants,
    onOpenBillDetail
}) {
    const getPayerName = (payerId) => {
        const participant = participants.find((p) => p.id === payerId);

        return participant?.name || "Tidak diketahui";
    };

    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-[20px]">
                        receipt_long
                    </span>

                    <span className="text-lg">
                        Daftar Tagihan
                    </span>
                </h2>

                <span className="text-xs">
                    {bills.length} Tagihan
                </span>
            </div>

            <div className="flex flex-col px-4 bg-white rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40">
                {bills.map((bill) => {
                    const billTotal = formatIDR(calculateBillTotal(bill));
                    const payer = getPayerName(bill.payerId);

                    return (
                        <button
                            key={bill.id}
                            type="button"
                            onClick={() => onOpenBillDetail(bill)}
                            className="flex items-center gap-2 py-4 cursor-pointer"
                        >
                            <div className="flex justify-between items-center gap-2 w-full">
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-semibold">
                                        {bill.name}
                                    </span>

                                    <span className="text-xs">
                                        Ditalangi {payer} • {bill.items.length} Item
                                    </span>
                                </div>

                                <span className="text-sm font-semibold">
                                    {billTotal}
                                </span>
                            </div>

                            <span
                                className="material-symbols-outlined text-[16px] text-slate-400"
                                aria-hidden="true"
                            >
                                chevron_right
                            </span>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}