import apiClient from "../../services/apiClient";

// ─────────────────────────────────────────────────────────────────────────────
// Mock users — swap this out once your backend is live.
// Structure mirrors what your real API should return.
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_USERS = [
  {
    id: "u-001",
    name: "Arjun Sharma",
    email: "admin@nexhr.com",
    password: "admin123",
    role: "ADMIN",
    department: "Leadership",
    avatar: null,
    permissions: ["*"],                    // wildcard = all permissions
  },
  {
    id: "u-002",
    name: "Priya Mehta",
    email: "hr@nexhr.com",
    password: "demo123",
    role: "HR",
    department: "Human Resources",
    avatar: null,
    permissions: ["employees:read", "employees:write", "payroll:read", "attendance:*", "recruitment:*"],
  },
  {
    id: "u-003",
    name: "Rahul Verma",
    email: "manager@nexhr.com",
    password: "demo123",
    role: "MANAGER",
    department: "Engineering",
    avatar: null,
    permissions: ["employees:read", "attendance:read", "performance:*"],
  },
  {
    id: "u-004",
    name: "Sneha Kapoor",
    email: "employee@nexhr.com",
    password: "demo123",
    role: "EMPLOYEE",
    department: "Design",
    avatar: null,
    permissions: ["profile:self", "attendance:self", "payslip:self"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH !== "false";

const authService = {
  // ── Login ──────────────────────────────────────────────────────────────────
  async login({ email, password }) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 900)); // simulate network

      const match = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!match) throw new Error("Invalid email or password.");

      const { password: _pw, ...safeUser } = match;
      const token = `mock-jwt-${safeUser.id}-${Date.now()}`;

      return { user: safeUser, token };
    }

    // Real API call
    const { data } = await apiClient.post("/auth/login", { email, password });
    return data; // expects { user, token }
  },

  // ── Logout ─────────────────────────────────────────────────────────────────
  async logout() {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return;
    }
    await apiClient.post("/auth/logout");
  },

  // ── Refresh token ──────────────────────────────────────────────────────────
  async refreshToken() {
    if (USE_MOCK) {
      // In mock mode, restore session from localStorage
      const raw = localStorage.getItem("hrms_user");
      const token = localStorage.getItem("hrms_token");
      if (!raw || !token) throw new Error("No session found.");
      return { user: JSON.parse(raw), token };
    }

    const { data } = await apiClient.post("/auth/refresh");
    return data;
  },

  // ── Forgot password ────────────────────────────────────────────────────────
  async forgotPassword(email) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 700));
      const exists = MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!exists) throw new Error("No account found with that email.");
      return { message: "Reset link sent to your email." };
    }
    const { data } = await apiClient.post("/auth/forgot-password", { email });
    return data;
  },

  // ── Reset password ─────────────────────────────────────────────────────────
  async resetPassword({ token, password }) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      return { message: "Password reset successfully." };
    }
    const { data } = await apiClient.post("/auth/reset-password", { token, password });
    return data;
  },
  // ── Register ───────────────────────────────────────────────────────────────
  async register(userData) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 900)); // simulate network delay

      // Check if user already exists in mock data
      const exists = MOCK_USERS.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (exists) throw new Error("User already exists.");

      // Create a mock layout payload
      const newUser = {
        id: `u-${Math.floor(Math.random() * 1000)}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || "EMPLOYEE",
        department: userData.department || "General",
        avatar: null,
        permissions: userData.role === "ADMIN" ? ["*"] : ["profile:self", "attendance:self"]
      };

      const token = `mock-jwt-${newUser.id}-${Date.now()}`;
      return { user: newUser, token };
    }

    // Real API call targeting your live Render cloud database!
    const { data } = await apiClient.post("/auth/register", userData);
    return data; // expects { success: true, user, token }
  },
};

export default authService;