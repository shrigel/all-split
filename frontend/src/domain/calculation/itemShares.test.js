import {
    describe,
    expect,
    test
} from "vitest";

import {
    calculateItemShares
} from "./itemShares";

describe("calculateItemShares", () => {
    test("assigns the full item amount to one participant", () => {
        const item = {
            unitPrice: 100,
            quantity: 1,
            assignedParticipantIds: ["A"]
        };

        expect(
            calculateItemShares(
                item,
                ["A", "B", "C"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 100
            }
        ]);
    });

    test("splits an item evenly when divisible", () => {
        const item = {
            unitPrice: 100,
            quantity: 1,
            assignedParticipantIds: ["A", "B"]
        };

        expect(
            calculateItemShares(
                item,
                ["A", "B"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 50
            },
            {
                participantId: "B",
                amount: 50
            }
        ]);
    });

    test("splits an odd amount deterministically", () => {
        const item = {
            unitPrice: 100,
            quantity: 1,
            assignedParticipantIds: [
                "A",
                "B",
                "C"
            ]
        };

        expect(
            calculateItemShares(
                item,
                ["A", "B", "C"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 34
            },
            {
                participantId: "B",
                amount: 33
            },
            {
                participantId: "C",
                amount: 33
            }
        ]);
    });

    test("uses quantity when calculating item total", () => {
        const item = {
            unitPrice: 75,
            quantity: 2,
            assignedParticipantIds: [
                "A",
                "B"
            ]
        };

        expect(
            calculateItemShares(
                item,
                ["A", "B"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 75
            },
            {
                participantId: "B",
                amount: 75
            }
        ]);
    });

    test("ignores participant ids that are not in the session", () => {
        const item = {
            unitPrice: 100,
            quantity: 1,
            assignedParticipantIds: [
                "A",
                "UNKNOWN"
            ]
        };

        expect(
            calculateItemShares(
                item,
                ["A", "B"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 100
            }
        ]);
    });

    test("uses session participant order for deterministic remainder allocation", () => {
        const item = {
            unitPrice: 100,
            quantity: 1,
            assignedParticipantIds: [
                "C",
                "A",
                "B"
            ]
        };

        expect(
            calculateItemShares(
                item,
                ["A", "B", "C"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 34
            },
            {
                participantId: "B",
                amount: 33
            },
            {
                participantId: "C",
                amount: 33
            }
        ]);
    });

    test("preserves the original item total", () => {
        const item = {
            unitPrice: 100,
            quantity: 1,
            assignedParticipantIds: [
                "A",
                "B",
                "C"
            ]
        };

        const result = calculateItemShares(
            item,
            ["A", "B", "C"]
        );

        const allocatedTotal = result.reduce(
            (sum, share) =>
                sum + share.amount,
            0
        );

        expect(allocatedTotal).toBe(100);
    });
});