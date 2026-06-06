import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    employeeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee", 
      required: true 
    },
    date: { 
      type: String, // Kept as YYYY-MM-DD for easy text mapping lookups
      required: true 
    },
    checkIn: { 
      type: Date, 
      required: true 
    },
    checkOut: { 
      type: Date 
    },
    workHours: { 
      type: Number, 
      default: 0 
    },
    status: { 
      type: String, 
      enum: ["PRESENT", "ABSENT", "LATE"], 
      default: "PRESENT" 
    }
  },
  { timestamps: true }
);

// Formulate a compound index to prevent duplicate punch errors for the same day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);