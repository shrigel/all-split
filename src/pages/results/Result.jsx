import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { calculateSessionTotal, calculateParticipantBalances, calculateSettlements } from "../../utils/calculations";
import { formatDate, formatIDR } from "../../utils/formatter";
import { generateSessionShareText } from "../../utils/share";
import BillDetailModal from "./components/BillDetailModal";
import ResultOverviewSection from "./components/ResultOverviewSection";
import ResultBillsSection from "./components/ResultBillsSection";
import ResultSettlementsSection from "./components/ResultSettlementsSection";
import ResultExpensesSection from "./components/ResultExpensesSection";
import ResultActions from "./components/ResultActions";
import Button from "../../components/Button";

export default function Result({ savedSessions, onBackToHome }) {
    const { sessionId } = useParams();
    const [selectedBill, setSelectedBill] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const copyTimeoutRef = useRef(null);
    const session = savedSessions.find((s) => s.id === sessionId);

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    if (!session) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-500 mb-4">
                    Sesi patungan tidak ditemukan atau sudah kedaluwarsa.
                </p>

                <Button
                    onClick={onBackToHome}
                >
                    Kembali ke Beranda
                </Button>
            </main>
        );
    }

    const { name, participants, bills } = session;
    const sessionTotal = calculateSessionTotal(bills);
    const participantBalances = calculateParticipantBalances(participants, bills);
    const settlements = calculateSettlements(participantBalances);

    const handleCopy = async () => {
        const textToCopy = getShareText();

        try {
            await navigator.clipboard.writeText(textToCopy);

            setIsCopied(true);

            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }

            copyTimeoutRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2500);
        } catch (error) {
            console.error("Gagal menyalin teks", error);
        }
    };

    const getShareText = () => {
        return generateSessionShareText({
            name,
            participants,
            bills,
            sessionTotal,
            settlements,
            participantBalances
        });
    };

    const handleShareWA = () => {
        const text = encodeURIComponent(getShareText());
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <main className="flex-1 flex flex-col gap-6 w-full max-w-app mx-auto px-4 py-6">

            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold tracking-tight">
                        Hasil Patungan
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">
                            calendar_today
                        </span>

                        <span className="text-xs">
                            {formatDate(session.createdAt)}
                        </span>
                    </div>
                </div>

                <span className="text-primary text-3xl font-bold tracking-tight">
                    {name}
                </span>
            </div>

            <ResultOverviewSection
                participants={participants}
                bills={bills}
                sessionTotal={sessionTotal}
            />

            <ResultBillsSection
                bills={bills}
                participants={participants}
                onOpenBillDetail={setSelectedBill}
            />

            <BillDetailModal
                isOpen={Boolean(selectedBill)}
                onClose={() => setSelectedBill(null)}
                bill={selectedBill}
                participants={participants}
            />

            <ResultSettlementsSection
                settlements={settlements}
            />

            <ResultExpensesSection
                participantBalances={participantBalances}
            />

            <ResultActions
                isCopied={isCopied}
                onCopy={handleCopy}
                onShareWA={handleShareWA}
                onBackToHome={onBackToHome}
            />

            <div className="flex items-center gap-2 p-4 bg-surface-container rounded-xl border border-outline-variant/40">
                <span className="material-symbols-outlined text-[20px] text-outline">
                    info
                </span>

                <p className="text-xs text-on-surface-variant">
                    Sesi ini disimpan sementara di perangkat Anda dan otomatis dihapus saat kadaluwarsa setelah 7 hari.
                </p>
            </div>

        </main>
    )
}