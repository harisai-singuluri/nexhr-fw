import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../constants/routes";
import { ROLES } from "../constants/roles";

// ── Layouts ───────────────────────────────────────────────────────────────────
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

// ── Lazy pages ────────────────────────────────────────────────────────────────
const LoginPage         = lazy(() => import("../features/auth/LoginPage"));
// 🚨 THE ADDITION: Lazy load your newly created registration page component
const RegisterPage      = lazy(() => import("../features/auth/RegisterPage")); 
const ForgotPassword    = lazy(() => import("../features/auth/ForgotPassword"));
const DashboardPage     = lazy(() => import("../features/dashboard/DashboardPage"));
const EmployeeListPage  = lazy(() => import("../features/employees/EmployeeListPage"));
const EmployeeDetail    = lazy(() => import("../features/employees/EmployeeListPage"));
const AttendancePage    = lazy(() => import("../features/attendance/AttendancePage"));
const PayrollPage       = lazy(() => import("../features/payroll/PayrollPage"));
const PerformancePage   = lazy(() => import("../features/performance/PerformancePage"));
const RecruitmentPage   = lazy(() => import("../features/recruitment/RecruitmentPage"));
const ResumeScreener    = lazy(() => import("../features/ai/AIScreeningPage"));
const ReportsPage       = lazy(() => import("../features/reports/"));
const SettingsPage      = lazy(() => import("../features/settings/SettingsPage"));
const UnauthorisedPage  = lazy(() => import("../features/auth/UnauthorisedPage"));
const NotFoundPage      = lazy(() => import("../features/auth/NotFoundPage"));

// ── Page loader fallback ──────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading…</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Public routes (no auth needed) ── */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN}           element={<LoginPage />} />
          {/* 🚨 THE FIX: Register the path cleanly inside your public auth shell layout */}
          <Route path="/register"              element={<RegisterPage />} /> 
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        {/* ── Protected: any authenticated user ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD}   element={<DashboardPage />} />
            <Route path={ROUTES.ATTENDANCE}  element={<AttendancePage />} />
            <Route path={ROUTES.PERFORMANCE} element={<PerformancePage />} />
          </Route>
        </Route>

        {/* ── Protected: HR and above ── */}
        <Route element={<ProtectedRoute minimumRole={ROLES.HR} />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.EMPLOYEES}        element={<EmployeeListPage />} />
            <Route path={ROUTES.EMPLOYEE_DETAIL}  element={<EmployeeDetail />} />
            <Route path={ROUTES.PAYROLL}          element={<PayrollPage />} />
            <Route path={ROUTES.RECRUITMENT}      element={<RecruitmentPage />} />
            <Route path={ROUTES.AI_SCREENING}     element={<ResumeScreener />} />
            <Route path={ROUTES.REPORTS}          element={<ReportsPage />} />
          </Route>
        </Route>

        {/* ── Protected: Admin only ── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
        </Route>

        {/* ── Utility routes ── */}
        <Route path={ROUTES.UNAUTHORISED} element={<UnauthorisedPage />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Suspense>
  );
}