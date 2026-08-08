/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

const storedToken = localStorage.getItem("admin_token");
let storedUser: any = null;

try {
  const rawUser = localStorage.getItem("admin_user");
  storedUser = rawUser ? JSON.parse(rawUser) : null;
} catch {
  storedUser = null;
}

const initialState: AuthState = {
  token: storedToken,
  user: storedUser,
  isAuthenticated: Boolean(storedToken),
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
