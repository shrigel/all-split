import { formatIDR, formatRelativeTime } from "../../../utils/formatter"
import { calculateSessionTotal } from "../../../utils/calculations"


export default function SavedSessionList({
    savedSessions,
    onOpenSession
}) {
    return (
        <section className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                        history
                    </span>

                    <h2 className="text-sm text-on-surface font-semibold">
                        Riwayat Patungan
                    </h2>
                </div>

                <span className="text-xs text-on-surface-variant">
                    {savedSessions.length} patungan
                </span>
            </div>

            {savedSessions.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-outline-variant/60 rounded-xl">
                    <p className="text-xs text-on-surface-variant">
                        Belum ada riwayat patungan
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {savedSessions.map((session) => {
                        const sessionTotal = formatIDR(calculateSessionTotal(session.bills));

                        return (
                            <div key={session.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-outline-variant/40">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold">
                                        {session.name}
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        {session.participants.length} Peserta • <span className="font-semibold">{sessionTotal}</span>
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        {formatRelativeTime(session.createdAt || session.id)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => onOpenSession(session.id)}
                                    className="flex items-center gap-2 p-2"
                                >
                                    <span className="text-xs text-primary font-medium">
                                        Lihat Detail
                                    </span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}