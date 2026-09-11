import { useState } from "react";
import { capitalizeWords, sanitizeAlphanumeric } from "../../utils/formatter";
import ConfirmationModal from "../../components/ConfirmationModal";
import ActiveSessionCard from "./components/ActiveSessionCard";
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

    const handleSessionNameChange = (e) => {
        setSessionName(sanitizeAlphanumeric(e.target.value));
        if (errorMessage) setErrorMessage('');
    };

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


                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="session-name" className="text-xs text-on-surface font-semibold uppercase tracking-wider">
                            Nama Patungan
                        </label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                                edit_note
                            </span>
                            <input
                                type="text"
                                name="sessionName"
                                id="session-name"
                                placeholder="cth. Makan Bareng atau Liburan Bali"
                                autoComplete="off"
                                value={sessionName}
                                onChange={handleSessionNameChange}
                                className={`w-full h-11 pl-11 pr-3 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-400 outline-none transition-all ${errorMessage
                                    ? 'border border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                                    : 'border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary'
                                    }`}
                            />
                        </div>
                        {errorMessage && (
                            <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors active:scale-[0.99]">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span>Mulai Hitung Tagihan</span>
                    </button>
                </form>

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