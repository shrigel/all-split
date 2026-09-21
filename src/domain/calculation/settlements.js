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