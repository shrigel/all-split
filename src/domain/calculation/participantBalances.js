import { calculateBillTotal } from "./billTotals";
import { calculateItemShares } from "./itemShares";
import { calculateAdjustmentShares } from "./adjustmentShares";

export function calculateParticipantBalances(participants, bills) {
    const balances = {};

    participants.forEach((p) => {
        balances[p.id] = {
            id: p.id,
            name: p.name,
            totalPaid: 0,
            totalResponsibility: 0,
            balance: 0
        };
    });

    (bills || []).forEach((bill) => {
        const billTotal = calculateBillTotal(bill);

        if (balances[bill.payerId]) {
            balances[bill.payerId].totalPaid += billTotal;
        }

        const personItemSubtotals = {};
        participants.forEach((p) => { personItemSubtotals[p.id] = 0; });

        const participantIds = participants.map((participant) => participant.id);

        (bill.items || []).forEach((item) => {
            const itemShares = calculateItemShares(
                item,
                participantIds
            );

            itemShares.forEach(
                ({ participantId, amount }) => {
                    personItemSubtotals[participantId] += amount;
                }
            );
        });

        const personAdjTotals = {};

        participants.forEach((p) => { personAdjTotals[p.id] = 0; });

        (bill.adjustments || []).forEach(
            (adjustment) => {
                const adjustmentShares = calculateAdjustmentShares(adjustment, participantIds, personItemSubtotals);

                adjustmentShares.forEach(
                    ({ participantId, amount }) => {
                        personAdjTotals[participantId] += amount;
                    }
                );
            }
        );

        participants.forEach((p) => {
            const personBillTotal = personItemSubtotals[p.id] + personAdjTotals[p.id];
            balances[p.id].totalResponsibility += Math.round(personBillTotal);
        });
    });

    return Object.values(balances).map((p) => ({
        ...p,
        balance: p.totalPaid - p.totalResponsibility
    }));
}