import { allocateEqual } from "./allocation";

export function calculateItemShares(item, participantIds) {
    const unitPrice = Number(item.unitPrice) || 0;
    const quantity = Number(item.quantity) || 1;

    const itemTotal = unitPrice * quantity;

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