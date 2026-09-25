import { useCallback, useEffect, useState } from "react";
import { getParticipantUsage } from "../utils/sessionRules";
import {
    INITIAL_SESSION,
    loadSavedSessions,
    saveSavedSessions
} from "../utils/sessionStorage";
import {
    getActiveSession,
    saveActiveSession,
    deleteActiveSession,
    getCompletedSessions,
    saveCompletedSession
} from "../storage/sessionRepository";
import { validateSessionFinancials } from "../domain/calculation";

export function useSessionManager() {
    const [currentSession, setCurrentSession] = useState(INITIAL_SESSION);
    const [savedSessions, setSavedSessions] = useState([]);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const hydrateActiveSession = async () => {
            try {
                const [
                    storedActiveSession,
                    storedCompletedSessions
                ] = await Promise.all([
                    getActiveSession(),
                    getCompletedSessions()
                ]);

                if (cancelled) return;

                setCurrentSession(storedSession ?? INITIAL_SESSION);
                setSavedSessions(storedCompletedSessions);
            } catch (error) {
                console.error("Gagal memuat active session dari IndexedDB:", error);
            } finally {
                if (!cancelled) setIsHydrated(true);
            }
        };

        hydrateActiveSession();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        const persistActiveSession = async () => {
            try {
                if (!currentSession.name.trim()) {
                    await deleteActiveSession();
                    return;
                }

                await saveActiveSession(currentSession);
            } catch (error) {
                console.error("Gagal menyimpan active session ke IndexedDB:", error);
            }
        };

        persistActiveSession();
    }, [currentSession, isHydrated]);

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
        const validation = validateSessionFinancials(currentSession);

        if (!validation.isValid) {
            return {
                success: false,
                sessionId: null,
                validation
            };
        }

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

        return {
            success: true,
            sessionId,
            validation
        };
    };

    return {
        currentSession,
        savedSessions,
        isHydrated,
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