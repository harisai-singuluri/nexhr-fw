import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { ROLE_COLORS, ROLE_LABELS } from "../../constants/roles";

export default function Sidebar() {
  const { user, role, logout, isAtLeast, isAdmin } = useAuth();

  const navItems = [
    { label: "Dashboard", path: ROUTES.DASHBOARD, minRole: "EMPLOYEE" },
    { label: "Attendance", path: ROUTES.ATTENDANCE, minRole: "EMPLOYEE" },
    { label: "Performance", path: ROUTES.PERFORMANCE, minRole: "EMPLOYEE" },
    { label: "Employee Directory", path: ROUTES.EMPLOYEES, minRole: "HR" },
    { label: "Payroll Ledger", path: ROUTES.PAYROLL, minRole: "HR" },
    { label: "Recruitment Tracker", path: ROUTES.RECRUITMENT, minRole: "HR" },
    { label: "AI Screening Hub", path: ROUTES.AI_SCREENING, minRole: "HR" },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 font-sans">
      <div className="p-6 flex-1 flex flex-col">
        {/* Branding Title Block */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white font-bold tracking-wide text-lg">NexHR</span>
        </div>

        {/* Links Navigation Matrix */}
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            if (item.minRole && !isAtLeast(item.minRole)) return null;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 border
                  ${isActive 
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/15 font-semibold" 
                    : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }
                `}
              >
                {item.label}
              </NavLink>
            );
          })}
          {isAdmin && (
            <NavLink
              to={ROUTES.SETTINGS}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 border
                ${isActive ? "bg-indigo-600 border-indigo-500 text-white" : "text-slate-400 hover:bg-slate-800/60"}
              `}
            >
              System Settings
            </NavLink>
          )}
        </nav>
      </div>

      {/* User Session Profile Box */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 uppercase">
            {user?.name ? user.name.substring(0, 2) : "HR"}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{user?.name}</h4>
            <span className={`inline-block text-[10px] px-2 py-0.5 mt-0.5 rounded-full border font-mono tracking-wider ${ROLE_COLORS[role] || "text-slate-400"}`}>
              {ROLE_LABELS[role] || "User"}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/5 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all"
        >
          Sign out session
        </button>
      </div>
    </aside>
  );
}