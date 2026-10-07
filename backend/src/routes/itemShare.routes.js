import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { updateItemSharesSchema } from "../schema/itemShare.schema.js";
import { updateItemShare } from "../controllers/itemShare.controller.js";

const router = Router();

router.put('/items/:id/shares', validate(updateItemSharesSchema), updateItemShare);

export default router;