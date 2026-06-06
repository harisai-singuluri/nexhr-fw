import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    joiningDate: { type: Date, required: true },
    status: { type: String, enum: ["ACTIVE", "LEAVE", "TERMINATED"], default: "ACTIVE" },
    designation: { type: String, required: true, trim: true },
    salary: { type: Number, required: true },
    contact: {
      phone: { type: String, required: true },
      personalEmail: { type: String, lowercase: true, trim: true },
      address: String,
    },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    }
  },
  { timestamps: true }
);

// Performance compound indexes for lightning-fast search/pagination
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ status: 1 });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;