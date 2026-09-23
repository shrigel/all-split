import { allocateEqual } from "./allocation";
import { calculateItemTotal } from "./itemTotals";

export function calculateItemShares(item, participantIds) {
    const itemTotal = calculateItemTotal(item);

    if (!Number.isSafeInteger(itemTotal)) {
        throw new RangeError(
            "Item total must be a safe integer."
        );
    }

    const assignedIds = new Set(
        item.assignedParticipantIds || []
    );

    const targetIds = participantIds.filter(
        (participantId) => assignedIds.has(participantId)
    );

    if (targetIds.length === 0) {
        return [];
    }

    return allocateEqual(
        itemTotal,
        targetIds
    );
}