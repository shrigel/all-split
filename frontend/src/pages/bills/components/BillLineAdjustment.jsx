import { formatIDR } from "../../../utils/formatter";

export default function BillLineAdjustment({
    adjustment,
    onEdit,
    onDelete
}) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex flex-col">
                <span className="text-sm font-semibold">
                    {adjustment.name}
                </span>
                <span className="text-xs text-gray-600">
                    {adjustment.type === 'charge' ? 'Tambahan' : 'Potongan'} | {adjustment.allocationType === 'proportional' ? 'Proporsional' : 'Bagi Rata'}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${adjustment.type === 'charge' ? 'text-red-500' : 'text-green-500'
                    }`}>
                    {adjustment.type === 'charge' ? `+${formatIDR(adjustment.amount)}` : `-${formatIDR(adjustment.amount)}`}
                </span>

                <button
                    type="button"
                    onClick={() => onEdit(adjustment)}
                    className="text-gray-400 hover:text-primary transition-all cursor-pointer"
                    title="Edit Item"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        edit
                    </span>
                </button>

                <button
                    onClick={() => onDelete(adjustment.id)}
                    className="text-gray-400 hover:text-red-500"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        delete
                    </span>
                </button>
            </div>
        </div>
    )
}