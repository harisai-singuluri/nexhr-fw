import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    jobTitle: { type: String, required: true },
    resumeUrl: { type: String }, 
    status: { 
      type: String, 
      enum: ["SCREENING", "SHORTLISTED", "REJECTED"], 
      default: "SCREENING" 
    },
    aiEvaluation: {
      score: { type: Number, default: 0 },
      summary: { type: String, default: "" },
      matchedSkills: [{ type: String }]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", CandidateSchema);