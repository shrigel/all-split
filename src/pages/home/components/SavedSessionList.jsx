import SavedSessionItem from "./SavedSessionItem"

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
                    {savedSessions.map((session) => (
                        <SavedSessionItem
                            key={session.id}
                            session={session}
                            onOpen={() => onOpenSession(session.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}