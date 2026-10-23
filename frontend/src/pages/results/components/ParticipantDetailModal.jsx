import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {
    calculateItemShares,
    calculateAdjustmentShares,
    calculateItemTotal,
    calculateBillTotal,
} from "../../../domain/calculation";
import { formatIDR, capitalizeWords } from "../../../utils/formatter";

function DetailSection({ title, children }) {
    return (
        <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {title}
            </h3>

            {children}
        </section>
    );
}

function DetailRow({ label, description, amount, amountClass = "" }) {
    return (
        <div className="flex justify-between items-center gap-3 py-2">
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-on-surface break-words">
                    {label}
                </span>

                {description && (
                    <span className="text-[10px] text-slate-500">
                        {description}
                    </span>
                )}
            </div>

            <span className={`text-xs font-bold shrink-0 ${amountClass}`}>
                {amount}
            </span>
        </div>
    )
}

export default function ParticipantDetailModal({
    isOpen,
    onClose,
    participant,
    participants = [],
    bills = []
}) {
    if (!participant) return null;

    const participantIds = participants.map((p) => p.id);

    const expenseDetails = bills.map((bill) => {
        const itemSubtotals = Object.fromEntries(
            participantIds.map((id) => [id, 0])
        );

        const items = (bill.items || []).map((item) => {
            const shares = calculateItemShares(item, participantIds);

            shares.forEach(({ participantId, amount }) => {
                itemSubtotals[participantId] += amount;
            });

            const participantShare = shares.find(
                (share) => share.participantId === participant.id
            );

            return {
                ...item,
                itemTotal: calculateItemTotal(item),
                participantShare: participantShare?.amount ?? null,
            };
        }).filter((item) => item.participantShare !== null);

        const adjustments = (bill.adjustments || []).map((adjustment) => {
            const shares = calculateAdjustmentShares(
                adjustment,
                participantIds,
                itemSubtotals
            );

            const participantShare = shares.find(
                (share) => share.participantId === participant.id
            );

            return {
                ...adjustment,
                participantShare: participantShare?.amount ?? 0,
            };
        }).filter((adjustment) => adjustment.participantShare !== 0);

        return {
            id: bill.id,
            name: bill.name,
            items,
            adjustments,
        };
    }).filter(
        (bill) => bill.items.length > 0 || bill.adjustments.length > 0
    );

    const paidBills = bills.filter(
        (bill) => bill.payerId === participant.id
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-between items-center p-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                            finance
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base text-on-surface">
                            Detail Pengeluaran - <span className="font-bold">{participant.name}</span>
                        </h2>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label="Tutup detail pengeluaran partisipan"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            <div className="p-4 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                <section className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <span className="text-xs text-on-surface-variant">
                            Porsi
                        </span>

                        <p className="text-base font-bold text-red-500 mt-1 break-words">
                            {formatIDR(participant.totalResponsibility)}
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-primary/10">
                        <span className="text-xs text-on-surface-variant">
                            Talangan
                        </span>

                        <p className="text-base font-bold text-green-500 mt-1 break-words">
                            {formatIDR(participant.totalPaid)}
                        </p>
                    </div>
                </section>

                <DetailSection title="Rincian Porsi per Tagihan">
                    {expenseDetails.length === 0 ? (
                        <p className="text-xs text-slate-500 p-3 bg-surface-container-low rounded-xl">
                            Tidak ada rincian porsi untuk partisipan ini.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {expenseDetails.map((bill) => (
                                <div
                                    key={bill.id}
                                    className="rounded-xl border border-outline-variant/30 overflow-hidden"
                                >
                                    <div className="px-3 py-2 bg-surface-container">
                                        <h4 className="text-sm font-bold text-on-surface">
                                            {bill.name}
                                        </h4>
                                    </div>

                                    <div className="px-3 divide-y divide-outline-variant/20">
                                        {bill.items.map((item) => (
                                            <DetailRow
                                                key={item.id}
                                                label={capitalizeWords(item.name)}
                                                description={`${item.quantity} × ${formatIDR(item.unitPrice)}`}
                                                amount={formatIDR(item.participantShare)}
                                            />
                                        ))}

                                        {bill.adjustments.map((adjustment) => (
                                            <DetailRow
                                                key={adjustment.id}
                                                label={adjustment.name}
                                                description={`${adjustment.type === "discount"
                                                    ? "Diskon"
                                                    : "Biaya tambahan"
                                                    } · ${adjustment.allocationType === "proportional"
                                                        ? "Proporsional"
                                                        : "Bagi rata"
                                                    }`}
                                                amount={`${adjustment.participantShare > 0
                                                    ? "+"
                                                    : ""
                                                    }${formatIDR(adjustment.participantShare)}`}
                                                amountClass={
                                                    adjustment.participantShare < 0
                                                        ? "text-green-600"
                                                        : adjustment.participantShare > 0
                                                            ? "text-red-500"
                                                            : ""
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DetailSection>

                {paidBills.length > 0 && (
                    <DetailSection title="Tagihan yang Ditalangi">
                        <div className="flex flex-col px-3 rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/20">
                            {paidBills.map((bill) => (
                                <DetailRow
                                    key={bill.id}
                                    label={bill.name}
                                    description="Total tagihan"
                                    amount={formatIDR(calculateBillTotal(bill))}
                                />
                            ))}
                        </div>
                    </DetailSection>
                )}
            </div>

            <div className="p-4 border-t border-outline-variant/30">
                <Button
                    variant="tonal"
                    onClick={onClose}
                    className="w-full"
                >
                    Tutup
                </Button>
            </div>
        </Modal>
    );
}