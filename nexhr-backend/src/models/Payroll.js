import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    month: { type: String, required: true }, // e.g., "June"
    year: { type: Number, required: true },  // e.g., 2026
    baseSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPayable: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "PROCESSED", "PAID"], default: "PENDING" },
    paymentDate: { type: Date }
  },
  { timestamps: true }
);

// Compound indexing ensures an employee can only have ONE payroll ledger entries per cycle
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ status: 1 });

const Payroll = mongoose.model("Payroll", payrollSchema);
export default Payroll;