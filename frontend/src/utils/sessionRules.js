export function getParticipantUsage(session, participantId) {
    const bills = session.bills.filter((bill) => {
        const isPayer = bill.payerId === participantId;

        const hasAssignedItem = bill.items.some((item) =>
            item.assignedParticipantIds?.includes(participantId)
        );

        return isPayer || hasAssignedItem;
    });

    return {
        isUsed: bills.length > 0,
        bills
    };
}