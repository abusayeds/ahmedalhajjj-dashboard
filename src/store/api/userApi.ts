/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, void>({
      query: () => ({
        url: "/api/v1/user/all-user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    blockUser: builder.mutation<any, { userId: string }>({
      query: (body) => ({
        url: "/api/v1/user/block-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<any, { userId: string }>({
      query: (body) => ({
        url: "/api/v1/user/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useBlockUserMutation,
  useDeleteUserMutation,
} = userApi;
