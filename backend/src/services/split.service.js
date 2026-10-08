import { prisma } from "../lib/prisma.js";
import { generateAccessToken, hashAccessToken } from "../utils/accessToken.js";

export const createSplit = async (name) => {
    const accessToken = generateAccessToken();
    const accessTokenHash = hashAccessToken(accessToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const split = await prisma.split.create({
        data: {
            name,
            accessTokenHash,
            expiresAt
        },
        omit: {
            accessTokenHash: true
        }
    });

    return {
        split,
        accessToken
    };
}

export const getSplit = async (id, accessToken) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const split = await prisma.split.findFirst({
        where: {
            id,
            accessTokenHash,
            expiresAt: {
                gt: new Date()
            }
        },
        omit: {
            accessTokenHash: true
        },
        include: {
            participants: true,
            bills: {
                include: {
                    payer: true,
                    items: {
                        include: {
                            shares: true
                        }
                    },
                    adjustments: true
                }
            }
        }
    });

    return {
        ...split,
        bills: split.bills.map((bill) => ({
            ...bill,
            items: bill.items.map((item) => ({
                ...item,
                unitPrice: Number(item.unitPrice),
                assignedParticipantIds: item.shares.map((share) => share.participantId)
            })),
            adjustments: bill.adjustments.map((adjustment) => ({
                ...adjustment,
                amount: Number(adjustment.amount)
            }))
        }))
    };
};

export const updateSplit = async (id, accessToken, name) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const existingSplit = await prisma.split.findFirst({
        where: {
            id,
            accessTokenHash,
            expiresAt: {
                gt: new Date()
            }
        }
    });

    if (!existingSplit) {
        return null;
    }

    const split = await prisma.split.update({
        where: {
            id
        },
        data: {
            name
        },
        omit: {
            accessTokenHash: true
        }
    });

    return split;
}

export const deleteSplit = async (id, accessToken) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const existingSplit = await prisma.split.findFirst({
        where: {
            id,
            accessTokenHash,
            expiresAt: {
                gt: new Date()
            }
        }
    });

    if (!existingSplit) {
        return null;
    }

    await prisma.split.delete({
        where: {
            id
        }
    });

    return true;
}