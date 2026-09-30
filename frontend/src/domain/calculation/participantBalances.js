import { calculateBillTotal } from "./billTotals";
import { calculateParticipantResponsibilities } from "./participantResponsibilities";

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

    const responsibilities = calculateParticipantResponsibilities(participants, bills);

    responsibilities.forEach((participant) => {
        balances[participant.id].totalResponsibility = participant.totalResponsibility;
    });

    (bills || []).forEach((bill) => {
        const billTotal = calculateBillTotal(bill);

        if (!Number.isSafeInteger(billTotal)) {
            throw new RangeError(
                "Bill total must be a safe integer."
            );
        }

        if (balances[bill.payerId]) {
            balances[bill.payerId].totalPaid += billTotal;
        }
    });

    return participants.map((participant) => {
        const result = balances[participant.id];

        const balance = result.totalPaid - result.totalResponsibility;

        if (!Number.isSafeInteger(balance)) {
            throw new RangeError(
                "Participant balance must be a safe integer."
            );
        }

        return {
            ...result,
            balance
        };
    });
}