import { calculateItemShares } from "./itemShares";
import { calculateAdjustmentShares } from "./adjustmentShares";

export function calculateParticipantResponsibilities(participants, bills) {
    const participantIds = participants.map(
        (participant) => participant.id
    );

    const responsibilities = {};

    participants.forEach((participant) => {
        responsibilities[participant.id] = 0;
    });

    (bills || []).forEach((bill) => {
        const participantItemSubtotals = {};

        participantIds.forEach((participantId) => {
            participantItemSubtotals[participantId] = 0;
        });

        (bill.items || []).forEach((item) => {
            const itemShares = calculateItemShares(item, participantIds);

            itemShares.forEach(
                ({ participantId, amount }) => {
                    participantItemSubtotals[participantId] += amount;
                }
            );
        });

        const participantAdjustmentTotals = {};

        participantIds.forEach((participantId) => {
            participantAdjustmentTotals[participantId] = 0;
        });

        (bill.adjustments || []).forEach(
            (adjustment) => {
                const adjustmentShares = calculateAdjustmentShares(adjustment, participantIds, participantItemSubtotals);

                adjustmentShares.forEach(
                    ({ participantId, amount }) => {
                        participantAdjustmentTotals[participantId] += amount;
                    }
                );
            }
        );

        participantIds.forEach((participantId) => {
            responsibilities[participantId] += participantItemSubtotals[participantId] + participantAdjustmentTotals[participantId];
        });
    });

    return participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        totalResponsibility: responsibilities[participant.id]
    }));
}