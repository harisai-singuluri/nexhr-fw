import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import StatCard from "../../components/common/StatCard";

export default function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Live Chronometer ticking clock execution logic loop
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Synchronization fetch call to check state mapping matching on mount
  const fetchTodayStatus = async () => {
    try {
      // Adjusted endpoint matches backend path cleanly
      const { data } = await apiClient.get("/attendance/me");
      if (data) {
        setCurrentRecord(data.currentRecord);
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("No active tracking session verified for today node yet.");
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  // 3. Request router pipeline access for Start Shift channel
  const handleClockIn = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await apiClient.post("/attendance/clock-in");
      if (data.success) {
        setCurrentRecord(data.record);
        setMessage({ type: "success", text: "Shift registered successfully. Welcome to work!" });
        fetchTodayStatus(); // Dynamically updates ledger tables
      }
    } catch (err) {
      const errorText = err.response?.data?.message || err.message || "Failed to execute clock-in.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  // 4. Request router pipeline access for End Shift channel
  const handleClockOut = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await apiClient.put("/attendance/clock-out");
      if (data.success) {
        setCurrentRecord(data.record);
        setMessage({ type: "success", text: "Shift concluded cleanly. Have a great evening!" });
        fetchTodayStatus();
      }
    } catch (err) {
      const errorText = err.response?.data?.message || err.message || "Failed to execute clock-out.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Attendance Tracking Station</h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time entry verification, shift calculation, and telemetry recording.
        </p>
      </div>

      {/* Dynamic Metric Cards Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          title="Current Shift Duration" 
          value={currentRecord ? `${currentRecord.workHours || "Active"} hrs` : "0.00 hrs"} 
        />
        <StatCard 
          title="Shift Operational Status" 
          value={currentRecord ? currentRecord.status : "OFF_DUTY"} 
        />
        <StatCard 
          title="Daily Check-In Policy" 
          value="10:00 AM Max" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Chronometer Controller Panel */}
        <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl text-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-slate-400 font-mono text-xs uppercase tracking-wider">
              System Chronometer
            </h3>
            <div className="text-4xl font-bold text-white font-mono tracking-tight">
              {currentTime.toLocaleTimeString()}
            </div>
            <p className="text-xs text-slate-500">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <hr className="border-slate-800/80" />

          {/* Contextual Action Buttons depending on Shift Status states */}
          <div className="space-y-3">
            {!currentRecord ? (
              <button
                onClick={handleClockIn}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? "Registering..." : "Clock In / Start Shift"}
              </button>
            ) : !currentRecord.checkOut ? (
              <button
                onClick={handleClockOut}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-red-600/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? "Concluding..." : "Clock Out / Conclude Shift"}
              </button>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl text-sm text-emerald-400 font-mono font-bold tracking-wide">
                🎉 Shift completed for today.
              </div>
            )}
          </div>

          {message.text && (
            <p className={`text-xs p-3 rounded-xl border font-medium ${message.type === "error" ? "bg-red-500/10 border-red-500/25 text-red-400" : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"}`}>
              {message.text}
            </p>
          )}
        </div>

        {/* Right Side: Ledger Verification Feed Tables */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">Recent Log Entries</h3>
            <p className="text-xs text-slate-500 mt-0.5">Your verified historical check-in distributions.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/40">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Clock In</th>
                  <th className="p-4">Clock Out</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {/* Render Today's Active Live Row dynamically if it exists */}
                {currentRecord && (
                  <tr className="bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-white">
                      {currentRecord.date} 
                      <span className="text-[10px] bg-indigo-600 text-white font-mono px-1.5 py-0.5 rounded ml-2 font-bold tracking-wide animate-pulse">TODAY</span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-200">
                      {currentRecord.checkIn ? new Date(currentRecord.checkIn).toLocaleTimeString() : "--:--:--"}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-200">
                      {currentRecord.checkOut ? new Date(currentRecord.checkOut).toLocaleTimeString() : "--:--:--"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block text-xs font-bold font-mono px-2.5 py-0.5 rounded-xl border ${currentRecord.status === "PRESENT" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-amber-500/10 text-amber-400 border-amber-500/25"}`}>
                        {currentRecord.status}
                      </span>
                    </td>
                  </tr>
                )}
                {/* Fallback empty message condition */}
                {history.length === 0 && !currentRecord ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-slate-500 font-mono text-xs">
                      No historical parameters logged within this environment node.
                    </td>
                  </tr>
                ) : (
                  // Map older history arrays cleanly
                  history.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 pl-6 font-medium text-slate-400 font-mono text-xs">{log.date}</td>
                      <td className="p-4 font-mono text-xs text-slate-400">
                        {log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : "Missing"}
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-400">
                        {log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : "Missing"}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block text-xs font-semibold font-mono px-2.5 py-0.5 rounded-xl border ${log.status === "PRESENT" ? "bg-emerald-500/5 text-emerald-500/30 border-emerald-500/15" : "bg-amber-500/5 text-amber-500/30 border-amber-500/15"}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}