import {
    describe,
    expect,
    test
} from "vitest";

import {
    calculateParticipantBalances
} from "./participantBalances";

const participants = [
    {
        id: "A",
        name: "A"
    },
    {
        id: "B",
        name: "B"
    },
    {
        id: "C",
        name: "C"
    }
];

test(
    "calculates paid, responsibility, and balance",
    () => {
        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 10,
                        allocationType:
                            "proportional"
                    }
                ]
            }
        ];

        expect(
            calculateParticipantBalances(
                participants,
                bills
            )
        ).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 110,
                totalResponsibility: 38,
                balance: 72
            },
            {
                id: "B",
                name: "B",
                totalPaid: 0,
                totalResponsibility: 36,
                balance: -36
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 36,
                balance: -36
            }
        ]);
    }
);

test(
    "accumulates payments and responsibilities across different payers",
    () => {
        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: []
            },
            {
                payerId: "B",
                items: [
                    {
                        unitPrice: 90,
                        quantity: 1,
                        assignedParticipantIds: [
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: []
            }
        ];

        expect(
            calculateParticipantBalances(
                participants,
                bills
            )
        ).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 100,
                totalResponsibility: 34,
                balance: 66
            },
            {
                id: "B",
                name: "B",
                totalPaid: 90,
                totalResponsibility: 78,
                balance: 12
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 78,
                balance: -78
            }
        ]);
    }
);

test(
    "keeps the sum of all participant balances equal to zero",
    () => {
        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 10,
                        allocationType:
                            "proportional"
                    }
                ]
            }
        ];

        const result =
            calculateParticipantBalances(
                participants,
                bills
            );

        const totalBalance = result.reduce(
            (sum, participant) =>
                sum + participant.balance,
            0
        );

        expect(totalBalance).toBe(0);
    }
);

test(
    "keeps creditor and debtor totals equal",
    () => {
        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 10,
                        allocationType:
                            "proportional"
                    }
                ]
            }
        ];

        const result =
            calculateParticipantBalances(
                participants,
                bills
            );

        const positiveTotal = result
            .filter(
                (participant) =>
                    participant.balance > 0
            )
            .reduce(
                (sum, participant) =>
                    sum + participant.balance,
                0
            );

        const negativeTotal = result
            .filter(
                (participant) =>
                    participant.balance < 0
            )
            .reduce(
                (sum, participant) =>
                    sum +
                    Math.abs(
                        participant.balance
                    ),
                0
            );

        expect(positiveTotal)
            .toBe(negativeTotal);
    }
);

test(
    "returns only integer monetary values",
    () => {
        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 10,
                        allocationType:
                            "proportional"
                    }
                ]
            }
        ];

        const result =
            calculateParticipantBalances(
                participants,
                bills
            );

        result.forEach((participant) => {
            expect(
                Number.isInteger(
                    participant.totalPaid
                )
            ).toBe(true);

            expect(
                Number.isInteger(
                    participant.totalResponsibility
                )
            ).toBe(true);

            expect(
                Number.isInteger(
                    participant.balance
                )
            ).toBe(true);
        });
    }
);

test(
    "returns zero balance when paid amount equals responsibility",
    () => {
        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A"
                        ]
                    }
                ],
                adjustments: []
            }
        ];

        const result =
            calculateParticipantBalances(
                participants,
                bills
            );

        expect(result[0]).toEqual({
            id: "A",
            name: "A",
            totalPaid: 100,
            totalResponsibility: 100,
            balance: 0
        });
    }
);