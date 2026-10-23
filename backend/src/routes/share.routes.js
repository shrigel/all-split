import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createResultShare, getResultShare } from "../controllers/share.controller.js";
import { splitIdParamSchema } from "../schema/split.schema.js";
import { shareTokenParamSchema } from "../schema/share.schema.js";

const router = Router();

router.post('/splits/:id/result-shares', validate(splitIdParamSchema), createResultShare);
router.get('/result-shares/:shareToken', validate(shareTokenParamSchema), getResultShare);

export default router;