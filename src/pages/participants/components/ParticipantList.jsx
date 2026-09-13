import { AVATAR_PALETTES } from "../../../constants/avatarPalettes";

export default function ParticipantList({
    participants,
    onRemoveParticipant
}) {
    return (
        <section className="flex flex-col">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-300">
                <span className="text-sm font-semibold text-slate-800">Peserta Terdaftar</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">{participants.length}</span>
            </div>

            {participants.length > 0 && (
                <div className="flex flex-col divide-y divide-slate-200">
                    {participants.map((participant, index) => {
                        const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

                        return (
                            <div key={participant.id} className="flex justify-between items-center py-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full ${palette.bg} ${palette.text} text-sm flex items-center justify-center font-bold shrink-0`}>
                                        {participant.name.charAt(0).toUpperCase()}
                                    </div>

                                    <span className="text-sm font-medium text-slate-800 truncate">
                                        {participant.name}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    aria-label={`Hapus ${participant.name} dari daftar peserta`}
                                    title={`Hapus ${participant.name}`}
                                    onClick={() => onRemoveParticipant(participant.id)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-rose-500 transition-all"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="material-symbols-outlined text-[18px]"
                                    >
                                        close
                                    </span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="flex items-center gap-2 pt-3 text-slate-400">
                <span className="material-symbols-outlined text-[16px]">
                    info
                </span>
                <span className="text-xs">
                    Minimal 2 peserta untuk patungan
                </span>
            </div>
        </section>
    )
}