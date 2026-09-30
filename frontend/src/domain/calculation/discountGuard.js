import { calculateBillFinancialSummary } from "./billTotals";

export function calculateMaximumDiscount(bill, excludedAdjustmentId) {
    const adjustments = (bill.adjustments || []).filter(
        (adj) => adj.id !== excludedAdjustmentId
    );

    const { finalTotal } = calculateBillFinancialSummary({ ...bill, adjustments });

    return Math.max(0, finalTotal);
}

export function clampDiscountAmount(amount, maximumDiscount) {
    return Math.min(Number(amount), Number(maximumDiscount));
}

export function normalizeDiscountAdjustments(bill) {
    const adjustments = Array.isArray(bill.adjustments)
        ? bill.adjustments
        : [];

    const { itemsSubtotal, totalCharges } = calculateBillFinancialSummary({ ...bill, adjustments });

    let remainingDiscountCapacity = Math.max(0, itemsSubtotal + totalCharges);

    const normalizedAdjustments = adjustments.map((adjustment) => {
        if (adjustment.type !== "discount") {
            return adjustment;
        }

        const amount = clampDiscountAmount(adjustment.amount, remainingDiscountCapacity);

        remainingDiscountCapacity -= amount;

        return {
            ...adjustment,
            amount
        };
    });

    return normalizedAdjustments.filter((adjustment) => adjustment.type !== "discount" || adjustment.amount > 0);
}