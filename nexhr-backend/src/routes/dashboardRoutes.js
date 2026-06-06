import express from "express";
import Employee from "../models/Employee.js";
import Candidate from "../models/Candidate.js";
import Attendance from "../models/Attendance.js"; 

const router = express.Router();

// @route   GET /api/v1/dashboard/stats
router.get("/stats", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Concurrent database tracking lookups
    const [totalEmployees, presentToday, totalCandidates] = await Promise.all([
      Employee.countDocuments({ status: "ACTIVE" }).catch(() => 0),
      Attendance.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: "PRESENT"
      }).catch(() => 0),
      Candidate.countDocuments().catch(() => 0)
    ]);

    res.status(200).json({
      success: true,
      data: {
        employees: totalEmployees,
        presentToday: presentToday,
        openJobs: 3, // Safe placeholder fallback constant
        aiScreened: totalCandidates
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to compile dashboard metrics", 
      error: err.message 
    });
  }
});

export default router;