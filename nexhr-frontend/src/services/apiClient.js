import axios from "axios";

/**
 * Axios instance used by every service module.
 * - Automatically attaches the JWT from localStorage.
 * - On 401, clears the session and redirects to /login.
 */
const apiClient = axios.create({
  // ✅ FIXED: Changed local fallback to your live Render backend URL string
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://nexhr-fw.onrender.com/api/v1",
  timeout: 30000, // Boosted to 30s to keep Free Tier cold boots from snapping connection thresholds
  headers: { "Content-Type": "application/json" },
});
// ── Request interceptor — attach token ────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hrms_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle auth errors ─────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("hrms_token");
      localStorage.removeItem("hrms_user");
      // Hard redirect — avoids stale Redux state issues
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Unwrap the error message from the API envelope if present
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "An unexpected error occurred.";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;