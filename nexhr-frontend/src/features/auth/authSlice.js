import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// ── Async thunks ──────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Login failed. Please try again.");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const refreshSession = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.refreshToken();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Initial state ─────────────────────────────────────────────────────────────

const storedUser = (() => {
  try {
    const raw = localStorage.getItem("hrms_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  user: storedUser,           // { id, name, email, role, avatar, department }
  token: localStorage.getItem("hrms_token") || null,
  loading: false,
  error: null,
  sessionChecked: false,      // true once we've attempted a token refresh on mount
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    // For optimistic profile updates (avatar, name, etc.)
    updateUserField(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("hrms_user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        localStorage.setItem("hrms_token", payload.token);
        localStorage.setItem("hrms_user", JSON.stringify(payload.user));
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── Logout ──
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("hrms_token");
        localStorage.removeItem("hrms_user");
      });

    // ── Refresh ──
    builder
      .addCase(refreshSession.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        state.sessionChecked = true;
        localStorage.setItem("hrms_token", payload.token);
        localStorage.setItem("hrms_user", JSON.stringify(payload.user));
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.sessionChecked = true;
        localStorage.removeItem("hrms_token");
        localStorage.removeItem("hrms_user");
      });
  },
});

export const { clearError, setUser, updateUserField } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.user && !!state.auth.token;
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;