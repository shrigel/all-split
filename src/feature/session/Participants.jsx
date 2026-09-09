import { useState, useEffect } from "react";
import { capitalizeWords } from "../../utils/formatter";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function Participants({
    sessionName,
    participants,
    onAddParticipant,
    onRemoveParticipant,
    onDirtyChange,
    onNext,
    onBack,
}) {
    const [errorMessage, setErrorMessage] = useState('');
    const [participantName, setParticipantName] = useState('');
    const [isBackModalOpen, setIsBackModalOpen] = useState(false);
    const isReady = participants.length >= 2;
    const hasUnsavedData = participants.length > 0 || participantName.trim() !== '';

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedData) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [participants, participantName]);

    useEffect(() => {
        if (onDirtyChange) {
            onDirtyChange(participantName.trim() !== '');
        }

        return () => {
            if (onDirtyChange) onDirtyChange(false);
        };
    }, [participantName, onDirtyChange]);

    const addParticipant = (e) => {
        e.preventDefault();

        const trimmed = participantName.trim();

        if (!trimmed) {
            setErrorMessage('Nama peserta tidak boleh kosong');
            return;
        };

        const isDuplicate = participants.some(
            (p) => p.name.toLowerCase() === trimmed.toLowerCase()
        );

        if (isDuplicate) {
            setErrorMessage('Nama peserta ini sudah terdaftar');
            return;
        }

        const formatted = capitalizeWords(trimmed);
        onAddParticipant(formatted);
        setParticipantName('');
        setErrorMessage('');
    };

    const AVATAR_PALETTES = [
        { bg: 'bg-[#5B8FB9]/15', text: 'text-[#5B8FB9]' },
        { bg: 'bg-emerald-100', text: 'text-emerald-700' },
        { bg: 'bg-amber-100', text: 'text-amber-700' },
        { bg: 'bg-purple-100', text: 'text-purple-700' },
        { bg: 'bg-rose-100', text: 'text-rose-700' },
        { bg: 'bg-indigo-100', text: 'text-indigo-700' }
    ];

    return (
        <>
            <main className="flex-1 flex flex-col gap-6 w-full max-w-app mx-auto px-4 py-6">
                <div>
                    <button
                        type="button"
                        onClick={() => { hasUnsavedData ? setIsBackModalOpen(true) : onBack() }}
                        className="flex items-center gap-2 text-primary bg-surface-container/75 px-2 py-1 rounded-full border border-outline-variant/40 hover:bg-surface-container-high transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            arrow_back
                        </span>

                        <span className="text-sm">
                            Kembali
                        </span>
                    </button>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-primary tracking-wider uppercase">Sesi Patungan</span>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{sessionName}</h1>
                </div>

                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                        <label htmlFor="participant-name" className="text-sm font-semibold">
                            Tambah Peserta
                        </label>

                        <span className="text-xs text-slate-400">
                            Tekan Enter atau klik Tambah
                        </span>
                    </div>

                    <form onSubmit={addParticipant} className="flex gap-2 items-center">
                        <div className="relative flex-1 flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-[20px] text-slate-400">
                                person_add
                            </span>
                            <input
                                type="text"
                                name="participantName"
                                id="participant-name"
                                placeholder="Tulis nama yang patungan..."
                                autoComplete="off"
                                value={participantName}
                                onChange={(e) => {
                                    const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                    setParticipantName(onlyLetters);
                                    if (errorMessage) setErrorMessage('');
                                }}
                                className={`w-full h-11 pl-11 pr-3 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-400 outline-none transition-all ${errorMessage
                                    ? 'border border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                                    : 'border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary'
                                    }`}
                            />
                        </div>

                        <button type="submit" className="h-11 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors shrink-0">
                            <span className="material-symbols-outlined">add</span>
                            <span>Tambah</span>
                        </button>
                    </form>

                    {errorMessage && (
                        <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1">
                            <span className="material-symbols-outlined text-[16px]">error</span>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                </div>

                <section className="flex flex-col">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-300">
                        <span className="text-sm font-semibold text-slate-800">Peserta Terdaftar</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">{participants.length}</span>
                    </div>

                    {participants.length > 0 && (
                        <div className="flex flex-col divide-y divide-slate-200">
                            {participants.map((participant, index) => {
                                const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

                                return (
                                    <div key={participant.id} className="flex justify-between items-center py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full ${palette.bg} ${palette.text} text-sm flex items-center justify-center font-bold shrink-0`}>
                                                {participant.name.charAt(0).toUpperCase()}
                                            </div>

                                            <span className="text-sm font-medium text-slate-800 truncate">
                                                {participant.name}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => onRemoveParticipant(participant.id)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-3 text-slate-400">
                        <span className="material-symbols-outlined text-[16px]">
                            info
                        </span>
                        <span className="text-xs">
                            Minimal 2 peserta untuk patungan
                        </span>
                    </div>
                </section>

                <button
                    type="button"
                    disabled={!isReady}
                    onClick={onNext}
                    className={`w-full h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all ${isReady
                        ? 'bg-primary hover:bg-primary-hover active:scale-[0.99] cursor-pointer'
                        : 'bg-outline-variant/60 cursor-not-allowed opacity-60'
                        }`}
                >
                    <span>Lanjut ke Tagihan</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
            </main>

            <ConfirmationModal
                isOpen={isBackModalOpen}
                onClose={() => setIsBackModalOpen(false)}
                onConfirm={onBack}
                confirmationMessage="Apakah Anda yakin ingin kembali? Daftar peserta yang telah dimasukkan akan hilang."
            />
        </>
    )
}