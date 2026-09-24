// @vitest-environment jsdom

import {
    beforeEach,
    expect,
    test,
    vi
} from "vitest";

import {
    act,
    renderHook
} from "@testing-library/react";

vi.mock("../utils/sessionStorage", async () => {
    const actual = await vi.importActual(
        "../utils/sessionStorage"
    );

    return {
        ...actual,
        loadCurrentSession: vi.fn(),
        loadSavedSessions: vi.fn(),
        saveCurrentSession: vi.fn(),
        saveSavedSessions: vi.fn()
    };
});

import { useSessionManager } from "./useSessionManager";

import {
    loadCurrentSession,
    loadSavedSessions
} from "../utils/sessionStorage";

const validSession = {
    name: "Test Session",
    participants: [
        { id: "A", name: "A" },
        { id: "B", name: "B" }
    ],
    bills: [
        {
            id: "bill-1",
            name: "Bill 1",
            payerId: "A",
            items: [
                {
                    id: "item-1",
                    name: "Item 1",
                    unitPrice: 100000,
                    quantity: 1,
                    assignedParticipantIds: ["A", "B"]
                }
            ],
            adjustments: []
        }
    ],
    navigation: {
        lastPage: "bills"
    }
};

const invalidSession = {
    ...validSession,
    bills: [
        {
            ...validSession.bills[0],
            payerId: "UNKNOWN"
        }
    ]
};

beforeEach(() => {
    vi.clearAllMocks();

    loadSavedSessions.mockReturnValue([]);
});

test("finalizes and saves a valid session", () => {
    loadCurrentSession.mockReturnValue(validSession);

    const { result } = renderHook(() =>
        useSessionManager()
    );

    let finalization;

    act(() => {
        finalization =
            result.current.finalizeSession();
    });

    expect(finalization.success).toBe(true);
    expect(finalization.sessionId).not.toBeNull();
    expect(finalization.validation.isValid).toBe(true);

    expect(result.current.savedSessions)
        .toHaveLength(1);

    expect(result.current.savedSessions[0])
        .toEqual(
            expect.objectContaining({
                name: "Test Session",
                participants: validSession.participants,
                bills: validSession.bills
            })
        );
});

test("rejects an invalid session without saving it", () => {
    loadCurrentSession.mockReturnValue(
        invalidSession
    );

    const { result } = renderHook(() =>
        useSessionManager()
    );

    let finalization;

    act(() => {
        finalization =
            result.current.finalizeSession();
    });

    expect(finalization.success).toBe(false);
    expect(finalization.sessionId).toBeNull();
    expect(finalization.validation.isValid).toBe(false);

    expect(result.current.savedSessions)
        .toHaveLength(0);

    expect(finalization.validation.errors)
        .toContainEqual(
            expect.objectContaining({
                code: "INVALID_BILL",
                billIndex: 0
            })
        );
});