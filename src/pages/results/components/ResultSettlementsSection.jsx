import { formatIDR } from "../../../utils/formatter"

export default function ResultSettlementsSection({
    settlements
}) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-[20px]">
                    sync_alt
                </span>

                <span className="text-lg">
                    Rincian Patungan
                </span>
            </h2>

            <div className="flex flex-col px-4 bg-white rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40">
                {settlements.length === 0 ? (
                    <div className="flex items-center justify-center py-4">
                        <p className="text-sm text-center">
                            Semua tagihan sudah lunas! Nggak perlu bayar patungan lagi.
                        </p>
                    </div>
                ) : (
                    settlements.map((transfer, index) => (
                        <div
                            key={`${transfer.fromId}-${transfer.toId}-${index}`}
                            className="flex items-center justify-between py-4"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-[12px] font-medium">
                                        {transfer.fromName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">
                                            {transfer.fromName}
                                        </span>

                                        <span className="text-[10px] text-red-500">
                                            Bayar
                                        </span>
                                    </div>
                                </div>

                                <span className="material-symbols-outlined text-slate-300 text-[16px]">
                                    arrow_forward
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <div className="w-7 h-7 rounded-full bg-secondary-container text-on-surface flex items-center justify-center text-[12px] font-medium">
                                        {transfer.toName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">
                                            {transfer.toName}
                                        </span>

                                        <span className="text-[10px] text-green-500">
                                            Terima
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <span className="font-bold text-sm text-primary">
                                {formatIDR(transfer.amount)}
                            </span>
                        </div>
                    ))
                )}

            </div>
        </section>
    )
}