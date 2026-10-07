import { z } from "zod";

export const createParticipantSchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
    body: z.object({
        name: z.string().trim().nonempty(),
    }),
});

export const updateParticipantSchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
    body: z.object({
        name: z.string().trim().nonempty(),
    }),
})

export const participantIdParamSchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
})