import { useState } from "react";
import { capitalizeWords, sanitizeAlphanumeric } from "../../utils/formatter";
import ConfirmationModal from "../../components/ConfirmationModal";
import ActiveSessionCard from "./components/ActiveSessionCard";
import NewSessionForm from "./components/NewSessionForm";
import SavedSessionList from "./components/SavedSessionList";

export default function Home({
    onStartSession,
    currentSession,
    savedSessions,
    onOpenSession,
    onResumeSession,
    onDiscardSession
}) {
    const [sessionName, setSessionName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
    const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
    const hasActiveSession = Boolean(currentSession?.name?.trim());

    const startSession = () => {
        onStartSession(capitalizeWords(sessionName.trim()));
        setErrorMessage('');
    };

    const handleConfirmNewSession = () => {
        setIsNewSessionModalOpen(false);
        startSession();
    };

    const handleConfirmDiscard = () => {
        onDiscardSession();
        setIsDiscardModalOpen(false);
    };

    const handleSessionNameChange = (e) => {
        setSessionName(sanitizeAlphanumeric(e.target.value));
        if (errorMessage) setErrorMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!sessionName.trim()) {
            setErrorMessage('Nama patungan tidak boleh kosong');
            return;
        }

        if (hasActiveSession) {
            setIsNewSessionModalOpen(true);
            return;
        }

        startSession();
    }

    return (
        <>
            <main className="flex-1 flex flex-col w-full max-w-app mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight mb-1">
                        Mulai Patungan
                    </h1>

                    <p className="text-sm text-on-surface-variant">
                        Bagi tagihan dan pengeluaran bareng teman dengan mudah tanpa repot.
                    </p>
                </div>

                {hasActiveSession && (
                    <ActiveSessionCard
                        session={currentSession}
                        onResume={onResumeSession}
                        onDiscard={() => setIsDiscardModalOpen(true)}
                    />
                )}


                <NewSessionForm
                    sessionName={sessionName}
                    onSessionNameChange={handleSessionNameChange}
                    errorMessage={errorMessage}
                    onSubmit={handleSubmit}
                />

                <SavedSessionList
                    savedSessions={savedSessions}
                    onOpenSession={onOpenSession}
                />

            </main>

            <ConfirmationModal
                btnLabel="Hapus"
                isOpen={isDiscardModalOpen}
                onClose={() => setIsDiscardModalOpen(false)}
                onConfirm={handleConfirmDiscard}
                confirmationMessage="Apakah Anda yakin ingin menghapus sesi ini?"
            />

            <ConfirmationModal
                btnLabel="Mulai Sesi Baru"
                isOpen={isNewSessionModalOpen}
                onClose={() => setIsNewSessionModalOpen(false)}
                onConfirm={handleConfirmNewSession}
                confirmationMessage={`Sesi "${currentSession?.name}" masih berjalan. Memulai sesi baru akan menghapus sesi tersebut. Apakah Anda yakin ingin melanjutkan?`}
            />
        </>
    )
}