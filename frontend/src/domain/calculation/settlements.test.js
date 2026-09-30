import {
    describe,
    expect,
    test
} from "vitest";

import { calculateSettlements } from "./settlements";

describe("calculateSettlements", () => {
    test("settles one debtor with one creditor", () => {
        const balances = [
            {
                id: "A",
                name: "A",
                balance: 60
            },
            {
                id: "B",
                name: "B",
                balance: -60
            }
        ];

        expect(calculateSettlements(balances))
            .toEqual([
                {
                    fromId: "B",
                    fromName: "B",
                    toId: "A",
                    toName: "A",
                    amount: 60
                }
            ]);
    });

    test("settles multiple debtors with one creditor", () => {
        const balances = [
            {
                id: "A",
                name: "A",
                balance: 72
            },
            {
                id: "B",
                name: "B",
                balance: -36
            },
            {
                id: "C",
                name: "C",
                balance: -36
            }
        ];

        expect(calculateSettlements(balances))
            .toEqual([
                {
                    fromId: "B",
                    fromName: "B",
                    toId: "A",
                    toName: "A",
                    amount: 36
                },
                {
                    fromId: "C",
                    fromName: "C",
                    toId: "A",
                    toName: "A",
                    amount: 36
                }
            ]);
    });

    test("settles multiple debtors and creditors", () => {
        const balances = [
            {
                id: "A",
                name: "A",
                balance: 70
            },
            {
                id: "B",
                name: "B",
                balance: 30
            },
            {
                id: "C",
                name: "C",
                balance: -60
            },
            {
                id: "D",
                name: "D",
                balance: -40
            }
        ];

        expect(calculateSettlements(balances))
            .toEqual([
                {
                    fromId: "C",
                    fromName: "C",
                    toId: "A",
                    toName: "A",
                    amount: 60
                },
                {
                    fromId: "D",
                    fromName: "D",
                    toId: "A",
                    toName: "A",
                    amount: 10
                },
                {
                    fromId: "D",
                    fromName: "D",
                    toId: "B",
                    toName: "B",
                    amount: 30
                }
            ]);
    });

    test("uses participant order as deterministic tie breaker", () => {
        const balances = [
            {
                id: "A",
                name: "A",
                balance: 50
            },
            {
                id: "B",
                name: "B",
                balance: 50
            },
            {
                id: "C",
                name: "C",
                balance: -50
            },
            {
                id: "D",
                name: "D",
                balance: -50
            }
        ];

        expect(calculateSettlements(balances)).toEqual([
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 50
            },
            {
                fromId: "D",
                fromName: "D",
                toId: "B",
                toName: "B",
                amount: 50
            }
        ]);
    });

    test("ignores participants with zero balance", () => {
        const balances = [
            {
                id: "A",
                name: "A",
                balance: 50
            },
            {
                id: "B",
                name: "B",
                balance: -50
            },
            {
                id: "C",
                name: "C",
                balance: 0
            }
        ];

        const result = calculateSettlements(balances);

        expect(result).toHaveLength(1);

        expect(result.some((transfer) => transfer.fromId === "C" || transfer.toId === "C")).toBe(false);
    });

    test("transfers exactly the total creditor amount", () => {
        const balances = [
            {
                id: "A",
                name: "A",
                balance: 70
            },
            {
                id: "B",
                name: "B",
                balance: 30
            },
            {
                id: "C",
                name: "C",
                balance: -60
            },
            {
                id: "D",
                name: "D",
                balance: -40
            }
        ];

        const transfers = calculateSettlements(balances);

        const transferredTotal = transfers.reduce((sum, transfer) => sum + transfer.amount, 0);

        expect(transferredTotal).toBe(100);
    });

    test("returns only integer transfer amounts", () => {
        const balances = [
            {
                id: "A",
                name: "A",
                balance: 72
            },
            {
                id: "B",
                name: "B",
                balance: -36
            },
            {
                id: "C",
                name: "C",
                balance: -36
            }
        ];

        const transfers = calculateSettlements(balances);

        transfers.forEach((transfer) => expect(Number.isSafeInteger(transfer.amount)).toBe(true));
    });

    test("rejects non-integer participant balances", () => {
        expect(() => calculateSettlements([
            {
                id: "A",
                name: "A",
                balance: 10.5
            },
            {
                id: "B",
                name: "B",
                balance: -10.5
            }
        ])).toThrow(RangeError);
    });

    test("rejects balances that do not sum to zero", () => {
        expect(() => calculateSettlements([
            {
                id: "A",
                name: "A",
                balance: 100
            },
            {
                id: "B",
                name: "B",
                balance: -90
            }
        ])).toThrow(RangeError);
    });
});