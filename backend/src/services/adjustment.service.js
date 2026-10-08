import { prisma } from "../lib/prisma.js";
import { hashAccessToken } from "../utils/accessToken.js";

export const createAdjustment = async (billId, accessToken, name, type, amount, allocationType) => {
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

    const adjustment = await prisma.billAdjustment.create({
        data: {
            billId,
            name,
            type,
            amount: BigInt(amount),
            allocationType
        }
    });

    return {
        ...adjustment,
        amount: Number(adjustment.amount)
    };
};

export const updateAdjustment = async (adjustmentId, accessToken, name, type, amount, allocationType) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const adjustment = await prisma.billAdjustment.findFirst({
        where: {
            id: adjustmentId,
            bill: {
                split: {
                    accessTokenHash,
                    expiresAt: {
                        gt: new Date()
                    }
                }
            }
        },
        select: {
            id: true
        }
    });

    if (!adjustment) {
        return null;
    }

    const updatedAdjustment = await prisma.billAdjustment.update({
        where: {
            id: adjustmentId
        },
        data: {
            name,
            type,
            amount: amount !== undefined ? BigInt(amount) : undefined,
            allocationType
        }
    });

    return {
        ...updatedAdjustment,
        amount: Number(updatedAdjustment.amount)
    };
};

export const deleteAdjustment = async (adjustmentId, accessToken) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const adjustment = await prisma.billAdjustment.findFirst({
        where: {
            id: adjustmentId,
            bill: {
                split: {
                    accessTokenHash,
                    expiresAt: {
                        gt: new Date()
                    }
                }
            }
        },
        select: {
            id: true
        }
    });

    if (!adjustment) {
        return null;
    }

    await prisma.billAdjustment.delete({
        where: {
            id: adjustmentId
        }
    });

    return true;
}