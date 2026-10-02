import { expect, test } from "vitest";
import { calculateSettlement } from "./calculationService.js";

const participants = [
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" }
];

const bills = [
    {
        payerId: "A",
        items: [
            {
                unitPrice: 60,
                quantity: 1,
                assignedParticipantIds: ["A"]
            },
            {
                unitPrice: 90,
                quantity: 1,
                assignedParticipantIds: ["B", "C"]
            }
        ],
        adjustments: []
    }
];

test("calculates a complete single-bill settlement", () => {
    const { balances, settlements } = calculateSettlement(participants, bills);

    expect(balances).toEqual([
        { id: "A", name: "A", totalPaid: 150, totalResponsibility: 60, balance: 90 },
        { id: "B", name: "B", totalPaid: 0, totalResponsibility: 45, balance: -45 },
        { id: "C", name: "C", totalPaid: 0, totalResponsibility: 45, balance: -45 }
    ]);

    expect(settlements).toEqual([
        { fromId: "B", fromName: "B", toId: "A", toName: "A", amount: 45 },
        { fromId: "C", fromName: "C", toId: "A", toName: "A", amount: 45 }
    ]);
});