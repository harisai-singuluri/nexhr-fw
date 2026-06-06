// src/features/auth/UnauthorisedPage.jsx
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function UnauthorisedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-6xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>403</div>
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Access denied</h1>
        <p className="text-slate-400 text-sm mb-8">You don't have permission to view this page. Contact your administrator if you think this is a mistake.</p>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
}