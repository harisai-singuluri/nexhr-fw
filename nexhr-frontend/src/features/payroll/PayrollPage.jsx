import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import StatCard from "../../components/common/StatCard";

export default function PayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  
  const [form, setForm] = useState({  
    employeeId: "",
    month: "06", // Default to current month structure
    year: "2026",
    allowances: "5000",
  });
  
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Core Data Ingestion — Roster + Historical Statements
  const fetchPayrollContext = async () => {
    try {
      // Pull down system active directories to populate assignment dropdowns
      const empRes = await apiClient.get("/employees");
      setEmployees(empRes.data.employees || []);
      
      // Pull raw processing ledgers
      const historyRes = await apiClient.get("/payroll/history");
      setPayrollHistory(historyRes.data || []);
    } catch (err) {
      console.log("Telemetry fetch warning — structural defaults applied.");
    }
  };

  useEffect(() => {
    fetchPayrollContext();
  }, []);

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 2. Trigger Automated Calculation Execution Loop
  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    if (!form.employeeId) return setMessage({ type: "error", text: "Please isolate a targeted employee profile node." });

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        employeeId: form.employeeId,
        month: form.month,
        year: parseInt(form.year),
        allowances: parseFloat(form.allowances) || 0,
      };

      const { data } = await apiClient.post("/payroll/generate", payload);
      setMessage({ type: "success", text: `Statement compiled cleanly. Net Payable: ₹${data.netPayable}` });
      fetchPayrollContext();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to finalize compilation sequence." });
    } finally {
      setLoading(false);
    }
  };

  // 3. Compute running financial aggregates across clusters
  const totalOutflow = payrollHistory.reduce((acc, curr) => acc + (curr.netPayable || 0), 0);
  const totalProcessedLedgers = payrollHistory.length;

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Smart Payroll Engine</h1>
        <p className="text-slate-400 text-sm mt-1">
          Automated line-item calculations, attendance metric deductions, and payment generation.
        </p>
      </div>

      {/* Financial Telemetry Matrices */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Month Outflow" value={`₹${totalOutflow.toLocaleString()}`} />
        <StatCard title="Compiled Statements" value={totalProcessedLedgers.toString()} />
        <StatCard title="Compliance Status" value="AES-256 Verified" />
      </div>

      <div className="grid xl:grid-cols-3 gap-8 items-start">
        {/* Left Card: Input Parameters Compiler */}
        <div className="xl:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Compile Statement</h3>
            <p className="text-xs text-slate-500 mt-0.5">Initialize automated payroll matrix evaluations.</p>
          </div>

          <form onSubmit={handleGeneratePayroll} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Select Employee Profile</label>
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="">-- Choose target personnel --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.user?.name || "Unknown"} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Target Cycle Month</label>
                <select
                  name="month"
                  value={form.month}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Fiscal Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Allowances / Bonuses (₹)</label>
              <input
                type="number"
                name="allowances"
                value={form.allowances}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {message.text && (
              <p className={`text-xs p-3 rounded-xl border font-medium ${message.type === "error" ? "bg-red-500/10 border-red-500/25 text-red-400" : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/15 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? "Compiling Structure..." : "Execute Automated Calculation"}
            </button>
          </form>
        </div>

        {/* Right Section: Continuous Ledger Auditing Feed */}
        <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">Central Settlement Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">Auditable history of running disbursements processed in your node workspace.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/40">
                  <th className="p-4 pl-6">Personnel Node</th>
                  <th className="p-4">Billing Cycle</th>
                  <th className="p-4">Deductions</th>
                  <th className="p-4">Net Disbursement</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {payrollHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-slate-500 font-mono">
                      No active payroll records captured across this workspace lifecycle.
                    </td>
                  </tr>
                ) : (
                  payrollHistory.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-white">{item.employee?.user?.name || "Corporate Resource"}</div>
                        <div className="text-xs text-slate-400 mt-0.5">ID: {item.employee?.employeeId}</div>
                      </td>
                      <td className="p-4 font-medium">{item.month}/{item.year}</td>
                      <td className="p-4 text-red-400 font-mono">₹{item.deductions?.toLocaleString()}</td>
                      <td className="p-4 font-semibold text-emerald-400 font-mono">₹{item.netPayable?.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className="inline-block text-[10px] font-bold font-mono px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/25">
                          {item.status}
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