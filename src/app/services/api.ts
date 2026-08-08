/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_BASE_URL } from "../../config/env";

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("admin_token");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("admin_token", token);
};

export const getStoredUser = (): any => {
  const user = localStorage.getItem("admin_user");
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: any) => {
  localStorage.setItem("admin_user", JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  localStorage.removeItem("reset_token");
};

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message?: string; data?: T; error?: string }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (res.status === 401 || res.status === 403) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      } else {
        clearAuthSession();
      }
      return {
        success: false,
        error: data.message || "Session expired or unauthorized.",
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: data.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to connect to backend server.",
    };
  }
}

// ─── AUTH ENDPOINTS ─────────────────────────────────────────────────────────

export const loginApi = async (body: { email: string; password: string }) => {
  return apiRequest("/api/v1/user/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const forgotPasswordApi = async (body: { email: string }) => {
  return apiRequest("/api/v1/user/forget-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const verifyForgotOtpApi = async (
  body: { otp: string },
  step1Token: string
) => {
  return apiRequest("/api/v1/user/verify-forget-otp", {
    method: "POST",
    headers: {
      Authorization: step1Token,
    },
    body: JSON.stringify(body),
  });
};

export const resetPasswordApi = async (
  body: { newPassword: string; confirmPassword: string },
  step2Token: string
) => {
  return apiRequest("/api/v1/user/reset-password", {
    method: "POST",
    headers: {
      Authorization: step2Token,
    },
    body: JSON.stringify(body),
  });
};

export const changePasswordApi = async (body: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return apiRequest("/api/v1/user/change-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const getMyProfileApi = async () => {
  return apiRequest("/api/v1/user/my-profile", {
    method: "GET",
  });
};

export const getAllUsersApi = async () => {
  return apiRequest("/api/v1/user/all-user", {
    method: "GET",
  });
};
