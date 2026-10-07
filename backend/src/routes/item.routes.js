import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createItemSchema, updateItemSchema, itemIdParamSchema } from "../schema/item.schema.js";
import { createItem, updateItem, deleteItem } from "../controllers/item.controller.js";

const router = Router();

router.post("/bills/:id/items", validate(createItemSchema), createItem);
router.patch("/items/:id", validate(updateItemSchema), updateItem);
router.delete("/items/:id", validate(itemIdParamSchema), deleteItem);

export default router;