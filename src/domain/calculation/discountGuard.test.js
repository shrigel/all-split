import {
    describe,
    expect,
    test
} from "vitest";

import {
    calculateMaximumDiscount,
    clampDiscountAmount
} from "./discountGuard";

describe("calculateMaximumDiscount", () => {
    test("should return 100000 if there are items and no adjustments", () => {
        const bill = {
            items: [
                {
                    unitPrice: 100000,
                    quantity: 1
                }
            ],
            adjustments: []
        };

        expect(calculateMaximumDiscount(bill)).toBe(100000);
    });

    test("Charge should add the max discount amount", () => {
        const bill = {
            items: [
                {
                    unitPrice: 100000,
                    quantity: 1
                }
            ],
            adjustments: [
                {
                    id: "charge-1",
                    type: "charge",
                    amount: 20000
                }
            ]
        };

        expect(calculateMaximumDiscount(bill)).toBe(120000);
    });

    test("existing discount should reduce the max discount amount", () => {
        const bill = {
            items: [
                {
                    unitPrice: 100000,
                    quantity: 1
                }
            ],
            adjustments: [
                {
                    id: "charge-1",
                    type: "charge",
                    amount: 20000
                },
                {
                    id: "discount-1",
                    type: "discount",
                    amount: 30000
                }
            ]
        };

        expect(calculateMaximumDiscount(bill)).toBe(90000);
    });

    test("excluding an adjustment should increase the max discount amount", () => {
        const bill = {
            items: [
                {
                    unitPrice: 100000,
                    quantity: 1
                }
            ],
            adjustments: [
                {
                    id: "charge-1",
                    type: "charge",
                    amount: 20000
                },
                {
                    id: "discount-1",
                    type: "discount",
                    amount: 30000
                }
            ]
        };

        expect(calculateMaximumDiscount(bill, "discount-1")).toBe(120000);
    });

    test("Charge should be excluded when edited", () => {
        const bill = {
            items: [
                {
                    unitPrice: 100000,
                    quantity: 1
                }
            ],
            adjustments: [
                {
                    id: "charge-a",
                    type: "charge",
                    amount: 20000
                }
            ]
        };

        expect(calculateMaximumDiscount(bill, "charge-a")).toBe(100000);
    });

    test("return 0 when no discount left", () => {
        const bill = {
            items: [
                {
                    unitPrice: 100000,
                    quantity: 1
                }
            ],
            adjustments: [
                {
                    id: "discount-1",
                    type: "discount",
                    amount: 100000
                }
            ]
        };

        expect(calculateMaximumDiscount(bill)).toBe(0);
    });
});

describe("clampDiscountAmount", () => {
    test("should return valid discount amount", () => {
        expect(clampDiscountAmount(50000, 100000)).toBe(50000);
    });

    test("should return correct if discount amount is exceeded", () => {
        expect(clampDiscountAmount(150000, 100000)).toBe(100000);
    });
});