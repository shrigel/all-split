import { formatIDR, capitalizeWords } from "../../../utils/formatter";
import { areAllParticipantsAssigned } from "../../../domain/bills/participantAssignments";

export default function BillLineItem({
    item,
    participants,
    onEdit,
    onDelete,
}) {
    const isAssignedToAll = areAllParticipantsAssigned(item.assignedParticipantIds, participants);

    return (
        <div className="flex flex-col py-3 gap-2">
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface truncate">
                            {capitalizeWords(item.name)}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                            <span>
                                {item.quantity} @ {formatIDR(item.unitPrice)}
                            </span>
                        </div>
                    </div>

                    <span className="text-lg font-bold text-on-surface">
                        {formatIDR(item.quantity * item.unitPrice)}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onEdit}
                    className="text-gray-400 hover:text-primary transition-all cursor-pointer"
                    title="Edit Item"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        edit
                    </span>
                </button>

                <button
                    type="button"
                    onClick={onDelete}
                    className="text-gray-400 hover:text-red-500 transition-all"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        delete
                    </span>
                </button>
            </div>

            <div className="flex gap-2 items-center flex-wrap bg-surface-container-low p-2 rounded-xl">
                <span className="text-xs">
                    Dipesan:
                </span>

                {isAssignedToAll ? (
                    <div className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2 py-1 rounded-lg text-xs font-semibold">
                        <span className="material-symbols-outlined text-[14px]">
                            groups
                        </span>

                        <span>
                            Semua ({participants.length} peserta)
                        </span>
                    </div>
                ) : (
                    item.assignedParticipantIds.map((participantId) => {
                        const participant = participants.find(
                            (participant) => participant.id === participantId
                        );

                        if (!participant) {
                            return null;
                        }

                        return (
                            <span
                                key={participant.id}
                                className="bg-surface-container-high text-on-surface px-2 py-1 rounded-lg text-xs font-medium"
                            >
                                {participant.name}
                            </span>
                        );
                    })
                )}
            </div>
        </div>
    )
}