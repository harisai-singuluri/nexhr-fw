import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import StatCard from "../../components/common/StatCard";

export default function AIScreeningPage() {
  const [candidates, setCandidates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "Senior Backend Engineer",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Fetch Candidate evaluation matrix from backend on load
  const fetchCandidates = async () => {
    try {
      // Points exactly to your newly mounted Express route path
      const { data } = await apiClient.get("/recruitment/candidates");
      setCandidates(data);
    } catch (err) {
      console.error("Failed to fetch candidate logs:", err.message);
    }
  };

  useEffect(() => {
    fetchCandidates();
    // Poll every 5 seconds to automatically catch completed background worker AI metrics
    const interval = setInterval(fetchCandidates, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Handle File upload selection and Application parameter state modifications
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage({ type: "error", text: "Please select a resume file to upload." });

    setUploading(true);
    setMessage({ type: "", text: "" });

    // Bundle parameters inside FormData object for Multer parsing ingestion streams
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("jobTitle", formData.jobTitle);
    payload.append("resume", file); // Tied directly to upload.single("resume") on Express endpoint

    try {
      await apiClient.post("/recruitment/apply", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ type: "success", text: "Resume ingested. Asynchronous AI parsing initiated!" });
      setFormData({ name: "", email: "", phone: "", jobTitle: "Senior Backend Engineer" });
      setFile(null);
      
      // Clear local file input DOM representation field cleanly
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      fetchCandidates();
    } catch (err) {
      const errorText = err.response?.data?.message || err.message || "Failed to submit application profile.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setUploading(false);
    }
  };

  // 3. Compute metric distributions from real backend data payload matrix
  const totalScreened = candidates.length;
  const shortlisted = candidates.filter((c) => c.status === "SHORTLISTED").length;
  
  // Safe helper extraction parsing targeting nested MongoDB properties
  const avgAIScore = totalScreened
    ? Math.round(candidates.reduce((acc, c) => acc + (c.aiEvaluation?.score || 0), 0) / totalScreened)
    : 0;

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">AI Candidate Screening Core</h1>
        <p className="text-slate-400 text-sm mt-1">
          Zero-human-intervention resume parsing, metric matching, and suitability grading.
        </p>
      </div>

      {/* Metric Telemetry Blocks */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Applicants Processed" value={totalScreened.toString()} />
        <StatCard title="AI Automated Shortlists" value={shortlisted.toString()} />
        <StatCard title="Mean Pipeline Match Accuracy" value={`${avgAIScore}%`} />
      </div>

      <div className="grid xl:grid-cols-3 gap-8 items-start">
        {/* Left Form: Ingestion Input Tunnel */}
        <div className="xl:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Ingest Application</h3>
            <p className="text-xs text-slate-500 mt-0.5">Submit candidate parameters to initiate screening.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Applicant Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Opening/Role</label>
              <select
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="Senior Backend Engineer">Senior Backend Engineer</option>
                <option value="DevOps Infrastructure Lead">DevOps Infrastructure Lead</option>
                <option value="Product Architect">Product Architect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Resume File (PDF/Docx)</label>
              <input
                type="file"
                accept=".pdf,.docx"
                required
                onChange={handleFileChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer file:cursor-pointer"
              />
            </div>

            {message.text && (
              <p className={`text-xs p-3 rounded-xl border ${message.type === "error" ? "bg-red-500/10 border-red-500/25 text-red-400" : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/15"
            >
              {uploading ? "Ingesting Document..." : "Trigger AI Evaluation"}
            </button>
          </form>
        </div>

        {/* Right Section: Ranked Evaluation Monitor */}
        <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">Automated Pipeline Monitor</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time evaluation feeds streaming from background processes.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/40">
                  <th className="p-4 pl-6">Candidate Details</th>
                  <th className="p-4">Target Role</th>
                  <th className="p-4 text-center">Match Grade</th>
                  <th className="p-4">Rec Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-slate-500 font-mono">
                      No active candidate documents tracked in cluster.
                    </td>
                  </tr>
                ) : (
                  candidates.map((c) => {
                    const score = c.aiEvaluation?.score || 0;
                    
                    // Determine contextual coloring based on final matched score
                    const scoreBadgeColor = score >= 85 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                      : score >= 70 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/25" 
                        : "bg-rose-500/10 text-rose-400 border-rose-500/25";

                    const statusBadgeColor = c.status === "SHORTLISTED"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
                      : c.status === "SCREENING"
                        ? "bg-slate-800 text-slate-500 border-slate-700"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/25";

                    return (
                      <tr key={c._id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="font-semibold text-white">{c.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{c.email}</div>
                        </td>
                        <td className="p-4 text-slate-300 font-medium">{c.jobTitle}</td>
                        <td className="p-4">
                          {c.status === "SCREENING" ? (
                            <div className="flex items-center justify-center gap-2 text-indigo-400 font-mono text-xs">
                              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                              Evaluating...
                            </div>
                          ) : (
                            <div className="text-center">
                              <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${scoreBadgeColor}`}>
                                {score}%
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${statusBadgeColor}`}>
                            {c.status}
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
      </div>
    </div>
  );
}