import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    INITIAL_SESSION,
    loadCurrentSession,
    saveCurrentSession,
    loadSavedSessions,
    saveSavedSessions
} from "../utils/sessionStorage";

export function useSessionManager() {
    const navigate = useNavigate();

    const [currentSession, setCurrentSession] = useState(() => loadCurrentSession());
    const [savedSessions, setSavedSessions] = useState(() => loadSavedSessions());

    useEffect(() => {
        saveCurrentSession(currentSession);
    }, [currentSession]);

    useEffect(() => {
        saveSavedSessions(savedSessions);
    }, [savedSessions]);

    const handleStartSession = (name) => {
        setCurrentSession({ ...INITIAL_SESSION, name });

        navigate('/participants');
    };

    const handleResumeSession = () => {
        if (currentSession.participants.length >= 2) {
            navigate('/bills');
        } else {
            navigate('/participants');
        }
    };

    const handleDiscardSession = () => {
        setCurrentSession(INITIAL_SESSION);
    };

    const handleAddParticipants = (name) => {
        const newParticipant = {
            id: 'p-' + Date.now(),
            name
        };

        setCurrentSession((prev) => ({
            ...prev,
            participants: [...prev.participants, newParticipant],
        }));
    };

    const handleRemoveParticipant = (id) => {
        setCurrentSession((prev) => ({
            ...prev,
            participants: prev.participants.filter((p) => p.id !== id)
        }));
    };

    const handleSaveBill = (bill) => {
        setCurrentSession((prev) => {
            const existingIndex = prev.bills.findIndex((b) => b.id === bill.id);

            if (existingIndex >= 0) {
                const updated = [...prev.bills];
                updated[existingIndex] = bill;

                return { ...prev, bills: updated };
            } else {
                return { ...prev, bills: [...prev.bills, bill] };
            }
        });

        navigate('/bills');
    };

    const handleDeleteBill = (billId) => {
        setCurrentSession((prev) => ({
            ...prev,
            bills: prev.bills.filter((b) => b.id !== billId)
        }));
    };

    const handleClearBillsAndBack = () => {
        setCurrentSession((prev) => ({ ...prev, bills: [] }));
        navigate('/participants');
    };

    const handleCalculateSession = () => {
        const sessionId = 'session-' + Date.now();
        const sessionToSave = {
            ...currentSession,
            id: sessionId,
            createdAt: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };

        setSavedSessions((prev) => [sessionToSave, ...prev]);

        navigate(`/result/${sessionId}`);
    };

    const handleOpenSession = (sessionId) => {
        const session = savedSessions.find((s) => s.id === sessionId);

        if (session) {
            navigate(`/result/${sessionId}`);
        }
    };

    return {
        navigate,
        currentSession,
        savedSessions,
        setCurrentSession,
        handleStartSession,
        handleResumeSession,
        handleDiscardSession,
        handleAddParticipants,
        handleRemoveParticipant,
        handleSaveBill,
        handleDeleteBill,
        handleClearBillsAndBack,
        handleCalculateSession,
        handleOpenSession,
    };
}