import {
    describe,
    expect,
    test
} from "vitest";

import {
    calculateParticipantBalances,
    calculateSettlements
} from "./index";

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

describe("calculation engine", () => {
    test("calculates a complete single-bill settlement", () => {
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
                        assignedParticipantIds: [
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: []
            }
        ];

        const balances = calculateParticipantBalances(participants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 150,
                totalResponsibility: 60,
                balance: 90
            },
            {
                id: "B",
                name: "B",
                totalPaid: 0,
                totalResponsibility: 45,
                balance: -45
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 45,
                balance: -45
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "B",
                fromName: "B",
                toId: "A",
                toName: "A",
                amount: 45
            },
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 45
            }
        ]);
    });

    test("calculates multiple bills with different payers", () => {
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
                        assignedParticipantIds: [
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
                        unitPrice: 120,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: []
            }
        ];

        const balances = calculateParticipantBalances(participants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 150,
                totalResponsibility: 100,
                balance: 50
            },
            {
                id: "B",
                name: "B",
                totalPaid: 120,
                totalResponsibility: 85,
                balance: 35
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 85,
                balance: -85
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 50
            },
            {
                fromId: "C",
                fromName: "C",
                toId: "B",
                toName: "B",
                amount: 35
            }
        ]);
    });

    test("allocates a charge proportionally based on participant item subtotals", () => {
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
                        unitPrice: 30,
                        quantity: 1,
                        assignedParticipantIds: ["B"]
                    },
                    {
                        unitPrice: 10,
                        quantity: 1,
                        assignedParticipantIds: ["C"]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 10,
                        allocationType: "proportional"
                    }
                ]
            }
        ];

        const balances = calculateParticipantBalances(participants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 110,
                totalResponsibility: 66,
                balance: 44
            },
            {
                id: "B",
                name: "B",
                totalPaid: 0,
                totalResponsibility: 33,
                balance: -33
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 11,
                balance: -11
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "B",
                fromName: "B",
                toId: "A",
                toName: "A",
                amount: 33
            },
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 11
            }
        ]);
    });

    test("preserves totals when proportional adjustment requires rounding", () => {
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
                        allocationType: "proportional"
                    }
                ]
            }
        ];

        const balances = calculateParticipantBalances(participants, bills);

        expect(balances).toEqual([
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

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
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

    test("applies a proportional discount to participant responsibilities", () => {
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
                        type: "discount",
                        amount: 10,
                        allocationType: "proportional"
                    }
                ]
            }
        ];

        const balances = calculateParticipantBalances(participants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 90,
                totalResponsibility: 30,
                balance: 60
            },
            {
                id: "B",
                name: "B",
                totalPaid: 0,
                totalResponsibility: 30,
                balance: -30
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 30,
                balance: -30
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "B",
                fromName: "B",
                toId: "A",
                toName: "A",
                amount: 30
            },
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 30
            }
        ]);
    });

    test("allocates a charge equally regardless of participant item subtotals", () => {
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
                        unitPrice: 30,
                        quantity: 1,
                        assignedParticipantIds: ["B"]
                    },
                    {
                        unitPrice: 10,
                        quantity: 1,
                        assignedParticipantIds: ["C"]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 10,
                        allocationType: "equal"
                    }
                ]
            }
        ];

        const balances = calculateParticipantBalances(participants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 110,
                totalResponsibility: 64,
                balance: 46
            },
            {
                id: "B",
                name: "B",
                totalPaid: 0,
                totalResponsibility: 33,
                balance: -33
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 13,
                balance: -13
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "B",
                fromName: "B",
                toId: "A",
                toName: "A",
                amount: 33
            },
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 13
            }
        ]);
    });

    test("excludes a participant with zero balance from settlement", () => {
        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 90,
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
                        unitPrice: 30,
                        quantity: 1,
                        assignedParticipantIds: ["A"]
                    }
                ],
                adjustments: []
            }
        ];

        const balances = calculateParticipantBalances(participants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 90,
                totalResponsibility: 60,
                balance: 30
            },
            {
                id: "B",
                name: "B",
                totalPaid: 30,
                totalResponsibility: 30,
                balance: 0
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 30,
                balance: -30
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements.some((settlement) => settlement.fromId === "B" || settlement.toId === "B")).toBe(false);

        expect(settlements).toEqual([
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 30
            }
        ]);
    });

    test("settles multiple creditors and debtors from multiple bills", () => {
        const fourParticipants = [
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
            },
            {
                id: "D",
                name: "D"
            }
        ];

        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 160,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C",
                            "D"
                        ]
                    }
                ],
                adjustments: []
            },
            {
                payerId: "B",
                items: [
                    {
                        unitPrice: 120,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C",
                            "D"
                        ]
                    }
                ],
                adjustments: []
            },
            {
                payerId: "C",
                items: [
                    {
                        unitPrice: 40,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C",
                            "D"
                        ]
                    }
                ],
                adjustments: []
            },
            {
                payerId: "D",
                items: [
                    {
                        unitPrice: 80,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C",
                            "D"
                        ]
                    }
                ],
                adjustments: []
            }
        ];

        const balances = calculateParticipantBalances(fourParticipants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 160,
                totalResponsibility: 100,
                balance: 60
            },
            {
                id: "B",
                name: "B",
                totalPaid: 120,
                totalResponsibility: 100,
                balance: 20
            },
            {
                id: "C",
                name: "C",
                totalPaid: 40,
                totalResponsibility: 100,
                balance: -60
            },
            {
                id: "D",
                name: "D",
                totalPaid: 80,
                totalResponsibility: 100,
                balance: -20
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
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
                toId: "B",
                toName: "B",
                amount: 20
            }
        ]);
    });

    test("produces a minimal practical settlement for multiple creditors and debtors", () => {
        const fourParticipants = [
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
            },
            {
                id: "D",
                name: "D"
            }
        ];

        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: ["A"]
                    },
                    {
                        unitPrice: 70,
                        quantity: 1,
                        assignedParticipantIds: ["B"]
                    }
                ],
                adjustments: []
            },
            {
                payerId: "B",
                items: [
                    {
                        unitPrice: 30,
                        quantity: 1,
                        assignedParticipantIds: ["B"]
                    },
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: ["C"]
                    }
                ],
                adjustments: []
            },
            {
                payerId: "C",
                items: [
                    {
                        unitPrice: 40,
                        quantity: 1,
                        assignedParticipantIds: ["D"]
                    }
                ],
                adjustments: []
            },
            {
                payerId: "D",
                items: [
                    {
                        unitPrice: 60,
                        quantity: 1,
                        assignedParticipantIds: ["D"]
                    }
                ],
                adjustments: []
            }
        ];

        const balances = calculateParticipantBalances(fourParticipants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 170,
                totalResponsibility: 100,
                balance: 70
            },
            {
                id: "B",
                name: "B",
                totalPaid: 130,
                totalResponsibility: 100,
                balance: 30
            },
            {
                id: "C",
                name: "C",
                totalPaid: 40,
                totalResponsibility: 100,
                balance: -60
            },
            {
                id: "D",
                name: "D",
                totalPaid: 60,
                totalResponsibility: 100,
                balance: -40
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
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

        expect(settlements).toHaveLength(3);
    });

    test("handles tax, service, and custom charges in the same bill", () => {
        const twoParticipants = [
            {
                id: "A",
                name: "A"
            },
            {
                id: "B",
                name: "B"
            }
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
                        unitPrice: 40,
                        quantity: 1,
                        assignedParticipantIds: ["B"]
                    }
                ],
                adjustments: [
                    {
                        name: "Tax",
                        type: "charge",
                        amount: 10,
                        allocationType: "proportional"
                    },
                    {
                        name: "Service",
                        type: "charge",
                        amount: 5,
                        allocationType: "proportional"
                    },
                    {
                        name: "Parking",
                        type: "charge",
                        amount: 15,
                        allocationType: "proportional"
                    }
                ]
            }
        ];

        const balances = calculateParticipantBalances(twoParticipants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 130,
                totalResponsibility: 78,
                balance: 52
            },
            {
                id: "B",
                name: "B",
                totalPaid: 0,
                totalResponsibility: 52,
                balance: -52
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "B",
                fromName: "B",
                toId: "A",
                toName: "A",
                amount: 52
            }
        ]);
    });

    test("handles large monetary values without losing integer precision", () => {
        const bills = [
            {
                payerId: "A",
                items: [
                    {
                        unitPrice: 3_000_000_000,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B",
                            "C"
                        ]
                    }
                ],
                adjustments: []
            }
        ];

        const balances = calculateParticipantBalances(participants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 3_000_000_000,
                totalResponsibility: 1_000_000_000,
                balance: 2_000_000_000
            },
            {
                id: "B",
                name: "B",
                totalPaid: 0,
                totalResponsibility: 1_000_000_000,
                balance: -1_000_000_000
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 1_000_000_000,
                balance: -1_000_000_000
            }
        ]);

        balances.forEach((participant) => {
            expect(Number.isSafeInteger(participant.totalPaid)).toBe(true);
            expect(Number.isSafeInteger(participant.totalResponsibility)).toBe(true);
            expect(Number.isSafeInteger(participant.balance)).toBe(true);
        });

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "B",
                fromName: "B",
                toId: "A",
                toName: "A",
                amount: 1_000_000_000
            },
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 1_000_000_000
            }
        ]);

        settlements.forEach((settlement) => {
            expect(Number.isSafeInteger(settlement.amount)).toBe(true);
        });
    });

    test("preserves financial consistency across a complex mixed session", () => {
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
                    },
                    {
                        unitPrice: 60,
                        quantity: 1,
                        assignedParticipantIds: ["A"]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 11,
                        allocationType: "proportional"
                    },
                    {
                        type: "discount",
                        amount: 5,
                        allocationType: "equal"
                    }
                ]
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
                    },
                    {
                        unitPrice: 40,
                        quantity: 1,
                        assignedParticipantIds: ["C"]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 7,
                        allocationType: "equal"
                    },
                    {
                        type: "discount",
                        amount: 9,
                        allocationType: "proportional"
                    }
                ]
            }
        ];

        const balances =
            calculateParticipantBalances(
                participants,
                bills
            );

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 166,
                totalResponsibility: 102,
                balance: 64
            },
            {
                id: "B",
                name: "B",
                totalPaid: 128,
                totalResponsibility: 77,
                balance: 51
            },
            {
                id: "C",
                name: "C",
                totalPaid: 0,
                totalResponsibility: 115,
                balance: -115
            }
        ]);

        const totalBalance = balances.reduce((sum, participant) => sum + participant.balance, 0);
        const totalPaid = balances.reduce((sum, participant) => sum + participant.totalPaid, 0);
        const totalResponsibility = balances.reduce((sum, participant) => sum + participant.totalResponsibility, 0);

        expect(totalBalance).toBe(0);
        expect(totalPaid).toBe(totalResponsibility);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "C",
                fromName: "C",
                toId: "A",
                toName: "A",
                amount: 64
            },
            {
                fromId: "C",
                fromName: "C",
                toId: "B",
                toName: "B",
                amount: 51
            }
        ]);
    });

    test("ignores zero-value adjustments without changing financial results", () => {
        const twoParticipants = [
            {
                id: "A",
                name: "A"
            },
            {
                id: "B",
                name: "B"
            }
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
                        unitPrice: 40,
                        quantity: 1,
                        assignedParticipantIds: ["B"]
                    }
                ],
                adjustments: [
                    {
                        type: "charge",
                        amount: 0,
                        allocationType: "proportional"
                    },
                    {
                        type: "charge",
                        amount: 0,
                        allocationType: "equal"
                    },
                    {
                        type: "discount",
                        amount: 0,
                        allocationType: "proportional"
                    }
                ]
            }
        ];

        const balances = calculateParticipantBalances(twoParticipants, bills);

        expect(balances).toEqual([
            {
                id: "A",
                name: "A",
                totalPaid: 100,
                totalResponsibility: 60,
                balance: 40
            },
            {
                id: "B",
                name: "B",
                totalPaid: 0,
                totalResponsibility: 40,
                balance: -40
            }
        ]);

        const settlements = calculateSettlements(balances);

        expect(settlements).toEqual([
            {
                fromId: "B",
                fromName: "B",
                toId: "A",
                toName: "A",
                amount: 40
            }
        ]);
    });
});