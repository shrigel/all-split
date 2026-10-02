export function calculateItemTotal(item) {
    const unitPrice = Number(item.unitPrice) || 0;

    const quantity = Number(item.quantity) || 1;

    const itemTotal = unitPrice * quantity;

    if (!Number.isSafeInteger(itemTotal)) {
        throw new RangeError(
            "Item total must be a safe integer."
        );
    }

    return itemTotal;
}