import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { calculateSessionTotal, calculateParticipantBalances, calculateSettlements } from "../../domain/calculation";
import { formatDate } from "../../utils/formatter";
import { generateSessionShareText } from "../../utils/share";
import BillDetailModal from "./components/BillDetailModal";
import ResultOverviewSection from "./components/ResultOverviewSection";
import ResultBillsSection from "./components/ResultBillsSection";
import ResultSettlementsSection from "./components/ResultSettlementsSection";
import ResultExpensesSection from "./components/ResultExpensesSection";
import ResultActions from "./components/ResultActions";
import Button from "../../components/Button";
import { getSplitReference } from "../../utils/splitReferences";
import { getSplit } from "../../api/splits";
import { getSettlements } from "../../api/settlements";

export default function Result({ onBackToHome }) {
    const { sessionId } = useParams();

    const [split, setSplit] = useState(null);
    const [settlements, setSettlements] = useState([]);
    const [participantBalances, setParticipantBalances] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [selectedBill, setSelectedBill] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const copyTimeoutRef = useRef(null);

    useEffect(() => {
        const loadResultData = async () => {
            const ref = getSplitReference(sessionId);

            if (!ref) {
                setFetchError('Kredensial sesi tidak ditemukan di perangkat ini.');
                setIsLoading(false);
                return;
            }

            try {
                const [spliData, settlementRes] = await Promise.all([
                    getSplit(sessionId, ref.accessToken),
                    getSettlements(sessionId, ref.accessToken)
                ]);

                setSplit(spliData);
                setSettlements(settlementRes.settlements || []);
                setParticipantBalances(settlementRes.balances || {});
            } catch (err) {
                setFetchError(err.message || 'Gagal memuat hasil patungan.');
            } finally {
                setIsLoading(false);
            }
        };

        loadResultData();
    }, [sessionId]);

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    if (isLoading) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary mb-2">
                    progress_activity
                </span>
                <p className="text-slate-500">Memuat hasil patungan...</p>
            </main>
        );
    }

    if (fetchError || !split) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-500 mb-4">
                    {fetchError || 'Sesi patungan tidak ditemukan atau sudah kedaluwarsa.'}
                </p>
                <Button onClick={onBackToHome}>
                    Kembali ke Beranda
                </Button>
            </main>
        );
    }

    const { name, participants, bills } = split;
    const sessionTotal = calculateSessionTotal(bills);

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
                            {formatDate(split.createdAt)}
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