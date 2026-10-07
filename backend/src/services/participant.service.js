import { prisma } from "../lib/prisma.js";
import { hashAccessToken } from "../utils/accessToken.js";

export const createParticipant = async (splitId, accessToken, name) => {
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

    const participant = await prisma.participant.create({
        data: {
            splitId,
            name
        }
    });

    return participant;
};

export const updateParticipant = async (participantId, accessToken, name) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const participant = await prisma.participant.findFirst({
        where: {
            id: participantId,
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

    if (!participant) {
        return null;
    }

    const updatedParticipant = await prisma.participant.update({
        where: {
            id: participantId
        },
        data: {
            name
        }
    });

    return updatedParticipant;
}

export const deleteParticipant = async (participantId, accessToken) => {
    const accessTokenHash = hashAccessToken(accessToken);

    const participant = await prisma.participant.findFirst({
        where: {
            id: participantId,
            split: {
                accessTokenHash,
                expiresAt: {
                    gt: new Date()
                }
            }
        },
        select: {
            id: true,
            _count: {
                select: {
                    paidBills: true,
                    itemShares: true
                }
            }
        }
    });

    if (!participant) {
        return null;
    }

    if (participant._count.paidBills > 0 || participant._count.itemShares > 0) {
        return {
            deleted: false,
            reason: "PARTICIPANT_IN_USE"
        };
    }

    await prisma.participant.delete({
        where: {
            id: participantId
        }
    });

    return true;
}