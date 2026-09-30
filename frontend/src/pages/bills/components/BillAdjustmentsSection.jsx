import Button from "../../../components/Button";
import BillLineAdjustment from "./BillLineAdjustment";

export default function BillAdjustmentsSection({
    adjustments,
    onDeleteAdjustment,
    onEditAdjustment,
    onAddAdjustment,
}) {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                    tune
                </span>

                <span className="text-lg font-semibold">
                    Biaya Lain / Potongan
                </span>
            </div>
            <div className="flex flex-col bg-white rounded-xl px-4 border border-outline-variant/40 divide-y divide-outline-variant/20">
                {adjustments.length === 0 ? (
                    <div className="flex flex-col justify-center items-center mt-4 py-4">
                        <div className="bg-secondary/20 flex justify-center items-center rounded-full w-12 h-12">
                            <span className="material-symbols-outlined text-[36px] text-secondary">
                                money_bag
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-on-surface">
                            Belum ada biaya lain / potongan
                        </h3>
                    </div>
                ) : (
                    adjustments.map((adjustment) => (
                        <BillLineAdjustment
                            key={adjustment.id}
                            adjustment={adjustment}
                            onEdit={() =>
                                onEditAdjustment(adjustment)
                            }
                            onDelete={() =>
                                onDeleteAdjustment(adjustment.id)
                            }
                        />
                    ))
                )}

                <div className="flex justify-center items-center py-4">
                    <Button
                        variant="tonal"
                        iconStart="add_circle"
                        onClick={onAddAdjustment}
                        className="w-full"
                    >
                        Tambah Biaya / Potongan
                    </Button>
                </div>
            </div>
        </section>
    )
}