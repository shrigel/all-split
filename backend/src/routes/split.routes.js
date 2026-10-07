import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createSplitSchema, splitIdParamSchema, updateSplitSchema } from "../schema/split.schema.js";
import { createSplit, getSplit, updateSplit, deleteSplit } from "../controllers/split.controller.js";

const router = Router();

router.post("/", validate(createSplitSchema), createSplit);
router.get("/:id", validate(splitIdParamSchema), getSplit);
router.patch("/:id", validate(updateSplitSchema), updateSplit);
router.delete("/:id", validate(splitIdParamSchema), deleteSplit);

export default router;