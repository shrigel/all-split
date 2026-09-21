import { calculateBillTotal } from "./billTotals";

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

        (bill.items || []).forEach((item) => {
            const itemTotal = (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1);

            const targetIds = [...new Set(item.assignedParticipantIds || [])]
                .filter((participantId) => personItemSubtotals[participantId] !== undefined);

            if (targetIds.length === 0) {
                return;
            }

            const perPersonItem =
                itemTotal / targetIds.length;

            targetIds.forEach((participantId) => {
                personItemSubtotals[participantId] += perPersonItem;
            });
        });

        const billItemsSubtotal = Object.values(personItemSubtotals).reduce((a, b) => a + b, 0);

        const personAdjTotals = {};

        participants.forEach((p) => { personAdjTotals[p.id] = 0; });

        (bill.adjustments || []).forEach((adj) => {
            const rawAmount = Number(adj.amount) || 0;
            const signedAmount = adj.type === 'discount' ? -rawAmount : rawAmount;

            if (adj.allocationType === 'proportional' && billItemsSubtotal > 0) {
                participants.forEach((p) => {
                    const ratio = personItemSubtotals[p.id] / billItemsSubtotal;
                    personAdjTotals[p.id] += signedAmount * ratio;
                });
            } else {
                const perPersonEqual = signedAmount / participants.length;
                participants.forEach((p) => {
                    personAdjTotals[p.id] += perPersonEqual;
                });
            }
        });

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