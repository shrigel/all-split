import { formatIDR } from "../../../utils/formatter"

export default function ResultExpensesSection({
    participantBalances
}) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-[20px]">
                    finance
                </span>

                <span className="text-lg">
                    Rincian Pengeluaran
                </span>
            </h2>

            <div className="flex flex-col px-4 bg-white rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40">
                {participantBalances.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-[12px] font-medium">
                                {p.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">
                                    {p.name}
                                </span>

                                <span className="text-[10px] text-on-surface-variant">
                                    Talangan: {formatIDR(p.totalPaid)}
                                </span>
                                <span className="text-[10px] text-on-surface-variant">
                                    Porsi: {formatIDR(p.totalResponsibility)}
                                </span>
                            </div>
                        </div>

                        <span className={`font-bold text-sm ${p.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {p.balance < 0 ? formatIDR(p.balance) : `+${formatIDR(p.balance)}`}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}