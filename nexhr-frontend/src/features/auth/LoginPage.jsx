import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "./authSlice";
import { ROUTES } from "../../constants/routes";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({});
  const [mounted, setMounted] = useState(false);

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
    return () => dispatch(clearError());
  }, []);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user]);

  const validate = () => {
    const errs = {};
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
    setTouched({ email: true, password: true });
    if (hasErrors) return;
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden relative">
      {/* ── Ambient background geometry ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* large indigo glow top-right */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        {/* subtle slate glow bottom-left */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-slate-700/20 blur-[100px]" />
        {/* fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.6) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ══ LEFT PANEL — branding ══ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12"
        style={{
          transition: "opacity .7s ease, transform .7s ease",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-24px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" fillOpacity=".9" />
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity=".7" />
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-wide text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            NexHR
          </span>
          <span className="ml-1 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            AI-Powered
          </span>
        </div>

        {/* Center hero content */}
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Next-generation HRMS
            </div>
            <h1
              className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              People ops,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                reimagined
              </span>
              <br />
              with AI.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              From AI-powered resume screening to real-time payroll insights — manage your entire workforce from one intelligent platform.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["AI Resume Screening", "Smart Payroll", "Performance Analytics", "Attendance Tracking", "Role-based Access"].map((f) => (
              <span
                key={f}
                className="text-xs text-slate-300 bg-slate-800/70 border border-slate-700/60 px-3 py-1.5 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="flex items-center gap-8 pt-8 border-t border-slate-800/60">
          {[["10k+", "Employees managed"], ["99.9%", "Uptime SLA"], ["< 2s", "AI screening"]].map(([val, lbl]) => (
            <div key={lbl}>
              <div className="text-white font-bold text-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {val}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL — login form ══ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div
          className="w-full max-w-[420px]"
          style={{
            transition: "opacity .65s ease .15s, transform .65s ease .15s",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-slate-950/50">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                  <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-white font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                NexHR
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Welcome back
            </h2>
            <p className="text-slate-400 text-sm mb-8">Sign in to your workspace</p>

            {/* Demo credential hint */}
            <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl p-3.5 mb-6 flex gap-3">
              <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-slate-400 leading-relaxed">
                <span className="text-indigo-400 font-medium">Demo:</span>{" "}
                <button
                  type="button"
                  onClick={() => setForm({ email: "admin@nexhr.com", password: "admin123" })}
                  className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200 transition-colors"
                >
                  admin@nexhr.com
                </button>{" "}
                · <span className="text-slate-500">admin123</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Work email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className={`w-full bg-slate-800/60 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200
                      focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60
                      ${touched.email && fieldErrors.email ? "border-red-500/60 bg-red-500/5" : "border-slate-700/60 hover:border-slate-600/80"}`}
                  />
                </div>
                {touched.email && fieldErrors.email && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
                    </svg>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full bg-slate-800/60 border rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200
                      focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60
                      ${touched.password && fieldErrors.password ? "border-red-500/60 bg-red-500/5" : "border-slate-700/60 hover:border-slate-600/80"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {touched.password && fieldErrors.password && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
                    </svg>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* API error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:transform-none"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in to workspace
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Role quick-switch (demo) */}
            <div className="mt-6 pt-6 border-t border-slate-800/60">
              <p className="text-xs text-slate-600 text-center mb-3">Quick demo access</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: "Admin", email: "admin@nexhr.com", color: "indigo" },
                  { role: "HR", email: "hr@nexhr.com", color: "violet" },
                  { role: "Manager", email: "manager@nexhr.com", color: "slate" },
                ].map(({ role, email, color }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ email, password: "demo123" })}
                    className={`text-xs py-2 px-3 rounded-lg border transition-all duration-150 text-center
                      ${color === "indigo" ? "border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10" :
                        color === "violet" ? "border-violet-500/30 text-violet-400 hover:bg-violet-500/10" :
                        "border-slate-700/50 text-slate-500 hover:bg-slate-800/60 hover:text-slate-400"}`}
                  >
                    {role}
                  </button>
                  
                ))}
                <p className="mt-4 text-sm text-slate-400 text-center">
  Need a fresh corporate profile?{" "}
  <button 
    type="button"
    onClick={() => navigate("/register")} 
    className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2"
  >
    Create an account
  </button>
</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600 mt-6">
            © {new Date().getFullYear()} NexHR · Secured with AES-256
          </p>
        </div>
      </div>
    </div>
  );
}