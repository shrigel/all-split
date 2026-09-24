import { calculateBillFinancialSummary } from "./billTotals";
import { calculateParticipantResponsibilities } from "./participantResponsibilities";
import { calculateParticipantBalances } from "./participantBalances";

export function validateBillFinancials(bill, participants) {
    const errors = [];

    const items = Array.isArray(bill.items)
        ? bill.items
        : [];

    const adjustments = Array.isArray(bill.adjustments)
        ? bill.adjustments
        : [];

    if (!Array.isArray(bill.items) || items.length === 0) {
        errors.push({
            code: "INVALID_ITEMS",
            message: "Tagihan harus memiliki minimal satu item"
        });
    }

    if (bill.adjustments !== undefined && !Array.isArray(bill.adjustments)) {
        errors.push({
            code: "INVALID_ADJUSTMENTS",
            message: "Data adjustment tidak valid"
        });
    }

    const participantIds = new Set(
        participants.map((participant) => participant.id)
    );

    if (!participantIds.has(bill.payerId)) {
        errors.push({
            code: "INVALID_PAYER",
            message: "Pembayar tagihan tidak ditemukan di dalam daftar peserta"
        });
    }

    const hasItemWithoutParticipant = items.some((item) =>
        !Array.isArray(item.assignedParticipantIds) || item.assignedParticipantIds.length === 0
    );
    const hasInvalidParticipant = items.some((item) =>
        Array.isArray(item.assignedParticipantIds) &&
        item.assignedParticipantIds.some(
            (participantId) => !participantIds.has(participantId)
        )
    );

    if (hasItemWithoutParticipant) {
        errors.push({
            code: "ITEM_WITHOUT_PARTICIPANT",
            message: "Tidak ada peserta untuk membagi tagihan pada item"
        });
    }

    if (hasInvalidParticipant) {
        errors.push({
            code: "INVALID_ITEM_PARTICIPANT",
            message: "Item yang dibagikan memiliki peserta yang tidak valid"
        });
    }

    const hasInvalidItemValue = items.some((item) => {
        const unitPrice = Number(item.unitPrice);
        const quantity = Number(item.quantity);

        if (!Number.isSafeInteger(unitPrice) || unitPrice <= 0) {
            return true;
        }

        if (!Number.isSafeInteger(quantity) || quantity < 1) {
            return true;
        }

        return !Number.isSafeInteger(unitPrice * quantity);
    });

    if (hasInvalidItemValue) {
        errors.push({
            code: "INVALID_ITEM_VALUE",
            message: "Harga dan jumlah item harus berupa bilangan bulat positif yang valid"
        });
    }

    if (adjustments.length > 0) {
        const hasInvalidAdjType = adjustments.some(adj => !["charge", "discount"].includes(adj.type));
        const hasInvalidAdjAllocation = adjustments.some(adj => !["equal", "proportional"].includes(adj.allocationType));

        if (hasInvalidAdjType) {
            errors.push({
                code: "INVALID_ADJUSTMENT_TYPE",
                message: "Adjustment type tidak valid"
            });
        }

        if (hasInvalidAdjAllocation) {
            errors.push({
                code: "INVALID_ADJUSTMENT_ALLOCATION",
                message: "Adjustment allocation tidak valid"
            });
        }

        const hasInvalidAdjAmount = adjustments.some(adj => !Number.isSafeInteger(adj.amount) || adj.amount < 0);

        if (hasInvalidAdjAmount) {
            errors.push({
                code: "INVALID_ADJUSTMENT_AMOUNT",
                message: "Adjustment amount tidak boleh negatif dan harus bilangan bulat"
            });
        }
    }

    const normalizedBill = {
        ...bill,
        items,
        adjustments
    };

    let financialSummary = {
        itemsSubtotal: null,
        totalCharges: null,
        totalDiscounts: null,
        finalTotal: null
    };

    if (!hasInvalidItemValue) {
        financialSummary = calculateBillFinancialSummary(normalizedBill);

        const hasUnsafeFinancialTotal = [
            financialSummary.itemsSubtotal,
            financialSummary.totalCharges,
            financialSummary.totalDiscounts,
            financialSummary.finalTotal
        ].some((value) => !Number.isSafeInteger(value));

        if (hasUnsafeFinancialTotal) {
            errors.push({
                code: "UNSAFE_FINANCIAL_TOTAL",
                message: "Total nilai finansial melebihi batas bilangan bulat yang aman"
            });
        }

        if (financialSummary.finalTotal < 0) {
            errors.push({
                code: "NEGATIVE_FINAL_TOTAL",
                message: "Final total tidak boleh negatif"
            });
        }
    }

    let totalResponsibility = null;

    if (errors.length === 0) {
        const responsibilities = calculateParticipantResponsibilities(participants, [normalizedBill]);

        totalResponsibility = responsibilities.reduce((sum, responsibility) => sum + responsibility.totalResponsibility, 0);

        if (totalResponsibility !== financialSummary.finalTotal) {
            errors.push({
                code: "RESPONSIBILITY_MISMATCH",
                message: "Final total tidak cocok dengan total responsibility"
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        summary: {
            ...financialSummary,
            totalResponsibility
        }
    };
}

export function validateSessionFinancials(session) {
    const errors = [];

    const participants = Array.isArray(session.participants)
        ? session.participants
        : [];

    const bills = Array.isArray(session.bills)
        ? session.bills
        : [];

    const billResults = bills.map((bill) =>
        validateBillFinancials(bill, participants)
    );

    billResults.forEach((result, index) => {
        if (!result.isValid) {
            errors.push({
                code: "INVALID_BILL",
                billIndex: index,
                errors: result.errors
            });
        }
    });

    let financialSummary = {
        totalPaid: null,
        totalResponsibility: null,
        totalBalance: null
    };

    if (errors.length === 0) {
        const balances = calculateParticipantBalances(participants, bills);

        const totalPaid = balances.reduce((sum, participant) => sum + participant.totalPaid, 0);

        const totalResponsibility = balances.reduce((sum, participant) => sum + participant.totalResponsibility, 0);

        const totalBalance = balances.reduce((sum, participant) => sum + participant.balance, 0);

        financialSummary = {
            totalPaid,
            totalResponsibility,
            totalBalance
        };

        if (totalPaid !== totalResponsibility) {
            errors.push({
                code: "SESSION_TOTAL_MISMATCH",
                message: "Total pembayaran tidak cocok dengan total tanggung jawab peserta"
            });
        }

        if (totalBalance !== 0) {
            errors.push({
                code: "SESSION_BALANCE_MISMATCH",
                message: "Total saldo peserta harus bernilai nol"
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        bills: billResults,
        summary: financialSummary
    };
}