import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { adjustmentIdParamSchema, createAdjustmentSchema, updateAdjustmentSchema } from "../schema/adjustment.schema.js";
import { createAdjustment, deleteAdjustment, updateAdjustment } from "../controllers/adjustment.controller.js";

const router = Router();

router.post('/bills/:id/adjustments', validate(createAdjustmentSchema), createAdjustment);
router.patch('/adjustments/:id', validate(updateAdjustmentSchema), updateAdjustment);
router.delete('/adjustments/:id', validate(adjustmentIdParamSchema), deleteAdjustment);

export default router;