import {
    expect,
    test
} from "vitest";

import {
    validateBillFinancials,
    validateSessionFinancials
} from "./financialValidation";

const participants = [
    {
        id: "A",
        name: "A"
    },
    {
        id: "B",
        name: "B"
    }
];

test("returns valid for a financially reconciled bill", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: 60000,
                quantity: 1,
                assignedParticipantIds: ["A"]
            },
            {
                unitPrice: 40000,
                quantity: 1,
                assignedParticipantIds: ["B"]
            }
        ],
        adjustments: []
    };

    const result =
        validateBillFinancials(
            bill,
            participants
        );

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);

    expect(result.summary).toEqual({
        itemsSubtotal: 100000,
        totalCharges: 0,
        totalDiscounts: 0,
        finalTotal: 100000,
        totalResponsibility: 100000
    });
});

test("returns invalid payer if payer not found", () => {
    const bill = {
        payerId: "UNKNOWN",
        items: [
            {
                unitPrice: 60000,
                quantity: 1,
                assignedParticipantIds: ["A"]
            },
            {
                unitPrice: 40000,
                quantity: 1,
                assignedParticipantIds: ["B"]
            }
        ],
        adjustments: []
    };

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "INVALID_PAYER"
        })
    );
});

test("returns invalid items if items are empty", () => {
    const bill = {
        payerId: "A",
        items: [],
        adjustments: []
    };

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "INVALID_ITEMS"
        })
    );
});

test("returns invalid if assigned participants not found", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: 50000,
                quantity: 1,
                assignedParticipantIds: []
            }
        ],
        adjustments: []
    };

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "ITEM_WITHOUT_PARTICIPANT"
        })
    );
});

test("returns invalid if assigned participants id is invalid", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: 50000,
                quantity: 1,
                assignedParticipantIds: [
                    "A",
                    "UNKNOWN"
                ]
            }
        ],
        adjustments: []
    };

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "INVALID_ITEM_PARTICIPANT"
        })
    );
});

test("returns invalid item monetary value", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: -10000,
                quantity: 1,
                assignedParticipantIds: ["A"]
            },
            {
                unitPrice: 10000.5,
                quantity: 1,
                assignedParticipantIds: ["A"]
            },
            {
                unitPrice: 10000,
                quantity: 0,
                assignedParticipantIds: ["A"]
            },
            {
                unitPrice: Number.MAX_SAFE_INTEGER,
                quantity: 2,
                assignedParticipantIds: ["A"]
            }
        ],
        adjustments: []
    };

    expect(() => validateBillFinancials(bill, participants)).not.toThrow();

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "INVALID_ITEM_VALUE"
        })
    );
});

test("returns invalid type adjustment", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: 50000,
                quantity: 1,
                assignedParticipantIds: ["A"]
            }
        ],
        adjustments: [
            {
                type: "fee",
                amount: 10000,
                allocationType: "equal"
            }
        ]
    };

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "INVALID_ADJUSTMENT_TYPE"
        })
    );
});

test("returns invalid allocation adjustment", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: 50000,
                quantity: 1,
                assignedParticipantIds: ["A"]
            }
        ],
        adjustments: [
            {
                type: "charge",
                amount: 10000,
                allocationType: "random"
            }
        ]
    };

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "INVALID_ADJUSTMENT_ALLOCATION"
        })
    );
});

test("returns invalid adjustment amount", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: 50000,
                quantity: 1,
                assignedParticipantIds: ["A"]
            }
        ],
        adjustments: [
            {
                type: "charge",
                amount: -10000,
                allocationType: "equal"
            }
        ]
    };

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "INVALID_ADJUSTMENT_AMOUNT"
        })
    );
});

test("returns invalid when final total is negative", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: 50000,
                quantity: 1,
                assignedParticipantIds: [
                    "A",
                    "B"
                ]
            }
        ],
        adjustments: [
            {
                type: "discount",
                amount: 70000,
                allocationType: "equal"
            }
        ]
    };

    const result = validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "NEGATIVE_FINAL_TOTAL"
        })
    );

    expect(result.summary.finalTotal).toBe(-20000);
});

test("returns valid for session with all bills valid", () => {
    const session = {
        participants: [
            { id: "A", name: "A" },
            { id: "B", name: "B" }
        ],
        bills: [
            {
                id: "b1",
                name: "Bill 1",
                payerId: "A",
                items: [
                    {
                        id: "i1",
                        name: "Item 1",
                        unitPrice: 50000,
                        quantity: 1,
                        assignedParticipantIds: ["A"]
                    }
                ],
                adjustments: []
            },
            {
                id: "b2",
                name: "Bill 2",
                payerId: "B",
                items: [
                    {
                        id: "i2",
                        name: "Item 2",
                        unitPrice: 100000,
                        quantity: 1,
                        assignedParticipantIds: ["B"]
                    }
                ],
                adjustments: []
            }
        ]
    };

    const result = validateSessionFinancials(session);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.bills.length).toBe(2);
    expect(result.summary).toEqual({
        totalPaid: 150000,
        totalResponsibility: 150000,
        totalBalance: 0
    });
});

test("returns invalid if one bill is invalid", () => {
    const session = {
        participants: [
            { id: "A", name: "A" },
            { id: "B", name: "B" }
        ],
        bills: [
            {
                id: "b1",
                name: "Bill 1",
                payerId: "A",
                items: [
                    {
                        id: "i1",
                        name: "Item 1",
                        unitPrice: 50000,
                        quantity: 1,
                        assignedParticipantIds: ["A"]
                    }
                ],
                adjustments: []
            },
            {
                id: "b2",
                name: "Bill 2 (invalid)",
                payerId: "UNKNOWN",
                items: [],
                adjustments: []
            }
        ]
    };

    const result = validateSessionFinancials(session);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "INVALID_BILL",
            billIndex: 1
        })
    );

    expect(result.bills[1].isValid).toBe(false);

    expect(result.summary).toEqual({
        totalPaid: null,
        totalResponsibility: null,
        totalBalance: null
    });
});

test("reconciles participant balances across multiple bills", () => {
    const session = {
        participants: [
            { id: "A", name: "A" },
            { id: "B", name: "B" }
        ],
        bills: [
            {
                id: "b1",
                name: "Bill 1",
                payerId: "A",
                items: [
                    {
                        id: "i1",
                        name: "Item 1",
                        unitPrice: 100000,
                        quantity: 1,
                        assignedParticipantIds: ["A", "B"]
                    }
                ],
                adjustments: []
            }
        ]
    };

    const result =
        validateSessionFinancials(session);

    expect(result.isValid).toBe(true);

    expect(result.summary).toEqual({
        totalPaid: 100000,
        totalResponsibility: 100000,
        totalBalance: 0
    });
});

test("returns unsafe financial total when aggregate bill total exceeds safe integer range", () => {
    const bill = {
        payerId: "A",
        items: [
            {
                unitPrice: 5000000000000000,
                quantity: 1,
                assignedParticipantIds: ["A"]
            },
            {
                unitPrice: 5000000000000000,
                quantity: 1,
                assignedParticipantIds: ["B"]
            }
        ],
        adjustments: []
    };

    expect(() =>
        validateBillFinancials(bill, participants)
    ).not.toThrow();

    const result =
        validateBillFinancials(bill, participants);

    expect(result.isValid).toBe(false);

    expect(result.errors).toContainEqual(
        expect.objectContaining({
            code: "UNSAFE_FINANCIAL_TOTAL"
        })
    );

    expect(
        Number.isSafeInteger(
            result.summary.itemsSubtotal
        )
    ).toBe(false);

    expect(
        Number.isSafeInteger(
            result.summary.finalTotal
        )
    ).toBe(false);
});