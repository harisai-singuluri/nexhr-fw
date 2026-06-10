import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "./authSlice";
import { ROUTES } from "../../constants/routes";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    department: "Engineering"
  });
  
  const [touched, setTouched] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
    return () => dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    return errs;
  };

  const fieldErrors = validate();
  const hasErrors = Object.keys(fieldErrors).length > 0;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    dispatch(clearError());
  };

  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (hasErrors) return;
    dispatch(registerUser(form));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,.6) 1px,transparent 1px), linear-gradient(90deg,rgba(99,102,241,.6) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      {/* Main Right Box Wrapper mapped to full layout centers */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[460px] transition-all duration-700" style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)" }}>
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Create Workspace Account</h2>
            <p className="text-slate-400 text-sm mb-6">Register a fresh employee terminal profile</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all
                    focus:ring-2 focus:ring-indigo-500/50
                    ${touched.name && fieldErrors.name ? "border-red-500/60 bg-red-500/5" : "border-slate-700/60"}`}
                />
                {touched.name && fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Work Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@company.com"
                  className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all
                    focus:ring-2 focus:ring-indigo-500/50
                    ${touched.email && fieldErrors.email ? "border-red-500/60 bg-red-500/5" : "border-slate-700/60"}`}
                />
                {touched.email && fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all
                    focus:ring-2 focus:ring-indigo-500/50
                    ${touched.password && fieldErrors.password ? "border-red-500/60 bg-red-500/5" : "border-slate-700/60"}`}
                />
                {touched.password && fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
              </div>

              {/* Dual Selection Layout Grid: Department & Corporate Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Role Type</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="HR">HR Specialist</option>
                    <option value="ADMIN">System Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">HR Ops</option>
                    <option value="Management">Management</option>
                    <option value="Design">UI/UX Design</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Error Messaging Container */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-2.5 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Profile..." : "Register Account"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <button onClick={() => navigate("/login")} className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2">
                  Sign In
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}