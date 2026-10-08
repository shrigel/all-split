import { getSplit } from "./split.service.js";
import { calculateSettlement } from "../domain/calculation/calculationService.js";

export const getSettlement = async (id, accessToken) => {
    const split = await getSplit(id, accessToken);

    if (!split) {
        return null;
    }

    if (split.participants.length < 2) {
        return {
            error: "INSUFFICIENT_PARTICIPANTS",
            message: "Split must have at least 2 participants to calculate settlement"
        };
    }

    for (const bill of split.bills) {
        if (bill.items.length === 0) {
            return {
                error: "EMPTY_BILL",
                message: `Bill "${bill.name}" has no items`
            };
        }

        const unassignedItem = bill.items.find((item) => item.shares.length === 0);

        if (unassignedItem) {
            return {
                error: "UNASSIGNED_ITEM",
                message: `Item "${unassignedItem.name}" in bill "${bill.name}" has no assigned participants`
            };
        }
    }

    const result = calculateSettlement(split.participants, split.bills);

    return result;
};