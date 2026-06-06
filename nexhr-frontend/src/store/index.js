// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more slices here as you build them:
    // employees: employeeReducer,
    // attendance: attendanceReducer,
    // payroll: payrollReducer,
    // ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths for non-serialisable values if needed
        ignoredActions: [],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;