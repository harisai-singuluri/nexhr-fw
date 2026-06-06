import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../features/auth/authSlice";
import { ROLE_HIERARCHY } from "../constants/roles";
import { ROUTES } from "../constants/routes";

/**
 * ProtectedRoute
 *
 * Wraps any set of routes that require authentication (and optionally a
 * minimum role level). Unauthenticated visitors are redirected to /login,
 * authenticated users who lack the required role see an "Unauthorised" page.
 *
 * Props
 * ─────
 * @param {string}   [minimumRole]   - Minimum role required (uses ROLE_HIERARCHY).
 *                                     Omit to allow any authenticated user.
 * @param {string[]} [allowedRoles]  - Exact role list. Overrides minimumRole if both supplied.
 * @param {string}   [redirectTo]    - Override the redirect destination (default: /login).
 *
 * Usage examples
 * ──────────────
 * // Any logged-in user
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 *
 * // HR or above
 * <Route element={<ProtectedRoute minimumRole="HR" />}>
 *   <Route path="/payroll" element={<Payroll />} />
 * </Route>
 *
 * // Exact roles
 * <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
 *   <Route path="/settings" element={<Settings />} />
 * </Route>
 */
export default function ProtectedRoute({
  minimumRole,
  allowedRoles,
  redirectTo = ROUTES.LOGIN,
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const location = useLocation();

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}   // so LoginPage can redirect back after login
        replace
      />
    );
  }

  // ── Role check (exact list takes priority) ─────────────────────────────────
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      return <Navigate to={ROUTES.UNAUTHORISED} replace />;
    }
  } else if (minimumRole) {
    const userLevel = ROLE_HIERARCHY[role] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] ?? 0;
    if (userLevel < requiredLevel) {
      return <Navigate to={ROUTES.UNAUTHORISED} replace />;
    }
  }

  return <Outlet />;
}