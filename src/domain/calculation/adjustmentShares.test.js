import {
    describe,
    expect,
    test
} from "vitest";

import {
    calculateAdjustmentShares
} from "./adjustmentShares";

describe("calculateAdjustmentShares", () => {
    test("allocates an equal charge", () => {
        const adjustment = {
            type: "charge",
            amount: 100,
            allocationType: "equal"
        };

        expect(
            calculateAdjustmentShares(
                adjustment,
                ["A", "B"],
                {
                    A: 60,
                    B: 40
                }
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

    test("allocates an odd equal charge deterministically", () => {
        const adjustment = {
            type: "charge",
            amount: 100,
            allocationType: "equal"
        };

        expect(
            calculateAdjustmentShares(
                adjustment,
                ["A", "B", "C"],
                {
                    A: 34,
                    B: 33,
                    C: 33
                }
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

    test("allocates a proportional charge", () => {
        const adjustment = {
            type: "charge",
            amount: 10,
            allocationType: "proportional"
        };

        expect(
            calculateAdjustmentShares(
                adjustment,
                ["A", "B"],
                {
                    A: 60,
                    B: 40
                }
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 6
            },
            {
                participantId: "B",
                amount: 4
            }
        ]);
    });

    test("allocates proportional remainder deterministically", () => {
        const adjustment = {
            type: "charge",
            amount: 10,
            allocationType: "proportional"
        };

        expect(
            calculateAdjustmentShares(
                adjustment,
                ["A", "B", "C"],
                {
                    A: 34,
                    B: 33,
                    C: 33
                }
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 4
            },
            {
                participantId: "B",
                amount: 3
            },
            {
                participantId: "C",
                amount: 3
            }
        ]);
    });

    test("returns negative shares for a discount", () => {
        const adjustment = {
            type: "discount",
            amount: 100,
            allocationType: "equal"
        };

        expect(
            calculateAdjustmentShares(
                adjustment,
                ["A", "B", "C"],
                {
                    A: 34,
                    B: 33,
                    C: 33
                }
            )
        ).toEqual([
            {
                participantId: "A",
                amount: -34
            },
            {
                participantId: "B",
                amount: -33
            },
            {
                participantId: "C",
                amount: -33
            }
        ]);
    });

    test("preserves the original charge amount", () => {
        const adjustment = {
            type: "charge",
            amount: 101,
            allocationType: "proportional"
        };

        const result =
            calculateAdjustmentShares(
                adjustment,
                ["A", "B", "C"],
                {
                    A: 50,
                    B: 30,
                    C: 20
                }
            );

        const total = result.reduce(
            (sum, share) =>
                sum + share.amount,
            0
        );

        expect(total).toBe(101);
    });

    test("preserves the signed discount amount", () => {
        const adjustment = {
            type: "discount",
            amount: 101,
            allocationType: "proportional"
        };

        const result =
            calculateAdjustmentShares(
                adjustment,
                ["A", "B", "C"],
                {
                    A: 50,
                    B: 30,
                    C: 20
                }
            );

        const total = result.reduce(
            (sum, share) =>
                sum + share.amount,
            0
        );

        expect(total).toBe(-101);
    });

    test("rejects proportional allocation with zero total item weight", () => {
        const adjustment = {
            type: "charge",
            amount: 100,
            allocationType: "proportional"
        };

        expect(() =>
            calculateAdjustmentShares(
                adjustment,
                ["A", "B"],
                {
                    A: 0,
                    B: 0
                }
            )
        ).toThrow(RangeError);
    });
});