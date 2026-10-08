import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { settlementIdSchema } from "../schema/settlement.schema.js";
import { getSettlement } from "../controllers/settlement.controller.js";

const router = Router();

router.get('/splits/:id/settlements', validate(settlementIdSchema), getSettlement);

export default router;