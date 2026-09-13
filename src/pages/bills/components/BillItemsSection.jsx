import Button from "../../../components/Button";
import BillLineItem from "./BillLineItem";

export default function BillItemsSection({
    items,
    participants,
    onAddItem,
    onEditItem,
    onDeleteItem,
}) {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                    shopping_cart
                </span>

                <span className="text-lg font-semibold">
                    Rincian Tagihan ({items.length})
                </span>
            </div>

            <div className="flex flex-col px-4 bg-white rounded-2xl shadow-xs border border-outline-variant/40 divide-y divide-outline-variant/20 overflow-hidden">
                {items.length === 0 ? (
                    <div className="flex flex-col py-10 items-center text-center">
                        <div className="bg-secondary/20 flex justify-center items-center rounded-full w-12 h-12">
                            <span className="material-symbols-outlined text-[36px] text-secondary">
                                receipt_long
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-on-surface">
                            Belum ada rincian tagihan
                        </h3>

                        <p className="text-sm text-on-surface-variant max-w-[260px] leading-relaxed">
                            Tambahkan item pertama ke struk agar bisa dibuat patungan
                        </p>
                    </div>
                ) : (
                    <>
                        {items.map((item) => (
                            <BillLineItem
                                key={item.id}
                                item={item}
                                participants={participants}
                                onEdit={() => onEditItem(item)}
                                onDelete={() => onDeleteItem(item.id)}
                            />
                        ))}
                    </>
                )}

                <div className="flex justify-center items-center py-4">
                    <Button
                        variant="tonal"
                        iconStart="add_circle"
                        onClick={onAddItem}
                        className="w-full"
                    >
                        Tambah Item
                    </Button>
                </div>
            </div>
        </section>
    )
}