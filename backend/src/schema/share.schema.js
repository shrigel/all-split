import { z } from "zod";

export const shareTokenParamSchema = z.object({
    params: z.object({
        shareToken: z.string(),
    }),
});