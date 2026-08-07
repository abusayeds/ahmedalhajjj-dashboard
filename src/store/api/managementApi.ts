import { baseApi } from "./baseApi";

export interface ManagementResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    _id?: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
}

export const managementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagement: builder.query<ManagementResponse, "terms" | "about" | "privacy">({
      query: (type) => `/api/v1/management/${type}`,
      providesTags: (_result, _error, type) => [{ type: "Management", id: type }],
    }),
    updateManagement: builder.mutation<ManagementResponse, { type: "terms" | "about" | "privacy"; description: string }>({
      query: (body) => ({
        url: "/api/v1/management/create",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Management", id: arg.type }],
    }),
  }),
});

export const { useGetManagementQuery, useUpdateManagementMutation } = managementApi;
