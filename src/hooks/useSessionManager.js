import { useEffect, useState } from "react";
import {
    INITIAL_SESSION,
    loadCurrentSession,
    saveCurrentSession,
    loadSavedSessions,
    saveSavedSessions
} from "../utils/sessionStorage";

export function useSessionManager() {
    const [currentSession, setCurrentSession] = useState(() => loadCurrentSession());
    const [savedSessions, setSavedSessions] = useState(() => loadSavedSessions());

    useEffect(() => {
        saveCurrentSession(currentSession);
    }, [currentSession]);

    useEffect(() => {
        saveSavedSessions(savedSessions);
    }, [savedSessions]);

    const startSession = (name) => {
        setCurrentSession({
            ...INITIAL_SESSION,
            name
        });
    };

    const discardSession = () => {
        setCurrentSession(INITIAL_SESSION);
    };

    const addParticipant = (name) => {
        const newParticipant = {
            id: 'p-' + Date.now(),
            name
        };

        setCurrentSession((prev) => ({
            ...prev,
            participants: [
                ...prev.participants,
                newParticipant
            ],
        }));
    };

    const removeParticipant = (id) => {
        setCurrentSession((prev) => ({
            ...prev,
            participants: prev.participants.filter(
                (p) => p.id !== id
            )
        }));
    };

    const saveBill = (bill) => {
        setCurrentSession((prev) => {
            const existingIndex = prev.bills.findIndex(
                (b) => b.id === bill.id
            );

            if (existingIndex >= 0) {
                const updatedBills = [...prev.bills];

                updatedBills[existingIndex] = bill;

                return {
                    ...prev,
                    bills: updatedBills
                };
            }

            return {
                ...prev,
                bills: [
                    ...prev.bills,
                    bill
                ]
            };
        });
    };

    const deleteBill = (billId) => {
        setCurrentSession((prev) => ({
            ...prev,
            bills: prev.bills.filter(
                (b) => b.id !== billId
            )
        }));
    };

    const clearBills = () => {
        setCurrentSession((prev) => ({
            ...prev,
            bills: []
        }));
    };

    const finalizeSession = () => {
        const now = Date.now();
        const sessionId = `session-${now}`;

        const sessionToSave = {
            ...currentSession,
            id: sessionId,
            createdAt: now,
            expiresAt: now + (7 * 24 * 60 * 60 * 1000)
        };

        setSavedSessions((prev) => [
            sessionToSave,
            ...prev
        ]);

        return sessionId;
    };

    return {
        currentSession,
        savedSessions,
        startSession,
        discardSession,
        addParticipant,
        removeParticipant,
        saveBill,
        deleteBill,
        clearBills,
        finalizeSession,
    };
}