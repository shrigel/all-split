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