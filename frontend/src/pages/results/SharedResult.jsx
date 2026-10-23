import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResultShare } from "../../api/shares";
import {
    calculateSessionTotal,
    calculateParticipantBalances,
    calculateSettlements
} from "../../domain/calculation";
import { formatDate } from "../../utils/formatter";

import ResultOverviewSection from "./components/ResultOverviewSection";
import ResultBillsSection from "./components/ResultBillsSection";
import ResultSettlementsSection from "./components/ResultSettlementsSection";
import ResultExpensesSection from "./components/ResultExpensesSection";
import BillDetailModal from "./components/BillDetailModal";
import ParticipantDetailModal from "./components/ParticipantDetailModal";
import ResultActions from "./components/ResultActions";
import Button from "../../components/Button";

export default function SharedResult() {
    const { shareToken } = useParams();
    const navigate = useNavigate();

    const [split, setSplit] = useState(null);
    const [settlements, setSettlements] = useState([]);
    const [participantBalances, setParticipantBalances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [selectedBill, setSelectedBill] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    useEffect(() => {
        const loadSharedData = async () => {
            try {
                const splitData = await getResultShare(shareToken);
                const balances = calculateParticipantBalances(splitData.participants, splitData.bills);
                const transfers = calculateSettlements(balances);

                setSplit(splitData);
                setParticipantBalances(balances);
                setSettlements(transfers);
            } catch (err) {
                setFetchError(err.message || "Tautan patungan tidak valid atau sudah kedaluwarsa.");
            } finally {
                setIsLoading(false);
            }
        };

        loadSharedData();
    }, [shareToken]);

    if (isLoading) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary mb-2">
                    progress_activity
                </span>
                <p className="text-slate-500">Memuat rincian patungan...</p>
            </main>
        );
    }

    if (fetchError || !split) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-500 mb-4">{fetchError}</p>
                <Button onClick={() => navigate("/")}>Buka All Split</Button>
            </main>
        );
    }

    const { name, participants, bills } = split;
    const sessionTotal = calculateSessionTotal(bills);

    return (
        <main className="flex-1 flex flex-col gap-6 w-full max-w-app mx-auto px-4 py-6">
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold tracking-tight">Rincian Patungan</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        <span>{formatDate(split.createdAt)}</span>
                    </div>
                </div>
                <span className="text-primary text-3xl font-bold tracking-tight">{name}</span>
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

            <ResultSettlementsSection settlements={settlements} />

            <ResultExpensesSection
                participantBalances={participantBalances}
                onOpenParticipantDetail={setSelectedParticipant}
            />

            <ParticipantDetailModal
                isOpen={Boolean(selectedParticipant)}
                onClose={() => setSelectedParticipant(null)}
                participant={selectedParticipant}
                participants={participants}
                bills={bills}
            />

            <ResultActions
                onBackToHome={() => navigate("/")}
            />
        </main>
    );
}
