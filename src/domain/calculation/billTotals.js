import { calculateItemTotal } from "./itemTotals";

export function calculateBillTotal(bill) {
    const itemsSubtotal = (bill.items || []).reduce((sum, item) => sum + calculateItemTotal(item), 0);

    const totalCharges = (bill.adjustments || [])
        .filter((adj) => adj.type === 'charge')
        .reduce((sum, adj) => sum + (Number(adj.amount) || 0), 0);

    const totalDiscounts = (bill.adjustments || [])
        .filter((adj) => adj.type === 'discount')
        .reduce((sum, adj) => sum + (Number(adj.amount) || 0), 0);

    return Math.max(0, itemsSubtotal + totalCharges - totalDiscounts);
}

export function calculateSessionTotal(bills) {
    return (bills || []).reduce((sum, bill) => sum + calculateBillTotal(bill), 0);
}