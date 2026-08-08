/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  subscriptionType?: string;
}

export interface UsersApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any[];
  pagination?: {
    totalPage: number;
    currentPage: number;
    prevPage: number;
    nextPage: number;
    totalData: number;
  };
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersApiResponse, UsersQueryParams | void>({
      query: (params = {}) => {
        const queryParams: Record<string, string | number> = {
          page: params.page || 1,
          limit: params.limit || 10,
        };
        if (params.searchTerm?.trim()) {
          queryParams.searchTerm = params.searchTerm.trim();
        }
        if (params.subscriptionType && params.subscriptionType !== "All") {
          queryParams.subscriptionType = params.subscriptionType;
        }
        return {
          url: "/api/v1/user/all-user",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["User"],
    }),
    blockUser: builder.mutation<any, { userId: string }>({
      query: (body) => ({
        url: "/api/v1/user/block-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Subscription", "Dashboard"],
    }),
    deleteUser: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({
        url: `/api/v1/user/delete?id=${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Subscription", "Dashboard"],
    }),
    adminUpdateUser: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/api/v1/user/admin-update-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Subscription", "Dashboard"],
    }),
    upgradeUserSubscription: builder.mutation<
      any,
      { userId: string; subscriptionType: "VIP" | "Forex" | "Crypto" }
    >({
      query: (body) => ({
        url: "/api/v1/user/upgrade-subscription",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Subscription", "Dashboard"],
    }),
    extendUserSubscription: builder.mutation<any, { userId: string; days: number }>({
      query: (body) => ({
        url: "/api/v1/user/extend-subscription",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Subscription", "Dashboard"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useBlockUserMutation,
  useDeleteUserMutation,
  useAdminUpdateUserMutation,
  useUpgradeUserSubscriptionMutation,
  useExtendUserSubscriptionMutation,
} = userApi;
