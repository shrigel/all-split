import BillListItem from "./BillListItem";

export default function BillList({
    participants,
    bills,
    onEditBill,
    onRequestDeleteBill
}) {
    return (
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
                    {bills.map((bill) => (
                        <BillListItem
                            key={bill.id}
                            bill={bill}
                            participants={participants}
                            onEditBill={onEditBill}
                            onRequestDelete={onRequestDeleteBill}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}