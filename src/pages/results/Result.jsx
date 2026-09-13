import { useState } from "react";
import { useParams } from "react-router-dom";
import { calculateSessionTotal, calculateParticipantBalances, calculateSettlements, calculateBillTotal } from "../../utils/calculations";
import { formatDate, formatIDR } from "../../utils/formatter";
import WhatsAppLogo from "../../components/WhatsAppLogo";
import BillDetailModal from "./components/BillDetailModal";

export default function Result({ savedSessions, onBackToHome }) {
    const { sessionId } = useParams();
    const session = savedSessions.find((s) => s.id === sessionId);
    const [selectedBill, setSelectedBill] = useState(null);

    const AVATAR_PALETTES = [
        { bg: 'bg-[#5B8FB9]/15', text: 'text-[#5B8FB9]' },
        { bg: 'bg-emerald-100', text: 'text-emerald-700' },
        { bg: 'bg-amber-100', text: 'text-amber-700' },
        { bg: 'bg-purple-100', text: 'text-purple-700' },
        { bg: 'bg-rose-100', text: 'text-rose-700' },
        { bg: 'bg-indigo-100', text: 'text-indigo-700' }
    ];

    const getPayerName = (payerId) => {
        const participant = participants.find((p) => p.id === payerId);

        return participant.name;
    };

    if (!session) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-500 mb-4">Sesi patungan tidak ditemukan atau sudah kedaluwarsa.</p>
                <button
                    onClick={onBackToHome}
                    className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold"
                >
                    Kembali ke Beranda
                </button>
            </main>
        );
    }

    const { name, participants, bills } = session;
    const sessionTotal = formatIDR(calculateSessionTotal(bills));
    const participantBalances = calculateParticipantBalances(participants, bills);
    const settlements = calculateSettlements(participantBalances);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        const textToCopy = generateShareText();

        try {
            await navigator.clipboard.writeText(textToCopy);

            setIsCopied(true);

            setTimeout(() => {
                setIsCopied(false);
            }, 2500);
        } catch (err) {
            console.error("Gagal menyalin teks", err);
        }
    };

    const generateShareText = () => {
        let text = `🎉 *Hasil Patungan - ${name}*\n`;

        text += `━━━━━━━━━━━━━━━━━━━━━\n`;

        text += `💰 Jumlah Orang: ${participants.length}\n`;
        text += `👥 Total Tagihan: ${sessionTotal}\n`;
        text += `🧾 Total Tagihan: ${bills.length}\n`;

        text += `━━━━━━━━━━━━━━━━━━━━━\n`;

        text += `💸 *Rincian Transfer:*\n`;
        if (settlements.length === 0) {
            text += `Semua tagihan sudah lunas!\n`;
        } else {
            settlements.forEach((s, idx) => {
                text += `${idx + 1}. *${s.fromName}* ➡️ *${s.toName}* : ${formatIDR(s.amount)}\n`;
            });
        }

        text += `━━━━━━━━━━━━━━━━━━━━━\n`;

        text += `📊 *Rincian Pengeluaran:*\n`;
        participantBalances.forEach((p) => {
            const status = p.balance > 0
                ? `🟢 Terima +${formatIDR(p.balance)}`
                : p.balance < 0
                    ? `🔴 Bayar ${formatIDR(p.balance)}`
                    : `⚪ Lunas Rp0`;
            text += `- ${p.name}: ${status} (Nalangin: ${formatIDR(p.totalPaid)} | Porsi: ${formatIDR(p.totalResponsibility)})\n`;
        });

        text += `━━━━━━━━━━━━━━━━━━━━━\n`;

        text += `✨ Dihitung otomatis dengan All Split.`;
        return text;
    };

    const handleShareWA = () => {
        const text = encodeURIComponent(generateShareText());
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
                            {formatDate(session.createdAt || session.updatedAt || Number(session.id?.replace('session-', '')))}
                        </span>
                    </div>
                </div>

                <span className="text-primary text-3xl font-bold tracking-tight">
                    {name}
                </span>
            </div>

            <section className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-outline-variant/40">
                <div className="flex items-center justify-between gap-2 p-4 rounded-xl bg-surface-container">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs">
                            Total Seluruh Tagihan
                        </span>

                        <span className="text-2xl font-bold text-primary">
                            {sessionTotal}
                        </span>
                    </div>

                    <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined">
                            account_balance_wallet
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-xs font-medium">
                    <div className="flex items-center gap-1 text-xs font-medium">
                        <span>
                            Daftar Peserta
                        </span>

                        <span>
                            ({participants.length})
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {participants.map((p, index) => {
                            const isPayer = bills.some((b) => b.payerId === p.id);
                            const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

                            return (
                                <div
                                    key={p.id}
                                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low/75"
                                >
                                    <div className={`w-8 h-8 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                                        {p.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-semibold text-on-surface truncate">
                                            {p.name}
                                        </span>

                                        <span className={`text-[10px] font-medium ${isPayer ? "text-primary font-semibold" : "text-slate-400"
                                            }`}>
                                            {isPayer ? "Penalang" : "Peserta"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-bold">
                        <span className="material-symbols-outlined text-[20px]">
                            receipt_long
                        </span>

                        <span className="text-lg">
                            Daftar Tagihan
                        </span>
                    </h2>

                    <span className="text-xs">
                        {bills.length} Tagihan
                    </span>
                </div>

                <div className="flex flex-col px-4 bg-white rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40">
                    {bills.map((bill) => {
                        const billTotal = formatIDR(calculateBillTotal(bill));
                        const payer = getPayerName(bill.payerId);

                        return (
                            <div
                                key={bill.id}
                                onClick={() => setSelectedBill(bill)}
                                className="flex items-center gap-2 py-4 cursor-pointer"
                            >
                                <div className="flex justify-between items-center gap-2 w-full">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">
                                            {bill.name}
                                        </span>

                                        <span className="text-xs">
                                            Ditalangi {payer} • {bill.items.length} Item
                                        </span>
                                    </div>

                                    <span className="text-sm font-semibold">
                                        {billTotal}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center justify-center text-slate-400"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        chevron_right
                                    </span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </section>

            <BillDetailModal
                isOpen={Boolean(selectedBill)}
                onClose={() => setSelectedBill(null)}
                bill={selectedBill}
                participants={participants}
            />

            <section className="flex flex-col gap-2">
                <h2 className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-[20px]">
                        sync_alt
                    </span>

                    <span className="text-lg">
                        Rincian Patungan
                    </span>
                </h2>

                <div className="flex flex-col px-4 bg-white rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40">
                    {settlements.length === 0 ? (
                        <div className="flex items-center justify-center py-4">
                            <p className="text-sm text-center">
                                Semua tagihan sudah lunas! Nggak perlu bayar patungan lagi.
                            </p>
                        </div>
                    ) : (
                        settlements.map((transfer, index) => (
                            <div key={index} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-[12px] font-medium">
                                            {transfer.fromName.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">
                                                {transfer.fromName}
                                            </span>

                                            <span className="text-[10px] text-red-500">
                                                Bayar
                                            </span>
                                        </div>
                                    </div>

                                    <span className="material-symbols-outlined text-slate-300 text-[16px]">
                                        arrow_forward
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <div className="w-7 h-7 rounded-full bg-secondary-container text-on-surface flex items-center justify-center text-[12px] font-medium">
                                            {transfer.toName.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">
                                                {transfer.toName}
                                            </span>

                                            <span className="text-[10px] text-green-500">
                                                Terima
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <span className="font-bold text-sm text-primary">
                                    {formatIDR(transfer.amount)}
                                </span>
                            </div>
                        ))
                    )}

                </div>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-[20px]">
                        finance
                    </span>

                    <span className="text-lg">
                        Rincian Pengeluaran
                    </span>
                </h2>

                <div className="flex flex-col px-4 bg-white rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40">
                    {participantBalances.map((p) => (
                        <div key={p.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-[12px] font-medium">
                                    {p.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">
                                        {p.name}
                                    </span>

                                    <span className="text-[10px] text-on-surface-variant">
                                        Talangan: {formatIDR(p.totalPaid)}
                                    </span>
                                    <span className="text-[10px] text-on-surface-variant">
                                        Porsi: {formatIDR(p.totalResponsibility)}
                                    </span>
                                </div>
                            </div>

                            <span className={`font-bold text-sm ${p.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {p.balance < 0 ? formatIDR(p.balance) : `+${formatIDR(p.balance)}`}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleCopy}
                    className={`flex items-center gap-2 justify-center w-full py-3 rounded-xl text-md font-semibold transition-all cursor-pointer active:scale-[0.99] ${isCopied
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-primary text-on-primary hover:bg-primary-hover shadow-xs"
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px] transition-transform duration-200">
                        {isCopied ? "check" : "content_copy"}
                    </span>
                    <span className="text-sm font-bold">
                        {isCopied ? "Rincian Berhasil Disalin!" : "Salin Rincian Patungan"}
                    </span>
                </button>

                <button
                    onClick={handleShareWA}
                    className="flex items-center gap-2 justify-center w-full py-3 rounded-xl bg-[#25d366] text-white text-md font-semibold hover:bg-[#128c7e] active:scale-[0.99] transition-all"
                >
                    <WhatsAppLogo className="w-6 h-6 text-white" />

                    <span className="text-sm">
                        Bagikan ke WhatsApp
                    </span>
                </button>

                <button
                    onClick={onBackToHome}
                    className="flex items-center gap-2 justify-center w-full py-3 rounded-xl text-md font-semibold active:scale-[0.99] transition-all"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        home
                    </span>

                    <span className="text-sm">
                        Kembali ke Beranda
                    </span>
                </button>
            </div>

            <div className="flex items-start gap-2 p-4 bg-surface-container rounded-xl border border-outline-variant/40">
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