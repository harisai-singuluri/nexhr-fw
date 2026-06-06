// src/constants/roles.js

/**
 * Role identifiers — single source of truth.
 * Always import from here; never hardcode "ADMIN" strings.
 */
export const ROLES = {
  ADMIN:    "ADMIN",
  HR:       "HR",
  MANAGER:  "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};

/**
 * Hierarchy values — higher = more access.
 * Used by ProtectedRoute and useAuth.isAtLeast().
 */
export const ROLE_HIERARCHY = {
  [ROLES.EMPLOYEE]: 1,
  [ROLES.MANAGER]:  2,
  [ROLES.HR]:       3,
  [ROLES.ADMIN]:    4,
};

/**
 * Human-readable labels for display in UI.
 */
export const ROLE_LABELS = {
  [ROLES.ADMIN]:    "Administrator",
  [ROLES.HR]:       "HR Manager",
  [ROLES.MANAGER]:  "Team Manager",
  [ROLES.EMPLOYEE]: "Employee",
};

/**
 * Badge color classes (Tailwind) per role.
 */
export const ROLE_COLORS = {
  [ROLES.ADMIN]:    "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  [ROLES.HR]:       "bg-violet-500/15 text-violet-400 border-violet-500/25",
  [ROLES.MANAGER]:  "bg-blue-500/15 text-blue-400 border-blue-500/25",
  [ROLES.EMPLOYEE]: "bg-slate-500/15 text-slate-400 border-slate-500/25",
};