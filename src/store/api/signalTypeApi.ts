import { baseApi } from "./baseApi";

export interface SignalType {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignalTypeListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: SignalType[];
}

export interface SignalTypeResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: SignalType;
}

export const signalTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSignalTypes: builder.query<SignalTypeListResponse, { includeInactive?: boolean } | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.includeInactive) search.set("includeInactive", "true");
        const qs = search.toString();
        return {
          url: `/api/v1/signal/types${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["SignalType"],
    }),
    createSignalType: builder.mutation<SignalTypeResponse, { name: string }>({
      query: (body) => ({
        url: "/api/v1/signal/types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SignalType"],
    }),
    updateSignalType: builder.mutation<
      SignalTypeResponse,
      { id: string; data: Partial<Pick<SignalType, "name" | "isActive">> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/signal/types/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SignalType"],
    }),
    deleteSignalType: builder.mutation<SignalTypeResponse, string>({
      query: (id) => ({
        url: `/api/v1/signal/types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SignalType"],
    }),
  }),
});

export const {
  useGetSignalTypesQuery,
  useCreateSignalTypeMutation,
  useUpdateSignalTypeMutation,
  useDeleteSignalTypeMutation,
} = signalTypeApi;

export const mapSignalTypeOptions = (types: SignalType[] = []) =>
  types
    .filter((type) => type.isActive)
    .map((type) => ({ l: type.name, v: type.name }));
