/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/api/v1/user/login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: "/api/v1/user/forget-password",
        method: "POST",
        body,
      }),
    }),
    verifyForgotOtp: builder.mutation<
      any,
      { otp: string; token: string }
    >({
      query: ({ otp, token }) => ({
        url: "/api/v1/user/verify-forget-otp",
        method: "POST",
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
        body: { otp },
      }),
    }),
    resetPassword: builder.mutation<
      any,
      { newPassword: string; confirmPassword: string; token: string }
    >({
      query: ({ newPassword, confirmPassword, token }) => ({
        url: "/api/v1/user/reset-password",
        method: "POST",
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
        body: { newPassword, confirmPassword },
      }),
    }),
    changePassword: builder.mutation<
      any,
      { oldPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({
        url: "/api/v1/user/change-password",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<any, void>({
      query: () => ({
        url: "/api/v1/user/my-profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<any, { name?: string; email?: string; firstName?: string; lastName?: string }>({
      query: (body) => ({
        url: "/api/v1/user/update-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
