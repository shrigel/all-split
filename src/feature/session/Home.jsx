import { useState } from "react";
import { capitalizeWords, formatIDR, formatRelativeTime } from "../../utils/formatter";
import { calculateSessionTotal } from "../../utils/calculations";
import ConfirmationModal from "../../components/ConfirmationModal";

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

    const handleConfirmNewSession = () => {
        setIsNewSessionModalOpen(false);
        onStartSession(capitalizeWords(sessionName.trim()));
        setErrorMessage('');
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

        onStartSession(capitalizeWords(sessionName.trim()));
        setErrorMessage('');
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
                    <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                Sesi sedang berjalan
                            </span>

                            <button
                                type="button"
                                onClick={() => setIsDiscardModalOpen(true)}
                                title="Hapus sesi ini"
                                className="flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    delete
                                </span>
                            </button>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {currentSession.name}
                            </h2>

                            <span className="text-xs text-slate-500">
                                {currentSession.participants.length} Peserta • {currentSession.bills.length} Tagihan
                                {currentSession.bills.length > 0 && ` • ${formatIDR(calculateSessionTotal(currentSession.bills))}`}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={onResumeSession}
                            className="flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all active:scale-[0.99] shadow-xs cursor-pointer"
                        >
                            <span>Lanjutkan Sesi Ini</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>
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
                                onChange={(e) => {
                                    const onlyLetters = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                                    setSessionName(onlyLetters);
                                    if (errorMessage) setErrorMessage('');
                                }}
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

                <section className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px] text-primary">
                                history
                            </span>

                            <h2 className="text-sm text-on-surface font-semibold">
                                Riwayat Patungan
                            </h2>
                        </div>

                        <span className="text-xs text-on-surface-variant">
                            {savedSessions.length} patungan
                        </span>
                    </div>

                    {savedSessions.length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-outline-variant/60 rounded-xl">
                            <p className="text-xs text-on-surface-variant">
                                Belum ada riwayat patungan
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {savedSessions.map((session) => {
                                const sessionTotal = formatIDR(calculateSessionTotal(session.bills));

                                return (
                                    <div key={session.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-outline-variant/40">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-bold">
                                                {session.name}
                                            </span>

                                            <span className="text-xs text-slate-500">
                                                {session.participants.length} Peserta • <span className="font-semibold">{sessionTotal}</span>
                                            </span>

                                            <span className="text-xs text-slate-500">
                                                {formatRelativeTime(session.createdAt || session.id)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => onOpenSession(session.id)}
                                            className="flex items-center gap-2 p-2"
                                        >
                                            <span className="text-xs text-primary font-medium">
                                                Lihat Detail
                                            </span>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </main>

            <ConfirmationModal
                btnLabel="Hapus"
                isOpen={isDiscardModalOpen}
                onClose={() => setIsDiscardModalOpen(false)}
                onConfirm={() => {
                    onDiscardSession();
                    setIsDiscardModalOpen(false);
                }}
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