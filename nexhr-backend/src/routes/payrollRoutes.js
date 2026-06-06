import express from "express";
import { generatePayroll, getPayrollHistory } from "../controllers/payrollController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/generate", protect, checkPermission("payroll:write"), generatePayroll);
router.get("/history", protect, checkPermission("payroll:read"), getPayrollHistory);

export default router;