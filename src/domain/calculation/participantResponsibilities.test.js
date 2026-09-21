import {
    describe,
    expect,
    test
} from "vitest";

import {
    calculateParticipantResponsibilities
} from "./participantResponsibilities";

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

describe("calculateParticipantResponsibilities", () => {
    test("calculates responsibilities from item shares", () => {
        const bills = [
            {
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
            }
        ];

        expect(
            calculateParticipantResponsibilities(
                participants,
                bills
            )
        ).toEqual([
            {
                id: "A",
                name: "A",
                totalResponsibility: 34
            },
            {
                id: "B",
                name: "B",
                totalResponsibility: 33
            },
            {
                id: "C",
                name: "C",
                totalResponsibility: 33
            }
        ]);
    });

    test("includes deterministic adjustment shares", () => {
        const bills = [
            {
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
            calculateParticipantResponsibilities(
                participants,
                bills
            )
        ).toEqual([
            {
                id: "A",
                name: "A",
                totalResponsibility: 38
            },
            {
                id: "B",
                name: "B",
                totalResponsibility: 36
            },
            {
                id: "C",
                name: "C",
                totalResponsibility: 36
            }
        ]);
    });

    test("accumulates responsibilities across multiple bills", () => {
        const bills = [
            {
                items: [
                    {
                        unitPrice: 100,
                        quantity: 1,
                        assignedParticipantIds: [
                            "A",
                            "B"
                        ]
                    }
                ],
                adjustments: []
            },
            {
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
            calculateParticipantResponsibilities(
                participants,
                bills
            )
        ).toEqual([
            {
                id: "A",
                name: "A",
                totalResponsibility: 50
            },
            {
                id: "B",
                name: "B",
                totalResponsibility: 95
            },
            {
                id: "C",
                name: "C",
                totalResponsibility: 45
            }
        ]);
    });

    test(
        "keeps total responsibility equal to the bill total",
        () => {
            const bills = [
                {
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
                calculateParticipantResponsibilities(
                    participants,
                    bills
                );

            const totalResponsibility =
                result.reduce(
                    (sum, participant) =>
                        sum +
                        participant.totalResponsibility,
                    0
                );

            expect(totalResponsibility).toBe(110);
        }
    );

    test("handles discounts without rounding loss", () => {
        const bills = [
            {
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
                        allocationType:
                            "proportional"
                    }
                ]
            }
        ];

        expect(
            calculateParticipantResponsibilities(
                participants,
                bills
            )
        ).toEqual([
            {
                id: "A",
                name: "A",
                totalResponsibility: 30
            },
            {
                id: "B",
                name: "B",
                totalResponsibility: 30
            },
            {
                id: "C",
                name: "C",
                totalResponsibility: 30
            }
        ]);
    });
});