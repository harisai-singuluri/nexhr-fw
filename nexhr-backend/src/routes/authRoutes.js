import express from "express";
import { loginUser, refreshSession, register, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Existing endpoints
router.post("/register", register);
router.post("/login", loginUser);
router.post("/refresh", protect, refreshSession);

// 🚨 THE FIX: Add the logout POST endpoint
router.post("/logout", logoutUser);

export default router;