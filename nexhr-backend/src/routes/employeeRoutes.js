import express from "express";
import { getAllEmployees, createEmployee, getMyAttendance } from "../controllers/employeeController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/attendance/me", protect, getMyAttendance);

router.route("/")
  .get(protect, checkPermission("employees:read"), getAllEmployees)
  .post(protect, checkPermission("employees:write"), createEmployee);
export default router;