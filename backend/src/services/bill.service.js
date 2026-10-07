import { prisma } from "../lib/prisma.js";
import { hashAccessToken } from "../utils/accessToken.js";

export const createBill = async (splitId, accessToken, name, payerId) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const split = await prisma.split.findFirst({
        where: {
            id: splitId,
            accessTokenHash,
            expiresAt: {
                gt: new Date()
            }
        },
        select: {
            id: true
        }
    });

    if (!split) {
        return null;
    }

    const payer = await prisma.participant.findFirst({
        where: {
            id: payerId,
            splitId
        },
        select: {
            id: true
        }
    });

    if (!payer) {
        return {
            created: false,
            reason: "INVALID_PAYER"
        };
    }

    const bill = await prisma.bill.create({
        data: {
            splitId,
            name,
            payerId
        }
    });

    return bill;
};

export const getBills = async (splitId, accessToken) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const split = await prisma.split.findFirst({
        where: {
            id: splitId,
            accessTokenHash,
            expiresAt: {
                gt: new Date()
            }
        },
        select: {
            id: true
        }
    });

    if (!split) {
        return null;
    }

    const bills = await prisma.bill.findMany({
        where: {
            splitId
        }
    });

    return bills;
}

export const updateBill = async (billId, accessToken, name, payerId) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const bill = await prisma.bill.findFirst({
        where: {
            id: billId,
            split: {
                accessTokenHash,
                expiresAt: {
                    gt: new Date()
                }
            }
        },
        select: {
            id: true,
            splitId: true
        }
    });

    if (!bill) {
        return null;
    }

    if (payerId !== undefined) {
        const payer = await prisma.participant.findFirst({
            where: {
                id: payerId,
                splitId: bill.splitId
            },
            select: {
                id: true
            }
        });

        if (!payer) {
            return {
                updated: false,
                reason: "INVALID_PAYER"
            };
        }
    }

    const updatedBill = await prisma.bill.update({
        where: {
            id: billId
        },
        data: {
            name,
            payerId
        }
    });

    return updatedBill;
}

export const deleteBill = async (billId, accessToken) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const bill = await prisma.bill.findFirst({
        where: {
            id: billId,
            split: {
                accessTokenHash,
                expiresAt: {
                    gt: new Date()
                }
            }
        },
        select: {
            id: true
        }
    });

    if (!bill) {
        return null;
    }

    await prisma.bill.delete({
        where: {
            id: billId
        }
    });

    return true;
}