export function areAllParticipantsAssigned(
    assignedParticipantIds,
    participants
) {
    if (participants.length === 0) {
        return false;
    }

    const assignedIds = new Set(
        assignedParticipantIds || []
    );

    return participants.every(
        (participant) =>
            assignedIds.has(participant.id)
    );
}

export function calculateBilledParticipantCount(
    items,
    participants
) {
    const validParticipantIds = new Set(
        participants.map(
            (participant) => participant.id
        )
    );

    const billedParticipantIds = new Set();

    items.forEach((item) => {
        (item.assignedParticipantIds || [])
            .forEach((participantId) => {
                if (validParticipantIds.has(participantId)) {
                    billedParticipantIds.add(participantId);
                }
            });
    });

    return billedParticipantIds.size;
}