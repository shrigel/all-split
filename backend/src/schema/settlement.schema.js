import { z } from "zod";

export const settlementIdSchema = z.object({
    params: z.object({
        id: z.uuid()
    })
});