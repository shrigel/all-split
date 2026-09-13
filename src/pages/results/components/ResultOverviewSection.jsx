import { AVATAR_PALETTES } from "../../../constants/avatarPalettes";
import { formatIDR } from "../../../utils/formatter";

export default function ResultOverviewSection({
    participants,
    bills,
    sessionTotal,
}) {
    return (
        <section className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-outline-variant/40">
            <div className="flex items-center justify-between gap-2 p-4 rounded-xl bg-surface-container">
                <div className="flex flex-col gap-1">
                    <span className="text-xs">
                        Total Seluruh Tagihan
                    </span>

                    <span className="text-2xl font-bold text-primary">
                        {formatIDR(sessionTotal)}
                    </span>
                </div>

                <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined">
                        account_balance_wallet
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2 text-xs font-medium">
                <div className="flex items-center gap-1 text-xs font-medium">
                    <span>
                        Daftar Peserta
                    </span>

                    <span>
                        ({participants.length})
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {participants.map((p, index) => {
                        const isPayer = bills.some((b) => b.payerId === p.id);
                        const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

                        return (
                            <div
                                key={p.id}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low/75"
                            >
                                <div className={`w-8 h-8 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                                    {p.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold text-on-surface truncate">
                                        {p.name}
                                    </span>

                                    <span className={`text-[10px] font-medium ${isPayer ? "text-primary font-semibold" : "text-slate-400"
                                        }`}>
                                        {isPayer ? "Penalang" : "Peserta"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}