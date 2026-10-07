import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createParticipantSchema, participantIdParamSchema, updateParticipantSchema } from "../schema/participant.schema.js";
import { createParticipant, updateParticipant, deleteParticipant } from "../controllers/participant.controller.js";

const router = Router();

router.post("/splits/:id/participants", validate(createParticipantSchema), createParticipant);
router.patch("/participants/:id", validate(updateParticipantSchema), updateParticipant);
router.delete("/participants/:id", validate(participantIdParamSchema), deleteParticipant);

export default router;