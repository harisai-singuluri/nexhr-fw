import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import StatCard from "../../components/common/StatCard";

export default function PerformancePage() {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State aligned perfectly with the backend validation constraints
  const [formData, setFormData] = useState({
    employeeId: "",
    reviewCycle: "Q2-2026", // Updated key format to match 'reviewCycle' constraints
    technicalSkills: 5,
    communication: 5,
    delivery: 5,
    feedback: "",
    goals: "" // Handled locally as text and split into arrays upon database write
  });

  // 1. Data Retrieval Sync Engine
  const fetchData = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      // Parallel routing aggregation queries
      const [empRes, perfRes] = await Promise.all([
        apiClient.get("/employees?limit=100"),
        apiClient.get("/performance/reviews").catch(() => ({ data: [] }))
      ]);
      
      // Clean data extraction checking all variations of payload wraps
      const employeeList = empRes.data?.employees || empRes.data?.data || empRes.data || [];
      setEmployees(Array.isArray(employeeList) ? employeeList : []);
      
      // The backend controller returns normalized arrays directly
      setReviews(perfRes.data?.data || perfRes.data || []);
    } catch (err) {
      console.error("Performance metric synchronization mismatch:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Submit Action Payload Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.feedback) return;

    setSubmitting(true);
    setErrorMessage("");
    
    // Split text line entries into separate array elements for the backend database schema
    const processedGoals = formData.goals
      ? formData.goals.split("\n").map(g => g.trim()).filter(Boolean)
      : [];

    const submissionPayload = {
      employeeId: formData.employeeId,
      reviewCycle: formData.reviewCycle,
      technicalSkills: formData.technicalSkills,
      communication: formData.communication,
      delivery: formData.delivery,
      feedback: formData.feedback,
      goals: processedGoals
    };

    try {
      await apiClient.post("/performance/reviews", submissionPayload);
      
      // Reset form controls safely back to factory defaults
      setFormData({
        employeeId: "",
        reviewCycle: "Q2-2026",
        technicalSkills: 5,
        communication: 5,
        delivery: 5,
        feedback: "",
        goals: ""
      });
      
      await fetchData(); // Dynamically re-index historical review ledger tables
    } catch (err) {
      const apiErr = err.response?.data?.message || "Appraisal transmission stalled. Check user permissions.";
      setErrorMessage(apiErr);
      console.error("Appraisal execution blocked:", apiErr);
    } finally {
      setSubmitting(false);
    }
  };

  const getAverageScore = () => {
    if (!reviews.length) return "0.0";
    // Checks for both transformed 'rating' fields or underlying 'averageScore' database properties
    const total = reviews.reduce((acc, curr) => acc + (curr.rating || curr.averageScore || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Performance Appraisals</h1>
        <p className="text-slate-400 text-sm mt-1">
          Evaluate workforce milestones, record manager metrics, and handle organizational growth feedback loops.
        </p>
      </div>

      {/* Performance Matrix Aggregators */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Reviews Conducted" value={reviews.length.toString()} />
        <StatCard title="Company Average Rating" value={`${getAverageScore()} / 5.0`} />
        <StatCard title="Active Review Cycle" value="Q2-2026 Active" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Appraisal Form Console */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl space-y-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-white">Log New Milestone Assessment</h2>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Select Staff Profile</label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                required
              >
                <option value="">-- Choose Employee Node --</option>
                {employees.map((emp) => {
                  const name = emp.name || (emp.user && emp.user.name) || "Corporate Resource";
                  return (
                    <option key={emp._id} value={emp._id}>
                      {name} ({emp.employeeId || "Staff"})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Review Cycle Block</label>
              <input
                type="text"
                value={formData.reviewCycle}
                onChange={(e) => setFormData({ ...formData, reviewCycle: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                required
              />
            </div>

            {/* Granular Sub-Metrics Rating Selectors Matrix */}
            <div className="bg-slate-950/40 p-4 border border-slate-800/60 rounded-xl space-y-3">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Workforce Competency Scores</span>
              
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-300">Technical Skills:</span>
                <input
                  type="number" min="1" max="5"
                  value={formData.technicalSkills}
                  onChange={(e) => setFormData({ ...formData, technicalSkills: parseInt(e.target.value) || 5 })}
                  className="w-16 text-center bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-white outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-300">Communication:</span>
                <input
                  type="number" min="1" max="5"
                  value={formData.communication}
                  onChange={(e) => setFormData({ ...formData, communication: parseInt(e.target.value) || 5 })}
                  className="w-16 text-center bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-white outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-300">Project Delivery:</span>
                <input
                  type="number" min="1" max="5"
                  value={formData.delivery}
                  onChange={(e) => setFormData({ ...formData, delivery: parseInt(e.target.value) || 5 })}
                  className="w-16 text-center bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-white outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Manager Feedback</label>
              <textarea
                rows="3"
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                placeholder="Document critical achievements and performance metrics..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Strategic Goals (One per line)</label>
              <textarea
                rows="2"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                placeholder="Target expectation milestone 1&#10;Target expectation milestone 2..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 placeholder-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              />
            </div>

            {errorMessage && (
              <p className="text-xs p-3 rounded-xl border bg-red-500/10 border-red-500/25 text-red-400 font-mono">
                ⚠️ {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all select-none cursor-pointer"
            >
              {submitting ? "Committing Node..." : "Publish Performance Appraisal"}
            </button>
          </form>
        </div>

        {/* Right Side: Live Evaluation Ledger Grid */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-slate-800 bg-slate-950/20">
            <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-400">Archived Appraisals</h3>
          </div>
          <div className="divide-y divide-slate-800/60 max-h-[690px] overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-mono text-sm animate-pulse">Querying evaluation ledger database...</div>
            ) : reviews.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-mono text-sm">No recorded organizational appraisals found in cloud cluster.</div>
            ) : (
              reviews.map((rev) => {
                // Safeguard field traversal against populated schema names
                const targetName = rev.employee?.name || (rev.employee?.user && rev.employee.user.name) || "Resource Asset";
                const reviewerName = rev.reviewer?.name || "System Clearance";
                const displayScore = rev.rating || rev.averageScore || 0;

                return (
                  <div key={rev._id} className="p-6 hover:bg-slate-800/10 transition-colors space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-white text-base">{targetName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Cycle Context: <span className="text-indigo-400 font-mono font-semibold">{rev.reviewPeriod || rev.reviewCycle}</span></p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-yellow-500 text-xs font-bold">★</span>
                        <span className="text-white text-xs font-mono font-bold">{Number(displayScore).toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 leading-relaxed">
                      {rev.feedback}
                    </p>
                    <div className="text-[11px] text-slate-500 text-right font-mono">
                      Authorized Sign-Off: <span className="text-indigo-400">{reviewerName}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}