import { formatIDR } from "../../../utils/formatter";
import { calculateSessionTotal } from "../../../domain/calculation";
import { AVATAR_PALETTES } from "../../../constants/avatarPalettes";

export default function SessionOverview({
    sessionName,
    participants,
    bills
}) {
    const totalSession = calculateSessionTotal(bills);

    return (
        <>
            <div className="flex justify-between items-center bg-surface-container-low px-6 py-4 rounded-xl">
                <div className="flex flex-col">
                    <span className="text-sm ">
                        Sesi Patungan
                    </span>

                    <span className="text-lg font-semibold">
                        {sessionName}
                    </span>
                </div>

                <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[20px]">
                        group
                    </span>

                    <span className="text-sm">
                        {participants.length}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-outline-variant/40">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        Tagihan
                    </h1>

                    <span className="text-sm">
                        {bills.length} tagihan
                    </span>
                </div>

                <span className="text-primary font-bold text-3xl tracking-tight">
                    {formatIDR(totalSession)}
                </span>
            </div>

            <div className="flex items-center gap-2 pb-1 flex-wrap">
                {participants.map((p, index) => {
                    const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

                    return (
                        <div key={p.id} className="flex items-center gap-2 bg-white px-2.5 py-2 rounded-xl shadow-sm shrink-0">
                            <div className={`w-5 h-5 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center text-[10px] font-bold`}>
                                {p.name.charAt(0).toUpperCase()}
                            </div>

                            <span className="text-xs font-medium text-on-surface">
                                {p.name}
                            </span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}