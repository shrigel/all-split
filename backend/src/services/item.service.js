import { prisma } from "../lib/prisma.js";
import { hashAccessToken } from "../utils/accessToken.js";

export const createItem = async (billId, accessToken, name, quantity, unitPrice) => {
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

    const item = await prisma.billItem.create({
        data: {
            billId,
            name,
            quantity,
            unitPrice: BigInt(unitPrice)
        }
    });

    return {
        ...item,
        unitPrice: Number(item.unitPrice)
    };
};

export const updateItem = async (itemId, accessToken, name, quantity, unitPrice) => {
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
            id: true
        }
    });

    if (!item) {
        return null;
    }

    const updatedItem = await prisma.billItem.update({
        where: {
            id: itemId
        },
        data: {
            name,
            quantity,
            unitPrice: unitPrice !== undefined ? BigInt(unitPrice) : undefined
        }
    });

    return {
        ...updatedItem,
        unitPrice: Number(updatedItem.unitPrice)
    };
};

export const deleteItem = async (itemId, accessToken) => {
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
            id: true
        }
    });

    if (!item) {
        return null;
    }

    await prisma.billItem.delete({
        where: {
            id: itemId
        }
    });

    return true;
}