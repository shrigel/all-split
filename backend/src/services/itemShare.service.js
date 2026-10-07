import { prisma } from "../lib/prisma.js";
import { hashAccessToken } from "../utils/accessToken.js";

export const updateItemShare = async (itemId, accessToken, participantIds) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const item = await prisma.billItem.findFirst({
        where: {
            id: itemId,
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
            id: true,
            bill: {
                select: {
                    splitId: true
                }
            }
        }
    });

    if (!item) {
        return null;
    }

    const participants = await prisma.participant.findMany({
        where: {
            id: {
                in: participantIds
            },
            splitId: item.bill.splitId
        },
        select: {
            id: true
        }
    });

    if (participants.length !== participantIds.length) {
        return {
            updated: false,
            reason: "INVALID_PARTICIPANT"
        };
    }

    const shares = await prisma.$transaction(async (tx) => {
        await tx.itemShare.deleteMany({
            where: {
                itemId
            }
        });

        await tx.itemShare.createMany({
            data: participantIds.map((participantId) => ({
                itemId,
                participantId
            }))
        });

        return tx.itemShare.findMany({
            where: {
                itemId
            }
        });
    });

    return shares;
};