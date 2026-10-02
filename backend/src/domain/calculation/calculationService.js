import { calculateParticipantBalances } from "./participantBalances.js";
import { calculateSettlements } from "./settlements.js";

export function calculateSettlement(participants, bills) {
    const balances = calculateParticipantBalances(participants, bills);
    const settlements = calculateSettlements(balances);

    return { balances, settlements };
}