import { z } from "zod";

export const updateItemSharesSchema = z.object({
    params: z.object({
        id: z.uuid()
    }),
    body: z.object({
        participantIds: z.array(z.uuid()).min(1).refine(
            (ids) => new Set(ids).size === ids.length,
            {
                message: "Participant IDs must be unique",
            }
        )
    })
});