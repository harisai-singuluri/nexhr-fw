import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/v1/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let permissions = ["profile:self", "attendance:self"];
    if (role === "ADMIN") permissions = ["*"];
    if (role === "HR") permissions = ["employees:read", "employees:write", "payroll:read", "attendance:*", "recruitment:*"];
    if (role === "MANAGER") permissions = ["employees:read", "attendance:read", "performance:*"];

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "EMPLOYEE",
      department: department || "General",
      permissions
    });

    return res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        permissions: user.permissions
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// Inside your auth controller file (e.g., src/controllers/authController.js)

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide an email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        permissions: user.permissions || []
      }
    });
  } catch (error) {
    console.error("🔥 Hidden Backend Login Crash Logged:", error.stack);

    // 🚨 FORCE CORS HEADERS TO STAY ATTACHED DURING A SEVERE CRASH
    const requestOrigin = req.headers.origin;
    if (requestOrigin) {
      res.header("Access-Control-Allow-Origin", requestOrigin);
      res.header("Access-Control-Allow-Credentials", "true");
    }

    return res.status(500).json({ 
      success: false,
      message: "Internal login controller breakdown", 
      error: error.message 
    });
  }
};

// @desc    Get current session profile / Verify Token (FIXES THE SYNTAX ERROR)
// @route   POST /api/v1/auth/refresh
export const refreshSession = async (req, res) => {
  try {
    // req.user is attached upstream by your protect middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, session user missing" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      return res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          permissions: user.permissions || []
        }
      });
    } else {
      return res.status(404).json({ message: "User session node not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear session tracking
// @route   POST /api/v1/auth/logout
export const logoutUser = async (req, res) => {
  try {
    // If you are storing JWTs in HTTP-Only cookies, clear them here:
    // res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    
    return res.status(200).json({
      success: true,
      message: "Session terminated successfully. Device token invalidated."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};