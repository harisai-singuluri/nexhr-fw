import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

      // Fetch user data and exclude the password hash
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token validation failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing." });
  }
};

// ── Check Permission Middleware (Fixes the syntax error) ──────────────────────
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No session found." });
    }

    // Admins have wildcard "*" access — let them pass immediately
    if (req.user.permissions && req.user.permissions.includes("*")) {
      return next();
    }

    // Check for explicit string match (e.g., "employees:read")
    if (req.user.permissions && req.user.permissions.includes(requiredPermission)) {
      return next();
    }

    // Check for scoped wildcard match (e.g., matching "employees:*" when user has "employees:read")
    const [scope] = requiredPermission.split(":");
    if (req.user.permissions && req.user.permissions.includes(`${scope}:*`)) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: Insufficient privileges." });
  };
};
