export function calculateSettlements(participantBalances) {
    const indexedBalances = participantBalances.map((participant, index) => {
        if (!Number.isSafeInteger(participant.balance)) {
            throw new RangeError(
                "Participant balance must be a safe integer."
            );
        }

        return {
            ...participant,
            index
        };
    });

    const totalBalance = indexedBalances.reduce((sum, participant) => {
        const nextTotal = sum + participant.balance;

        if (!Number.isSafeInteger(nextTotal)) {
            throw new RangeError(
                "Total balance exceeds the safe integer range."
            );
        }

        return nextTotal;
    }, 0);

    if (totalBalance !== 0) {
        throw new RangeError(
            "Participant balances must sum to zero."
        );
    }

    const debtors = indexedBalances
        .filter((participant) => participant.balance < 0)
        .map((participant) => ({
            ...participant,
            amountToPay: Math.abs(participant.balance)
        }))
        .sort((a, b) => {
            if (b.amountToPay !== a.amountToPay) {
                return b.amountToPay - a.amountToPay;
            }

            return a.index - b.index;
        });

    const creditors = indexedBalances
        .filter((participant) => participant.balance > 0)
        .map((participant) => ({
            ...participant,
            amountToReceive: participant.balance
        }))
        .sort((a, b) => {
            if (b.amountToReceive !== a.amountToReceive) {
                return b.amountToReceive - a.amountToReceive;
            }

            return a.index - b.index;
        });

    const transfers = [];

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const debtor = debtors[debtorIndex];

        const creditor = creditors[creditorIndex];

        const transferAmount = Math.min(debtor.amountToPay, creditor.amountToReceive);

        transfers.push({
            fromId: debtor.id,
            fromName: debtor.name,
            toId: creditor.id,
            toName: creditor.name,
            amount: transferAmount
        });

        debtor.amountToPay -= transferAmount;

        creditor.amountToReceive -= transferAmount;

        if (debtor.amountToPay === 0) {
            debtorIndex++;
        }

        if (creditor.amountToReceive === 0) {
            creditorIndex++;
        }
    }

    return transfers;
}