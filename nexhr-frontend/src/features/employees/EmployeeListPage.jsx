import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import StatCard from "../../components/common/StatCard";
import { ROLE_COLORS, ROLE_LABELS } from "../../constants/roles";

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Dynamic Paged Roster from Backend
  const fetchRoster = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/employees?page=${page}&limit=10`);
      
      // Fallback array handling depending on exact payload wrappers
      const extractedEmployees = data.employees || data.data || (Array.isArray(data) ? data : []);
      setEmployees(extractedEmployees);
      
      setPagination({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total ?? extractedEmployees.length
      });
    } catch (err) {
      console.error("Roster extraction failure:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster(currentPage);
  }, [currentPage]);

  // 2. Client-side filtration with defensive flat/nested logic fallbacks
  const filteredEmployees = employees.filter((emp) => {
    const name = (emp.name || emp.user?.name || "").toLowerCase();
    const empId = (emp.employeeId || "").toLowerCase();
    const dept = (emp.department || emp.user?.department || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return name.includes(search) || empId.includes(search) || dept.includes(search);
  });

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Employee Roster Directory</h1>
        <p className="text-slate-400 text-sm mt-1">
          Central management console for resource deployment, system roles, and department profiles.
        </p>
      </div>

      {/* Roster Allocation Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Registered Staff" value={pagination.total.toString()} />
        <StatCard title="Active Clusters" value="MongoDB Sharded" />
        <StatCard title="Live Access Connections" value="Concurrently Optimized" />
      </div>

      {/* Filter and Control Dock */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, employee ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Main Directory Roster Grid Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider bg-slate-950/40">
                <th className="p-4 pl-6">Personnel Profile</th>
                <th className="p-4">Staff ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Assigned Designation</th>
                <th className="p-4 text-center">Security Role Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-500 font-mono">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Querying cluster index...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-500 font-mono">
                    No workforce profiles matched the isolation parameters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  // Safe properties decomposition matching both flat and populated models
                  const name = emp.name || emp.user?.name || "Corporate Resource";
                  const email = emp.email || emp.user?.email || "N/A";
                  const department = emp.department || emp.user?.department || "General";
                  const role = emp.role || emp.user?.role || "EMPLOYEE";

                  return (
                    <tr key={emp._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-white">{name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{email}</div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-400 uppercase">
                        {emp.employeeId || "UNASSIGNED"}
                      </td>
                      <td className="p-4 font-medium text-slate-300">{department}</td>
                      <td className="p-4 text-slate-400">{emp.designation || "Staff Associate"}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block text-[11px] font-bold font-mono tracking-wider px-2.5 py-0.5 rounded-full border ${ROLE_COLORS[role] || "border-slate-700 text-slate-400"}`}>
                          {ROLE_LABELS[role] || role}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Matrix Control Block */}
        {pagination.pages > 1 && (
          <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-mono">
              Displaying block page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-white disabled:opacity-40 select-none transition-colors"
              >
                Previous Page
              </button>
              <button
                disabled={currentPage === pagination.pages || loading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 select-none transition-colors"
              >
                Next Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}