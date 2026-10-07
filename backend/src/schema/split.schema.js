import { z } from "zod";

export const createSplitSchema = z.object({
    body: z.object({
        name: z.string().trim().nonempty(),
    }),
});

export const updateSplitSchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
    body: z.object({
        name: z.string().trim().nonempty(),
    }),
});

export const splitIdParamSchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
});