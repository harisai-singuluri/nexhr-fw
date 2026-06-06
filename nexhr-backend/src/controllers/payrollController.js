import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

// @desc    Generate Payroll Statement for an employee based on daily attendance records
// @route   POST /api/v1/payroll/generate
export const generatePayroll = async (req, res) => {
  const { employeeId, month, year, allowances } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee parameters not found." });

    // 1. Tally attendance logs to compute unexpected unpaid leaves
    const totalPresentDays = await Attendance.countDocuments({
      employee: employeeId,
      date: { $regex: `^${year}-${month}` }, // Match cycle date formats
      status: { $in: ["PRESENT", "LATE"] }
    });

    // Simple payroll formula: Deduct 5% of base salary for every day short of a standard 20-day working month
    const standardDays = 20;
    let deductions = 0;
    if (totalPresentDays < standardDays) {
      const lossOfPayDays = standardDays - totalPresentDays;
      deductions = parseFloat(((employee.salary / standardDays) * lossOfPayDays).toFixed(2));
    }

    const netPayable = employee.salary + (allowances || 0) - deductions;

    const payroll = await Payroll.create({
      employee: employeeId,
      month,
      year,
      baseSalary: employee.salary,
      allowances,
      deductions,
      netPayable,
      status: "PROCESSED"
    });

    res.status(201).json(payroll);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Payroll statement already processed for this cycle." });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPayrollHistory = async (req, res) => {
  try {
    const history = await Payroll.find()
      .populate({
        path: "employee",
        populate: { path: "user", select: "name" }
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};