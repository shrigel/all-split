import Button from "../../../components/Button"
import { calculateSessionTotal } from "../../../utils/calculations"
import { formatIDR } from "../../../utils/formatter"

export default function ActiveSessionCard({
    session,
    onResume,
    onDiscard
}) {
    return (
        <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Sesi sedang berjalan
                </span>

                <button
                    type="button"
                    onClick={onDiscard}
                    aria-label={`Hapus sesi ${session.name}`}
                    title={`Hapus ${session.name}`}
                    className="flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        delete
                    </span>
                </button>
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-900">
                    {session.name}
                </h2>

                <span className="text-xs text-slate-500">
                    {session.participants.length} Peserta • {session.bills.length} Tagihan
                    {session.bills.length > 0 && ` • ${formatIDR(calculateSessionTotal(session.bills))}`}
                </span>
            </div>

            <Button
                onClick={onResume}
                iconEnd="arrow_forward"
            >
                Lanjutkan Sesi Ini
            </Button>
        </div>
    )
}