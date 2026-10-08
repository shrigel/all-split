import { z } from "zod";

export const createBillSchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
    body: z.object({
        name: z.string().trim().nonempty(),
        payerId: z.uuid()
    }),
});

export const updateBillSchema = z.object({
    params: z.object({
        id: z.uuid()
    }),
    body: z.object({
        name: z.string().trim().nonempty().optional(),
        payerId: z.uuid().optional()
    }).refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    ),
});

export const billIdParamSchema = z.object({
    params: z.object({
        id: z.uuid()
    }),
});