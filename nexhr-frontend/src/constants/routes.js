// src/constants/routes.js

/**
 * All route path strings — import everywhere instead of hardcoding "/payroll" etc.
 */
export const ROUTES = {
  // Auth
  LOGIN:           "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD:  "/reset-password",

  // Core
  DASHBOARD:       "/dashboard",

  // HR modules
  EMPLOYEES:       "/employees",
  EMPLOYEE_DETAIL: "/employees/:id",
  ATTENDANCE:      "/attendance",
  PAYROLL:         "/payroll",
  PERFORMANCE:     "/performance",
  RECRUITMENT:     "/recruitment",
  TRAINING:        "/training",
  REPORTS:         "/reports",

  // AI
  AI_SCREENING:    "/ai/screening",
  AI_INSIGHTS:     "/ai/insights",

  // Admin
  SETTINGS:        "/settings",

  // Utility
  UNAUTHORISED:    "/unauthorised",
  NOT_FOUND:       "*",
};

/** Helper to build a dynamic route string */
export const buildRoute = (route, params = {}) => {
  return Object.entries(params).reduce(
    (path, [key, val]) => path.replace(`:${key}`, val),
    route
  );
};
// e.g. buildRoute(ROUTES.EMPLOYEE_DETAIL, { id: "u-001" }) → "/employees/u-001"