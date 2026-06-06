import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

// @desc    Get all employees (With lightning-fast cursor-like pagination)
// @route   GET /api/v1/employees
export const getAllEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const employees = await Employee.find()
      .populate("user", "name email role department avatar")
      .skip(skip)
      .limit(limit)
      .lean(); // .lean() converts to POJO, bypassing Mongoose overhead for raw speed

    const total = await Employee.countDocuments();

    res.json({
      employees,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new Employee profile & matching login credentials
// @route   POST /api/v1/employees
export const createEmployee = async (req, res) => {
  const { name, email, password, role, department, employeeId, designation, salary, phone, joiningDate } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists with this email" });

    // 1. Scaffold Core User Credential Entry
    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      permissions: role === "ADMIN" ? ["*"] : ["profile:self", "attendance:self"]
    });

    // 2. Map Professional Detailed HR Entity
    const employee = await Employee.create({
      user: user._id,
      employeeId,
      designation,
      salary,
      joiningDate,
      contact: { phone }
    });

    res.status(201).json({ employee, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: "Employee profile not found." });

    // Fetch today's record if it exists
    const todayRecord = await Attendance.findOne({ employee: employee._id, date: today }).lean();

    // Fetch the last 10 historical records for the feed
    const history = await Attendance.find({ employee: employee._id, date: { $ne: today } })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    res.json({
      ...todayRecord,
      history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};