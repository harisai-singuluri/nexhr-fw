import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Auto-converts inputs to lowercase to prevent casing duplicates
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "ADMIN",     // 🚨 Changed to uppercase to match frontend constants
        "HR",
        "MANAGER",
        "EMPLOYEE",
      ],
      default: "EMPLOYEE",
    },
    
    department: {
      type: String,
      default: "General",
    },

    permissions: [
      {
        type: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

// High-speed index to preserve sub-second response times across large directories
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);