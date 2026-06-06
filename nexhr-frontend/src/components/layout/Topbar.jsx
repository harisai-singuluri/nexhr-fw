import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Topbar() {
  const { user } = useAuth();
  
  return (
    <header className="h-20 border-b border-slate-800/80 bg-slate-950/20 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40 font-sans">
      <div>
        <h2 className="text-slate-400 text-xs tracking-wider uppercase font-mono">
          Enterprise Node Operational Workspace
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Environment Cluster Indicator Pin */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Cluster Online
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-slate-300">
            Welcome, <span className="text-white font-semibold">{user?.name || "Team Member"}</span>
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Dept: {user?.department || "General"}
          </p>
        </div>
      </div>
    </header>
  );
}