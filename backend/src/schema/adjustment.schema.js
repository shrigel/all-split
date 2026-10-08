import { z } from "zod";

const monetaryValueSchema = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const typeSchema = z.enum(['charge', 'discount']);
const allocationTypeSchema = z.enum(['proportional', 'equal']);

export const createAdjustmentSchema = z.object({
    params: z.object({
        id: z.uuid()
    }),
    body: z.object({
        name: z.string().trim().nonempty(),
        type: typeSchema,
        amount: monetaryValueSchema,
        allocationType: allocationTypeSchema,
    })
});

export const updateAdjustmentSchema = z.object({
    params: z.object({
        id: z.uuid()
    }),
    body: z.object({
        name: z.string().trim().nonempty().optional(),
        type: typeSchema.optional(),
        amount: monetaryValueSchema.optional(),
        allocationType: allocationTypeSchema.optional()
    }).refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    )
});

export const adjustmentIdParamSchema = z.object({
    params: z.object({
        id: z.uuid()
    })
});