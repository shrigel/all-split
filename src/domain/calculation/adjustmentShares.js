import {
    allocateEqual,
    allocateProportional
} from "./allocation";

export function calculateAdjustmentShares(
    adjustment,
    participantIds,
    participantItemSubtotals
) {
    const amount = Number(adjustment.amount) || 0;

    if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new RangeError(
            "Adjustment amount must be a non-negative safe integer."
        );
    }

    let allocations;

    if (adjustment.allocationType === "proportional") {
        const recipients = participantIds.map(
            (participantId) => ({
                participantId,
                weight: participantItemSubtotals[participantId] || 0
            })
        );

        allocations = allocateProportional(amount, recipients);
    } else {
        allocations = allocateEqual(amount, participantIds);
    }

    const multiplier = adjustment.type === "discount" ? -1 : 1;

    return allocations.map(
        ({ participantId, amount }) => ({
            participantId,
            amount: amount * multiplier
        })
    );
}