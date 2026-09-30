import { calculateItemTotal } from "./itemTotals";

export function calculateBillFinancialSummary(bill) {
    const itemsSubtotal = (bill.items || []).reduce((sum, item) => sum + calculateItemTotal(item), 0);

    const totalCharges = (bill.adjustments || [])
        .filter((adj) => adj.type === 'charge')
        .reduce((sum, adj) => sum + (Number(adj.amount) || 0), 0);

    const totalDiscounts = (bill.adjustments || [])
        .filter((adj) => adj.type === 'discount')
        .reduce((sum, adj) => sum + (Number(adj.amount) || 0), 0);

    return {
        itemsSubtotal,
        totalCharges,
        totalDiscounts,
        finalTotal: itemsSubtotal + totalCharges - totalDiscounts,
    };
}

export function calculateBillTotal(bill) {
    const { finalTotal } = calculateBillFinancialSummary(bill);

    return Math.max(0, finalTotal);
}

export function calculateSessionTotal(bills) {
    return (bills || []).reduce((sum, bill) => sum + calculateBillTotal(bill), 0);
}