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
                            shares: {
                                include: {
                                    participant: true
                                }
                            }
                        }
                    },
                    adjustments: true
                }
            }
        }
    });

    return split;
}