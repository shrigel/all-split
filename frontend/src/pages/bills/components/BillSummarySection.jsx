import { formatIDR } from "../../../utils/formatter";

export default function BillSummarySection({
    total,
    billedCount
}) {
    return (
        <section className="flex justify-between bg-surface-container-high p-3 py-3.5 border-t border-outline-variant/40 rounded-xl">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-on-surface/80">
                    Total Tagihan
                </span>

                <span className="text-2xl font-bold text-primary">
                    {formatIDR(total)}
                </span>
            </div>

            <div className="flex flex-col text-right gap-1">
                <span className="text-xs text-on-surface/80">
                    Ditagih ke:
                </span>

                <span className="text-xs font-semibold text-primary">
                    {billedCount} orang
                </span>
            </div>
        </section>
    );
}