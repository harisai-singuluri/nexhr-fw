import express from "express";
import { submitReview, getReviews } from "../controllers/performanceController.js";
import { protect } from "../middleware/authMiddleware.js"; // Standard token tracking

const router = express.Router();

// Support both path pattern endpoints to resolve client-side apiClient routing variations
router.route("/")
  .get(protect, getReviews)
  .post(protect, submitReview);

router.route("/reviews")
  .get(protect, getReviews)
  .post(protect, submitReview);

export default router;