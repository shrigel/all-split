import { formatIDR, formatRelativeTime } from "../../../utils/formatter";
import { calculateSessionTotal } from "../../../utils/calculations";

export default function SavedSessionItem({
    session,
    onOpen
}) {
    const sessionTotal = formatIDR(
        calculateSessionTotal(session.bills)
    );

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-outline-variant/40">
            <div className="flex flex-col gap-1">
                <span className="text-sm font-bold">
                    {session.name}
                </span>

                <span className="text-xs text-slate-500">
                    {session.participants.length} Peserta
                    {' • '}
                    <span className="font-semibold">
                        {sessionTotal}
                    </span>
                </span>

                <span className="text-xs text-slate-500">
                    {formatRelativeTime(session.createdAt)}
                </span>
            </div>

            <button
                type="button"
                onClick={onOpen}
                className="flex items-center gap-2 p-2 cursor-pointer text-primary hover:text-primary-hover"
            >
                <span className="text-xs font-medium hover:underline">
                    Lihat Detail
                </span>
            </button>
        </div>
    );
}