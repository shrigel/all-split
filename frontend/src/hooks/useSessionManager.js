import { useCallback, useEffect, useState } from "react";
import { getParticipantUsage } from "../utils/sessionRules";
import {
    INITIAL_SESSION,
    loadCurrentSession,
    saveCurrentSession,
    loadSavedSessions,
    saveSavedSessions
} from "../utils/sessionStorage";
import { validateSessionFinancials } from "../domain/calculation";
import {
    createSplit,
    deleteSplit,
    getSplit
} from "../api/splits";
import {
    getSplitReference,
    removeSplitReference,
    upsertSplitReference
} from "../utils/splitReferences";
import {
    createParticipant,
    deleteParticipant
} from "../api/participants";

const ACTIVE_SPLIT_KEY = 'allsplit_active_split_id';

export function useSessionManager() {
    const [currentSession, setCurrentSession] = useState(() => {
        const activeId = localStorage.getItem(ACTIVE_SPLIT_KEY);
        if (activeId) {
            const ref = getSplitReference(activeId);
            if (ref) {
                // Tampilkan metadata awal langsung agar hasActiveSession bernilai true
                return {
                    id: ref.splitId,
                    name: ref.name,
                    accessToken: ref.accessToken,
                    participants: [],
                    bills: [],
                    navigation: { lastPage: 'participants' }
                };
            }
        }
        return {
            id: null,
            name: '',
            accessToken: null,
            participants: [],
            bills: [],
            navigation: { lastPage: 'participants' }
        };
    });
    const [savedSessions, setSavedSessions] = useState(() => loadSavedSessions());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        saveCurrentSession(currentSession);
    }, [currentSession]);

    useEffect(() => {
        saveSavedSessions(savedSessions);
    }, [savedSessions]);

    const startSession = async (name) => {
        // setCurrentSession({
        //     ...INITIAL_SESSION,
        //     name
        // });
        setIsLoading(true);
        setError(null);

        try {
            const result = await createSplit(name);

            const { split, accessToken } = result;

            upsertSplitReference({
                splitId: split.id,
                accessToken,
                name: split.name,
                expiresAt: split.expiresAt
            });

            setCurrentSession({
                id: split.id,
                name: split.name,
                accessToken,
                participants: [],
                bills: [],
                navigation: { lastPage: 'participants' }
            });

            localStorage.setItem(ACTIVE_SPLIT_KEY, split.id);

            return split;
        } catch (error) {
            setError(error.message || "Gagal membuat sesi split");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loadSession = useCallback(async (splitId) => {
        const ref = getSplitReference(splitId);

        if (!ref) {
            setError('Referensi sesi tidak ditemukan di perangkat ini.');
            return;
        }

        setIsLoading(true)
        setError(null);

        try {
            const splitData = await getSplit(ref.splitId, ref.accessToken);

            setCurrentSession({
                ...splitData,
                accessToken: ref.accessToken,
                navigation: { lastPage: ref.lastPage ?? 'participants' }
            });
        } catch (err) {
            if (err.status === 401 || err.status === 404) {
                removeSplitReference(ref.splitId);
                localStorage.removeItem(ACTIVE_SPLIT_KEY);
                resetCurrentSession();
                setError('Sesi telah kedaluwarsa atau tidak ditemukan di server.');
            } else {
                setError(err.message || 'Gagal memuat sesi dari server.');
            }

            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const activeId = localStorage.getItem(ACTIVE_SPLIT_KEY);
        if (activeId) {
            loadSession(activeId);
        }
    }, [loadSession]);

    const resetCurrentSession = useCallback(() => {
        localStorage.removeItem(ACTIVE_SPLIT_KEY);
        setCurrentSession({
            id: null,
            name: '',
            accessToken: null,
            participants: [],
            bills: [],
            navigation: { lastPage: 'participants' }
        });
    }, []);

    const discardSession = useCallback(async (splitId) => {
        // setCurrentSession(INITIAL_SESSION);

        const targetId = splitId || currentSession.id;
        const ref = getSplitReference(targetId);

        if (!ref) {
            setError('Referensi sesi tidak ditemukan di perangkat ini.');
            return;
        }

        setIsLoading(true)
        setError(null);

        try {
            await deleteSplit(ref.splitId, ref.accessToken);

            removeSplitReference(ref.splitId);

            resetCurrentSession()
        } catch (err) {
            if (err.status === 401 || err.status === 404) {
                removeSplitReference(ref.splitId);
                setError('Sesi telah kedaluwarsa atau tidak ditemukan di server.');
            } else {
                setError(err.message || 'Gagal memuat sesi dari server.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentSession.id, resetCurrentSession]);

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
        isLoading,
        error,
        savedSessions, // TODO: Nanti perlu dibikin reactive dengan subscription ke API / Dihapus
        startSession,
        loadSession,
        resetCurrentSession,
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