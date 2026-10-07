import { z } from "zod";

const monetaryValueSchema = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);

export const createItemSchema = z.object({
    params: z.object({
        id: z.uuid()
    }),
    body: z.object({
        name: z.string().trim().nonempty(),
        quantity: z.number().int().positive(),
        unitPrice: monetaryValueSchema
    })
});

export const updateItemSchema = z.object({
    params: z.object({
        id: z.uuid()
    }),
    body: z.object({
        name: z.string().trim().nonempty().optional(),
        quantity: z.number().int().positive().optional(),
        unitPrice: monetaryValueSchema.optional()
    }).refine(
        (data) => data.name !== undefined || data.quantity !== undefined || data.unitPrice !== undefined,
        {
            message: "At least one field is required"
        }
    )
});

export const itemIdParamSchema = z.object({
    params: z.object({
        id: z.uuid()
    })
});