import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  logoutUser,
  clearError,
  selectUser,
  selectToken,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectUserRole,
} from "../features/auth/authSlice";
import { ROLES, ROLE_HIERARCHY } from "../constants/roles";
import { ROUTES } from "../constants/routes";

/**
 * useAuth — central hook for all auth operations.
 *
 * Usage:
 *   const { user, isAuthenticated, login, logout, hasPermission, isRole } = useAuth();
 */
export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  // ── Actions ──────────────────────────────────────────────────────────────

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.LOGIN, { replace: true });
  }, [dispatch, navigate]);

  const dismissError = useCallback(() => dispatch(clearError()), [dispatch]);

  // ── Permission helpers ────────────────────────────────────────────────────

  /**
   * Check if the current user has a specific permission string.
   * Supports wildcard "*" (admin) and scoped wildcards like "attendance:*".
   *
   * @param {string} permission  e.g. "payroll:read", "employees:write"
   */
  const hasPermission = useCallback(
    (permission) => {
      if (!user?.permissions) return false;
      if (user.permissions.includes("*")) return true;

      const [scope] = permission.split(":");
      if (user.permissions.includes(`${scope}:*`)) return true;

      return user.permissions.includes(permission);
    },
    [user]
  );

  /**
   * Check if the user's role meets a minimum hierarchy level.
   * Roles ranked: ADMIN > HR > MANAGER > EMPLOYEE
   *
   * @param {string} minimumRole  e.g. ROLES.MANAGER
   */
  const isAtLeast = useCallback(
    (minimumRole) => {
      if (!role) return false;
      return (ROLE_HIERARCHY[role] ?? 0) >= (ROLE_HIERARCHY[minimumRole] ?? 0);
    },
    [role]
  );

  /**
   * Exact role match.
   * @param {string|string[]} roles
   */
  const isRole = useCallback(
    (roles) => {
      if (!role) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(role);
    },
    [role]
  );

  return {
    user,
    token,
    role,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    dismissError,
    hasPermission,
    isAtLeast,
    isRole,
    // Convenience booleans
    isAdmin: role === ROLES.ADMIN,
    isHR: role === ROLES.HR,
    isManager: role === ROLES.MANAGER,
    isEmployee: role === ROLES.EMPLOYEE,
  };
}