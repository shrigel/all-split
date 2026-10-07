import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { billIdParamSchema, createBillSchema, updateBillSchema } from "../schema/bill.schema.js";
import { splitIdParamSchema } from "../schema/split.schema.js";
import { createBill, updateBill, deleteBill, getBills } from "../controllers/bill.controller.js";

const router = Router();

router.post("/splits/:id/bills", validate(createBillSchema), createBill);
router.get("/splits/:id/bills", validate(splitIdParamSchema), getBills);
router.patch("/bills/:id", validate(updateBillSchema), updateBill);
router.delete("/bills/:id", validate(billIdParamSchema), deleteBill);

export default router;