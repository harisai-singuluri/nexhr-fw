// src/layouts/AuthLayout.jsx
// Wraps public routes (login, forgot password).
// Renders the child page directly — the page itself owns its full-screen layout.

import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { ROUTES } from "../constants/routes";

export default function AuthLayout() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Already logged in? Skip the auth pages entirely.
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}