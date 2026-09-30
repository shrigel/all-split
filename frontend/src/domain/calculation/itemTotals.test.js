import {
    describe,
    expect,
    test
} from "vitest";

import {
    calculateItemTotal
} from "./itemTotals";

describe("calculateItemTotal", () => {
    test("calculates item total from unit price and quantity", () => {
        expect(
            calculateItemTotal({
                unitPrice: 100,
                quantity: 3
            })
        ).toBe(300);
    });

    test("supports numeric string values from form input", () => {
        expect(
            calculateItemTotal({
                unitPrice: "75",
                quantity: "2"
            })
        ).toBe(150);
    });

    test("uses quantity one when quantity is omitted", () => {
        expect(
            calculateItemTotal({
                unitPrice: 100
            })
        ).toBe(100);
    });

    test("rejects totals outside the safe integer range", () => {
        expect(() =>
            calculateItemTotal({
                unitPrice:
                    Number.MAX_SAFE_INTEGER,
                quantity: 2
            })
        ).toThrow(RangeError);
    });
});