import {
    describe,
    expect,
    test
} from "vitest";

import {
    allocateEqual,
    allocateProportional
} from "./allocation";

function sumAllocations(allocations) {
    return allocations.reduce(
        (sum, allocation) =>
            sum + allocation.amount,
        0
    );
}

describe("allocateEqual", () => {
    test("allocates to a single recipient", () => {
        expect(
            allocateEqual(
                100,
                ["A"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 100
            }
        ]);
    });

    test("allocates evenly when divisible", () => {
        expect(
            allocateEqual(
                100,
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

    test("allocates remainder deterministically", () => {
        expect(
            allocateEqual(
                100,
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

    test("keeps the allocated sum equal to the original amount", () => {
        const result = allocateEqual(
            100,
            ["A", "B", "C"]
        );

        expect(
            sumAllocations(result)
        ).toBe(100);
    });

    test("supports an amount smaller than the number of recipients", () => {
        expect(
            allocateEqual(
                2,
                ["A", "B", "C"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 1
            },
            {
                participantId: "B",
                amount: 1
            },
            {
                participantId: "C",
                amount: 0
            }
        ]);
    });

    test("supports zero amount", () => {
        expect(
            allocateEqual(
                0,
                ["A", "B"]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 0
            },
            {
                participantId: "B",
                amount: 0
            }
        ]);
    });
});

describe("allocateProportional", () => {
    test("allocates proportionally when division is exact", () => {
        expect(
            allocateProportional(
                100,
                [
                    {
                        participantId: "A",
                        weight: 60
                    },
                    {
                        participantId: "B",
                        weight: 40
                    }
                ]
            )
        ).toEqual([
            {
                participantId: "A",
                amount: 60
            },
            {
                participantId: "B",
                amount: 40
            }
        ]);
    });

    test("distributes proportional remainder deterministically", () => {
        expect(
            allocateProportional(
                10,
                [
                    {
                        participantId: "A",
                        weight: 1
                    },
                    {
                        participantId: "B",
                        weight: 1
                    },
                    {
                        participantId: "C",
                        weight: 1
                    }
                ]
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

    test("keeps the allocated sum equal to the original amount", () => {
        const result =
            allocateProportional(
                7,
                [
                    {
                        participantId: "A",
                        weight: 5
                    },
                    {
                        participantId: "B",
                        weight: 3
                    },
                    {
                        participantId: "C",
                        weight: 2
                    }
                ]
            );

        expect(
            sumAllocations(result)
        ).toBe(7);
    });

    test("throws when proportional calculation exceeds safe integer range", () => {
        expect(() =>
            allocateProportional(
                Number.MAX_SAFE_INTEGER,
                [
                    {
                        participantId: "A",
                        weight: 2
                    }
                ]
            )
        ).toThrow(RangeError);
    });
});