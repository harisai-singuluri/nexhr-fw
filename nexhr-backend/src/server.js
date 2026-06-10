import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import recruitmentRoutes from "./routes/recruitmentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "https://nexhr-fw.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
].map((origin) => origin.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS origin denied: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
};

app.use(cors(corsOptions));

// 2. Add this immediately below the configuration block to auto-resolve browser preflight handshakes
// 3. BODY PARSING MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚨 CRITICAL: Automatically create local directory path for resume file safety
const uploadDirectory = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// 📡 Request Logger Middleware
app.use((req, res, next) => {
  console.log(`📡 Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Mounted Core Business Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/payroll", payrollRoutes);
app.use("/api/v1/performance", performanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/v1/recruitment", recruitmentRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NexHR API Running",
  });
});

// 🚨 Explicit 404 JSON Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found on this server: ${req.method} ${req.url}`
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});