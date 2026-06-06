import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import StatCard from "../../components/common/StatCard";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    employees: 0,
    presentToday: 0,
    openJobs: 0,
    aiScreened: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await apiClient.get("/dashboard/stats");
        if (data.success && data.data) {
          setMetrics(data.data);
        }
      } catch (err) {
        console.error("Dashboard telemetry synchronization failed:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 font-sans max-w-[1600px] mx-auto">
      {/* Top Welcome Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Welcome Back, Admin</h1>
          <p className="text-slate-400 text-sm mt-1">
            Here is what's happening across the NexHR cluster network operations today.
          </p>
        </div>
        <div className="text-xs font-mono bg-slate-950 text-indigo-400 border border-indigo-900/50 px-4 py-2 rounded-xl self-start md:self-center">
          System Status: <span className="text-emerald-400 font-bold animate-pulse">● ONLINE</span>
        </div>
      </div>

      {/* Grid of Interactive Telemetry Metric Counters */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Active Employees" value={metrics.employees.toString()} description="+2 added this week" />
          <StatCard title="Attendance Present Today" value={metrics.presentToday.toString()} description="Live workforce check-ins" />
          <StatCard title="Active Career Openings" value={metrics.openJobs.toString()} description="Target pipeline pipelines" />
          <StatCard title="AI Screened Resumes" value={metrics.aiScreened.toString()} description="Automated parsing score matrix" />
        </div>
      )}

      {/* Dual Section Grid: Splitting Data Views */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Action Audit Logging Feed */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white tracking-wide">Live Operations Stream</h3>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-400 px-2.5 py-1 rounded border border-indigo-900/40">Real-time</span>
          </div>

          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 divide-y divide-slate-800/40">
            <div className="flex gap-4 pt-3 items-start text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-lg shadow-emerald-400/50" />
              <div className="flex-1">
                <p className="text-slate-200 font-medium">Asynchronous AI parsing resolved score parameters</p>
                <p className="text-xs text-slate-500 mt-0.5">Candidate clearance pipeline updated successfully • 5m ago</p>
              </div>
            </div>

            <div className="flex gap-4 pt-3 items-start text-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-slate-200 font-medium">New employee file node initialized cleanly</p>
                <p className="text-xs text-slate-500 mt-0.5">Profile node mapped to user token database cluster • 1h ago</p>
              </div>
            </div>

            <div className="flex gap-4 pt-3 items-start text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-slate-200 font-medium">Database collection schema reset executed</p>
                <p className="text-xs text-slate-500 mt-0.5">Wiped stale test artifacts from MongoDB Atlas cloud engine • Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Strategic Organizational Indicators */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-4 tracking-wide">Department Allocation</h3>
            
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>ENGINEERING</span>
                  <span className="text-white font-bold">66%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: "66%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>HUMAN RESOURCES</span>
                  <span className="text-white font-bold">22%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "22%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>LEADERSHIP / EXEC</span>
                  <span className="text-white font-bold">12%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "12%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-xl text-xs text-indigo-300 leading-relaxed font-sans">
            💡 **Pro Tip:** Go to the *AI Candidate Screening* tab to ingest resume documents and see real-time database metric score streams.
          </div>
        </div>

      </div>
    </div>
  );
}