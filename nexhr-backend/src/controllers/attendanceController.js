import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// @desc    Clock-In Action
// @route   POST /api/v1/attendance/clock-in
export const clockIn = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: "Employee profile configuration missing." });

    const attendanceRecord = await Attendance.create({
      employee: employee._id,
      date: today,
      checkIn: new Date(),
      status: new Date().getHours() >= 10 ? "LATE" : "PRESENT" // Custom flag for 10:00 AM standard policy
    });

    res.status(201).json(attendanceRecord);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already clocked in for today." });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clock-Out Action & Auto Work Hour Metric Computation
// @route   PUT /api/v1/attendance/clock-out
export const clockOut = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: "Employee parameters not found." });

    const record = await Attendance.findOne({ employee: employee._id, date: today });
    if (!record) return res.status(400).json({ message: "No shift verification logs found for today." });
    if (record.checkOut) return res.status(400).json({ message: "You have already clocked out for today." });

    record.checkOut = new Date();
    
    // Exact structural hour calculation mathematical step
    const diffMs = record.checkOut - record.checkIn;
    record.workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};