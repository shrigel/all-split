import { formatIDR } from "../../../utils/formatter";

export default function BillDetailAdjustmentsSection({
    adjustments
}) {
    if (adjustments.length === 0) {
        return null;
    }

    return (
        <section className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Biaya Tambahan & Diskon
            </span>

            <div className="flex flex-col bg-surface-container-low/50 rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/20 px-3">
                {adjustments.map((adjustment) => (
                    <div
                        key={adjustment.id}
                        className="py-2 flex justify-between items-center text-xs"
                    >
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">
                                {adjustment.name}
                            </span>

                            <span className="text-[10px] text-slate-400">
                                {adjustment.allocationType === "proportional" ? "Proporsional" : "Bagi Rata"}
                            </span>
                        </div>

                        <span className={`font-bold ${adjustment.type === "charge"
                            ? "text-red-500"
                            : "text-green-600"}`}>
                            {adjustment.type === "charge"
                                ? `+${formatIDR(adjustment.amount)}`
                                : `-${formatIDR(adjustment.amount)}`}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}