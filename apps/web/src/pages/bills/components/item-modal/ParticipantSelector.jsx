import { formatIDR } from "../../../../utils/formatter";

export default function ParticipantSelector({
    participants,
    selectedIds,
    onChange,
    subtotal,
}) {
    const participantIds = participants.map(
        (participant) => participant.id
    );

    const selectedIdSet = new Set(selectedIds);

    const isAll =
        participants.length > 0 &&
        participantIds.every((id) =>
            selectedIdSet.has(id)
        );

    const selectedCount = participants.filter(
        (participant) =>
            selectedIdSet.has(participant.id)
    ).length;

    const perPersonEstimate = selectedCount > 0
        ? Math.round(
            (Number(subtotal) || 0) / selectedCount
        )
        : 0;

    const isParticipantSelected = (participantId) => {
        return selectedIdSet.has(participantId);
    };

    const handleToggleAll = () => {
        if (isAll) {
            onChange([]);
            return;
        }

        onChange(participantIds);
    };

    const handleToggleParticipant = (participantId) => {
        if (selectedIdSet.has(participantId)) {
            onChange(
                selectedIds.filter(
                    (id) => id !== participantId
                )
            );

            return;
        }

        onChange([
            ...selectedIds,
            participantId
        ]);
    };

    return (
        <section className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Dibagi Ke Siapa?
                </span>

                <button
                    type="button"
                    onClick={handleToggleAll}
                    className="text-xs font-medium text-primary hover:underline cursor-pointer"
                >
                    {isAll
                        ? "Batalkan Semua"
                        : `Pilih Semua (${participants.length})`}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {participants.map((participant) => {
                    const selected =
                        isParticipantSelected(
                            participant.id
                        );

                    return (
                        <button
                            key={participant.id}
                            type="button"
                            onClick={() =>
                                handleToggleParticipant(
                                    participant.id
                                )
                            }
                            aria-pressed={selected}
                            className={`flex items-center gap-2 p-2.5 rounded-xl transition-all text-left cursor-pointer border ${selected
                                ? "border-primary bg-primary/10 shadow-xs"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                                }`}
                        >
                            <div
                                className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${selected
                                    ? "bg-primary text-white"
                                    : "bg-slate-200 text-slate-600"
                                    }`}
                            >
                                {participant.name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <span
                                className={`text-xs font-semibold truncate flex-1 ${selected
                                    ? "text-on-surface"
                                    : "text-slate-600"
                                    }`}
                            >
                                {participant.name}
                            </span>

                            {selected && (
                                <span
                                    className="material-symbols-outlined text-primary text-[16px]"
                                    aria-hidden="true"
                                >
                                    check_circle
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
                {selectedCount === 0 ? (
                    <span className="font-medium">
                        Pilih minimal 1 orang
                    </span>
                ) : (
                    <>
                        Dihitung {formatIDR(perPersonEstimate)} / orang ({selectedCount} dipilih).
                    </>
                )}
            </p>
        </section>
    );
}