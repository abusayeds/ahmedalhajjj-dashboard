/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

const defaultAdminUser = {
  id: "admin-1",
  name: "Ahmed Alhajji",
  email: "admin@elitetrading.io",
  role: "admin",
};

const initialToken = localStorage.getItem("admin_token") || "demo_admin_token";
const initialUserStr = localStorage.getItem("admin_user");
let initialUser = defaultAdminUser;
try {
  initialUser = initialUserStr ? JSON.parse(initialUserStr) : defaultAdminUser;
} catch {
  initialUser = defaultAdminUser;
}

const initialState: AuthState = {
  token: initialToken,
  user: initialUser,
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: any }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(user));
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      localStorage.setItem("admin_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("reset_token");
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
