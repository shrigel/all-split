import { areAllParticipantsAssigned } from "../../../utils/calculations";
import { capitalizeWords, formatIDR } from "../../../utils/formatter";

export default function BillDetailItemsSection({
    items,
    participants
}) {
    return (
        <section className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Item Dipesan ({items.length})
            </span>

            <div className="flex flex-col bg-surface-container-low/50 rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/20 px-3">
                {items.map((item) => {
                    const isAssignedToAll = areAllParticipantsAssigned(item.assignedParticipantIds, participants);

                    return (
                        <div
                            key={item.id}
                            className="py-2.5 flex flex-col gap-1.5"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-on-surface">
                                        {capitalizeWords(item.name)}
                                    </span>

                                    <span className="text-[11px] text-slate-500">
                                        {item.quantity}@{formatIDR(item.unitPrice)}
                                    </span>
                                </div>

                                <span className="text-xs font-bold text-on-surface">
                                    {formatIDR(item.quantity * item.unitPrice)}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[10px] text-slate-400">
                                    Untuk:
                                </span>

                                {isAssignedToAll ? (
                                    <span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-medium">
                                        Semua Orang
                                    </span>
                                ) : (
                                    item.assignedParticipantIds.map((participantId) => {
                                        const participant = participants.find((participant) => participant.id === participantId);

                                        if (!participant) {
                                            return null;
                                        }

                                        return (
                                            <span
                                                key={participant.id}
                                                className="text-[10px] bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded font-medium"
                                            >
                                                {participant.name}
                                            </span>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}