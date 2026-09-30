import { formatIDR } from "./formatter";

export function generateSessionShareText({
    name,
    participants,
    bills,
    sessionTotal,
    settlements,
    participantBalances
}) {
    let text = `🎉 *Hasil Patungan - ${name}*\n`;

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;

    text += `👥 Jumlah Orang: ${participants.length}\n`;
    text += `💰 Total Tagihan: ${formatIDR(sessionTotal)}\n`;
    text += `🧾 Jumlah Tagihan: ${bills.length}\n`;

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;

    text += `💸 *Rincian Transfer:*\n`;

    if (settlements.length === 0) {
        text += `Semua tagihan sudah lunas!\n`;
    } else {
        settlements.forEach((transfer, index) => {
            text += `${index + 1}. *${transfer.fromName}* ➡️ *${transfer.toName}* : ${formatIDR(transfer.amount)}\n`;
        });
    }

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;

    text += `📊 *Rincian Pengeluaran:*\n`;

    participantBalances.forEach((participant) => {
        const status =
            participant.balance > 0
                ? `🟢 Terima +${formatIDR(participant.balance)}`
                : participant.balance < 0
                    ? `🔴 Bayar ${formatIDR(participant.balance)}`
                    : `⚪ Lunas Rp0`;

        text += `- ${participant.name}: ${status} (Nalangin: ${formatIDR(participant.totalPaid)} | Porsi: ${formatIDR(participant.totalResponsibility)})\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✨ Dihitung otomatis dengan All Split.`;

    return text;
}