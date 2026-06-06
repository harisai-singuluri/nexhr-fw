import React from "react";

export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
      {/* Background soft ambient hover glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300" />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium tracking-wide mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-white tracking-tight font-sans">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-indigo-400 group-hover:text-indigo-300 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}