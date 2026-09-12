export function calculateBillTotal(bill) {
    const itemsSubtotal = (bill.items || []).reduce((sum, item) => {
        return sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1);
    }, 0);

    const totalCharges = (bill.adjustments || [])
        .filter((adj) => adj.type === 'charge')
        .reduce((sum, adj) => sum + (Number(adj.amount) || 0), 0);

    const totalDiscounts = (bill.adjustments || [])
        .filter((adj) => adj.type === 'discount')
        .reduce((sum, adj) => sum + (Number(adj.amount) || 0), 0);

    return Math.max(0, itemsSubtotal + totalCharges - totalDiscounts);
}

export function calculateSessionTotal(bills) {
    return (bills || []).reduce((sum, bill) => sum + calculateBillTotal(bill), 0);
}

export function calculateBilledParticipantCount(
    items,
    participants
) {
    const billedParticipantIds = new Set();

    items.forEach((item) => {
        if (item.assignedParticipantIds.includes('all')) {
            participants.forEach((participant) => {
                billedParticipantIds.add(participant.id);
            });

            return;
        }

        item.assignedParticipantIds.forEach((participantId) => {
            billedParticipantIds.add(participantId);
        });
    });

    return billedParticipantIds.size;
}

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

            const isAll = item.assignedParticipantIds.includes('all');

            const targetIds = isAll
                ? participants.map((p) => p.id)
                : item.assignedParticipantIds;

            if (targetIds.length > 0) {
                const perPersonItem = itemTotal / targetIds.length;

                targetIds.forEach((id) => {
                    if (personItemSubtotals[id] !== undefined) {
                        personItemSubtotals[id] += perPersonItem;
                    }
                });
            }
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

export function calculateSettlements(participantBalances) {
    const debtors = participantBalances
        .filter((p) => p.balance < -0.01)
        .map((p) => ({ ...p, amountToPay: Math.abs(p.balance) }))
        .sort((a, b) => b.amountToPay - a.amountToPay);

    const creditors = participantBalances
        .filter((p) => p.balance > 0.01)
        .map((p) => ({ ...p, amountToReceive: p.balance }))
        .sort((a, b) => b.amountToReceive - a.amountToReceive);

    const transfers = [];
    let debtorIdx = 0;
    let creditorIdx = 0;

    while (debtorIdx < debtors.length && creditorIdx < creditors.length) {
        const debtor = debtors[debtorIdx];
        const creditor = creditors[creditorIdx];
        const transferAmount = Math.min(debtor.amountToPay, creditor.amountToReceive);

        if (transferAmount > 0) {
            transfers.push({
                fromId: debtor.id,
                fromName: debtor.name,
                toId: creditor.id,
                toName: creditor.name,
                amount: Math.round(transferAmount)
            });
        }

        debtor.amountToPay -= transferAmount;
        creditor.amountToReceive -= transferAmount;

        if (Math.round(debtor.amountToPay) <= 0) debtorIdx++;
        if (Math.round(creditor.amountToReceive) <= 0) creditorIdx++;
    }

    return transfers;
}
