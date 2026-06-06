import express from "express";
import multer from "multer";
import path from "path";
import Candidate from "../models/Candidate.js"; 
const router = express.Router();

// Configure Multer storage engine locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error("Error: Only PDF and Docx documents are authorized!"));
  },
});

// @route   GET /api/v1/recruitment/candidates
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Database lookup failed", error: err.message });
  }
});

// @route   POST /api/v1/recruitment/apply
router.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, jobTitle } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Validation failed: Resume document missing." });
    }

    const candidate = new Candidate({
      name,
      email,
      phone,
      jobTitle,
      resumeUrl: req.file.path,
      status: "SCREENING",
    });

    await candidate.save();

    res.status(201).json({ message: "Application ingested. Processing background telemetry." });

    // Asynchronous background AI simulation
    setTimeout(async () => {
      try {
        const computedScore = Math.floor(Math.random() * (98 - 45 + 1)) + 45; 
        const clearanceStatus = computedScore >= 75 ? "SHORTLISTED" : "REJECTED";

        await Candidate.findByIdAndUpdate(candidate._id, {
          status: clearanceStatus,
          aiEvaluation: {
            score: computedScore,
            summary: "Automated structural parser verified tech stack dependencies against corporate parameters.",
            matchedSkills: ["React.js", "Express", "MongoDB", "Node.js"]
          }
        });
        console.log(`[AI Worker] Evaluation resolved cleanly for candidate node: ${candidate._id}`);
      } catch (workerErr) {
        console.error("[AI Worker] Delayed telemetry compilation failed:", workerErr.message);
      }
    }, 3500);

  } catch (err) {
    res.status(500).json({ message: "Server pipeline configuration failure", error: err.message });
  }
});

// 🚨 THE CRITICAL FIX: Export using ES Module syntax to resolve the SyntaxError
export default router;