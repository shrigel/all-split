import { useState, useEffect } from "react";
import { capitalizeWords, sanitizeAlphanumeric } from "../../utils/formatter";
import Button from "../../components/Button";
import ConfirmationModal from "../../components/ConfirmationModal";
import NewParticipantForm from "./components/NewParticipantForm";
import ParticipantList from "./components/ParticipantList";

export default function Participants({
    sessionName,
    participants,
    onAddParticipant,
    onRemoveParticipant,
    onDirtyChange,
    onNext,
    onBack,
}) {
    const [participantName, setParticipantName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleParticipantNameChange = (e) => {
        setParticipantName(sanitizeAlphanumeric(e.target.value));
        if (errorMessage) setErrorMessage('');
    };

    const handleSubmitParticipant = (e) => {
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

                <NewParticipantForm
                    participantName={participantName}
                    onSubmit={handleSubmitParticipant}
                    onParticipantNameChange={handleParticipantNameChange}
                    errorMessage={errorMessage}
                />

                <ParticipantList
                    participants={participants}
                    onRemoveParticipant={onRemoveParticipant}
                />

                <Button
                    disabled={!isReady}
                    onClick={onNext}
                    iconEnd="arrow_forward"
                >
                    Lanjut ke Tagihan
                </Button>
            </main>

            <ConfirmationModal
                btnLabel="Kembali"
                isOpen={isBackModalOpen}
                onClose={() => setIsBackModalOpen(false)}
                onConfirm={onBack}
                confirmationMessage="Apakah Anda yakin ingin kembali? Daftar peserta yang telah dimasukkan akan hilang."
            />
        </>
    )
}