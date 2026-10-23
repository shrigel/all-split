import { prisma } from "../lib/prisma.js";
import { generateAccessToken, hashAccessToken } from "../utils/accessToken.js";

export const createResultShare = async (splitId, accessToken) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const split = await prisma.split.findFirst({
        where: {
            id: splitId,
            accessTokenHash,
            expiresAt: {
                gt: new Date()
            }
        }
    });

    if (!split) {
        return null;
    }

    const shareToken = generateAccessToken();
    const shareTokenHash = hashAccessToken(shareToken);

    const resultShare = await prisma.resultShare.create({
        data: {
            splitId: split.id,
            tokenHash: shareTokenHash
        },
        omit: {
            tokenHash: true
        }
    });

    return {
        resultShare,
        shareToken
    };
};

export const getResultShare = async (shareToken) => {
    const tokenHash = hashAccessToken(shareToken);

    const share = await prisma.resultShare.findFirst({
        where: {
            tokenHash
        },
        select: {
            splitId: true
        }
    });

    if (!share) return null;

    const split = await prisma.split.findFirst({
        where: {
            id: share.splitId,
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