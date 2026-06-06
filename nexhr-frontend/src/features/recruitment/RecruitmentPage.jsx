import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import StatCard from "../../components/common/StatCard";

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs"); // jobs | candidates

  // Form States
  const [jobForm, setJobForm] = useState({ title: "", department: "", type: "Full-time", description: "" });

  // Fetch Recruitment Metrics and Files from Atlas Cluster
  const fetchRecruitmentData = async () => {
    setLoading(true);
    try {
      const [jobsRes, candRes] = await Promise.all([
        apiClient.get("/recruitment/jobs").catch(() => ({ data: [] })),
        apiClient.get("/recruitment/candidates").catch(() => ({ data: [] }))
      ]);
      setJobs(jobsRes.data || []);
      setCandidates(candRes.data || []);
    } catch (err) {
      console.error("Recruitment fetch pipeline stalled:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruitmentData();
  }, [window.location.pathname]); // Autofetch fix applied here too!

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/recruitment/jobs", jobForm);
      setJobForm({ title: "", department: "", type: "Full-time", description: "" });
      fetchRecruitmentData();
    } catch (err) {
      console.error("Job posting failed:", err.message);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Recruitment & AI Screening Hub</h1>
        <p className="text-slate-400 text-sm mt-1">
          Publish corporate openings, track incoming applications, and monitor automated profile matching logs.
        </p>
      </div>

      {/* High-Level Tracking Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Active Job Openings" value={jobs.length.toString()} />
        <StatCard title="Total Applicants processed" value={candidates.length.toString()} />
        <StatCard title="AI Processing Station" value="Active (Mock Simulation Mode)" />
      </div>

      {/* Tab Navigation Switches */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`pb-3 text-sm font-semibold tracking-wide transition-colors outline-none ${activeTab === "jobs" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-white"}`}
        >
          Job Postings Console
        </button>
        <button
          onClick={() => setActiveTab("candidates")}
          className={`pb-3 text-sm font-semibold tracking-wide transition-colors outline-none ${activeTab === "candidates" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-white"}`}
        >
          Applicant Screening Pool ({candidates.length})
        </button>
      </div>

      {activeTab === "jobs" ? (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Post New Opening Form Block */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-semibold text-white">Publish New Career Opening</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g., Senior Backend Engineer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Department</label>
                  <input
                    type="text"
                    placeholder="Engineering"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Type</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Job Description Summary</label>
                <textarea
                  rows="4"
                  placeholder="Outline key tech stacks, expected deliverables, and baseline target credentials..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                Publish Active Opening
              </button>
            </form>
          </div>

          {/* Active Openings Board */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="p-8 text-slate-500 font-mono text-sm">Querying active corporate listings...</div>
            ) : jobs.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-12 text-center text-slate-500 font-mono text-sm">
                No active openings found. Use the submission panel to seed a job opportunity.
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{job.title}</h3>
                      <span className="text-[10px] font-bold font-mono tracking-wider bg-slate-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/40 uppercase">{job.type}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-400">{job.department} Allocation Department</p>
                    <p className="text-sm text-slate-300 max-w-xl line-clamp-2">{job.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Candidates Layout Section */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/40">
                  <th className="p-4 pl-6">Candidate / Applied For</th>
                  <th className="p-4">Submission Contact</th>
                  <th className="p-4 text-center">AI Fit Score Target</th>
                  <th className="p-4 text-center">Pipeline Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-12 text-slate-500 font-mono">
                      No candidate profiles have uploaded application data nodes yet.
                    </td>
                  </tr>
                ) : (
                  candidates.map((cand) => {
                    const matchScore = cand.aiScore || 0;
                    const scoreColor = matchScore >= 80 ? "text-emerald-400 bg-emerald-950/40 border-emerald-900" : matchScore >= 50 ? "text-amber-400 bg-amber-950/40 border-amber-900" : "text-rose-400 bg-rose-950/40 border-rose-900";
                    
                    return (
                      <tr key={cand._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-semibold text-white">{cand.name}</div>
                          <div className="text-xs text-indigo-400 font-mono mt-0.5">Applied: {cand.jobTitle || "General Listing"}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-200">{cand.email}</div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block font-mono font-bold text-xs px-2.5 py-1 rounded-lg border ${scoreColor}`}>
                            {matchScore > 0 ? `${matchScore}% Match` : "Awaiting File Scan"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-[11px] font-bold font-mono tracking-wider px-2 py-0.5 rounded border border-slate-700 bg-slate-950 text-slate-400 uppercase">
                            {cand.status || "REVIEW"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}