import { useState, useEffect } from "react";
import { capitalizeWords, sanitizeAlphanumeric } from "../../utils/formatter";
import Button from "../../components/Button";
import ConfirmationModal from "../../components/ConfirmationModal";
import NewParticipantForm from "./components/NewParticipantForm";
import ParticipantList from "./components/ParticipantList";
import BlockedRemovalModal from "./components/BlockedRemovalModal";

export default function Participants({
    sessionName,
    participants,
    onAddParticipant,
    onRemoveParticipant,
    getParticipantUsage,
    onDirtyChange,
    onNext,
    onBack,
}) {
    const [participantName, setParticipantName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);
    const [isBlockedRemovalModalOpen, setIsBlockedRemovalModalOpen] = useState(false);
    const [blockedRemoval, setBlockedRemoval] = useState(null);
    const isReady = participants.length >= 2;
    const hasUnsavedDraft = participantName.trim() !== '';

    const handleNavigation = (navigationAction) => {
        if (hasUnsavedDraft) {
            setPendingNavigation(() => navigationAction);
            setIsNavigationModalOpen(true);
            return;
        }

        navigationAction();
    };

    const handleCloseNavigationModal = () => {
        setIsNavigationModalOpen(false);
        setPendingNavigation(null);
    };

    const handleConfirmNavigation = () => {
        setIsNavigationModalOpen(false);

        if (pendingNavigation) {
            pendingNavigation();
        }

        setPendingNavigation(null);
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedDraft) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedDraft]);

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

    const handleRequestRemoveParticipant = (participant) => {
        const usage = getParticipantUsage(participant.id);

        if (usage.isUsed) {
            setIsBlockedRemovalModalOpen(true);
            setBlockedRemoval({ participant, usage });
            return;
        }

        onRemoveParticipant(participant.id);
    }

    const handleCloseBlockedRemovalModal = () => {
        setIsBlockedRemovalModalOpen(false);
        setBlockedRemoval(null);
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
                        onClick={() => handleNavigation(onBack)}
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
                    onRequestRemoveParticipant={(participant) => handleRequestRemoveParticipant(participant)}
                />

                <Button
                    disabled={!isReady}
                    onClick={() => handleNavigation(onNext)}
                    iconEnd="arrow_forward"
                >
                    Lanjut ke Tagihan
                </Button>
            </main>

            <BlockedRemovalModal
                isOpen={isBlockedRemovalModalOpen}
                onClose={handleCloseBlockedRemovalModal}
                participant={blockedRemoval?.participant}
                usage={blockedRemoval?.usage}
            />

            <ConfirmationModal
                btnLabel="Tinggalkan"
                isOpen={isNavigationModalOpen}
                onClose={handleCloseNavigationModal}
                onConfirm={handleConfirmNavigation}
                confirmationMessage="Nama peserta yang belum ditambahkan akan hilang. Apakah Anda yakin ingin meninggalkan halaman ini?"
            />
        </>
    )
}