import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Manager/HR executing the review
    reviewCycle: { type: String, required: true }, // e.g., "Q2-2026"
    ratings: {
      technicalSkills: { type: Number, min: 1, max: 5, required: true },
      communication: { type: Number, min: 1, max: 5, required: true },
      delivery: { type: Number, min: 1, max: 5, required: true },
    },
    averageScore: { type: Number, required: true },
    feedback: { type: String, required: true },
    goals: [{ type: String }] // Dynamic list of expectations for the next cycle
  },
  { timestamps: true }
);

performanceSchema.index({ employee: 1, reviewCycle: 1 }, { unique: true });

const Performance = mongoose.model("Performance", performanceSchema);
export default Performance;