import express from "express";
import Attendance from "../models/Attendance.js";
import { protect } from "../middleware/authMiddleware.js";const router = express.Router();

// @route   GET /api/v1/attendance/me
// @desc    Retrieve today's shift log and historical context array concurrently
router.get("/me", protect, async (req, res) => {
  try {
    const userId = req.user._id; // Extracted dynamically from your auth verification token
    const todayStr = new Date().toISOString().split("T")[0];

    // Find today's check-in parameter
    const currentRecord = await Attendance.findOne({ employeeId: userId, date: todayStr });

    // Fetch the rest of historical distributions
    const history = await Attendance.find({ employeeId: userId, date: { $ne: todayStr } })
                                    .sort({ createdAt: -1 })
                                    .limit(10);

    res.status(200).json({
      date: currentRecord ? currentRecord.date : todayStr,
      checkIn: currentRecord ? currentRecord.checkIn : null,
      checkOut: currentRecord ? currentRecord.checkOut : null,
      status: currentRecord ? currentRecord.status : "OFF_DUTY",
      workHours: currentRecord ? currentRecord.workHours.toFixed(2) : "0.00",
      history: history || []
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance dataset.", error: err.message });
  }
});

// @route   POST /api/v1/attendance/clock-in
// @desc    Initialize a new active work shift node
router.post("/clock-in", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();

    // Policy condition evaluation: check if the shift has already been recorded
    const existingPunch = await Attendance.findOne({ employeeId: userId, date: todayStr });
    if (existingPunch) {
      return res.status(400).json({ message: "Shift parameters already initialized for today." });
    }

    // Evaluate Late Arrival policy (10:00 AM Max Threshold check)
    const baselineLimit = new Date();
    baselineLimit.setHours(10, 0, 0, 0);
    const trackingStatus = now > baselineLimit ? "LATE" : "PRESENT";

    const newShift = new Attendance({
      employeeId: userId,
      date: todayStr,
      checkIn: now,
      status: trackingStatus
    });

    await newShift.save();

    res.status(201).json({
      date: newShift.date,
      checkIn: newShift.checkIn,
      checkOut: null,
      status: newShift.status,
      workHours: "Active"
    });
  } catch (err) {
    res.status(500).json({ message: "Clock-In transaction processing aborted.", error: err.message });
  }
});

// @route   PUT /api/v1/attendance/clock-out
// @desc    Conclude shifting timeline tracking windows and compute durations
router.put("/clock-out", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();

    const record = await Attendance.findOne({ employeeId: userId, date: todayStr });
    if (!record) {
      return res.status(404).json({ message: "No active shifting sequence initiated to clock out of." });
    }
    if (record.checkOut) {
      return res.status(400).json({ message: "Shift timeline already explicitly concluded." });
    }

    // Telemetry duration differential matching calculation (Hours = Milliseconds / 1000 / 60 / 60)
    const timeDeltaMs = now.getTime() - record.checkIn.getTime();
    const parsedHours = Math.max(0, timeDeltaMs / (1000 * 60 * 60));

    record.checkOut = now;
    record.workHours = parsedHours;
    await record.save();

    res.status(200).json({
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      workHours: record.workHours.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: "Clock-Out compilation processing failed.", error: err.message });
  }
});

export default router;