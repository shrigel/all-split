import { useCallback, useEffect, useState } from "react";
import { getParticipantUsage } from "../utils/sessionRules";
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

    const discardSession = useCallback(() => {
        setCurrentSession(INITIAL_SESSION);
    }, []);

    const updateLastVisitedPage = useCallback((page) => {
        if (page !== 'participants' && page !== 'bills') {
            return;
        }

        setCurrentSession((prev) => {
            if (prev.navigation?.lastPage === page) {
                return prev;
            }

            return {
                ...prev,
                navigation: {
                    ...prev.navigation,
                    lastPage: page
                }
            };
        });
    }, []);

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
        setCurrentSession((prev) => {
            const usage = getParticipantUsage(prev, id);

            if (usage.isUsed) {
                return prev;
            }

            return {
                ...prev,
                participants: prev.participants.filter((p) => p.id !== id)
            };
        });
    };

    const checkParticipantUsage = (participantId) => {
        return getParticipantUsage(
            currentSession,
            participantId
        );
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

    const finalizeSession = () => {
        const now = Date.now();
        const sessionId = `session-${now}`;

        const sessionToSave = {
            name: currentSession.name,
            participants: currentSession.participants,
            bills: currentSession.bills,
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
        updateLastVisitedPage,
        addParticipant,
        removeParticipant,
        checkParticipantUsage,
        saveBill,
        deleteBill,
        finalizeSession,
    };
}