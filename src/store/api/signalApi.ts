import { baseApi } from "./baseApi";
import type { SignalData } from "../../app/components/shared";

export interface ApiSignal extends Omit<SignalData, "id"> {
  _id?: string;
  id?: string;
  notes?: string;
  scheduledAt?: string;
  closeResult?: string;
  closePnl?: string;
}

export interface SignalListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ApiSignal[];
}

export interface SignalResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ApiSignal;
}

export interface SignalPayload {
  asset: string;
  category: string;
  type: string;
  direction: "BUY" | "SELL";
  entry: string;
  sl: string;
  tp1: string;
  tp2?: string;
  tp3?: string;
  notes?: string;
  status?: string;
  scheduledAt?: string;
}

export const signalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSignals: builder.query<SignalListResponse, { status?: string; searchTerm?: string } | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.status && params.status !== "All") search.set("status", params.status);
        if (params?.searchTerm) search.set("searchTerm", params.searchTerm);
        const qs = search.toString();
        return {
          url: `/api/v1/signal${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Signal"],
    }),
    createSignal: builder.mutation<SignalResponse, SignalPayload>({
      query: (body) => ({
        url: "/api/v1/signal/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Signal", "Dashboard"],
    }),
    updateSignal: builder.mutation<SignalResponse, { id: string; data: Partial<SignalPayload> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/signal/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Signal", "Dashboard"],
    }),
    deleteSignal: builder.mutation<SignalResponse, string>({
      query: (id) => ({
        url: `/api/v1/signal/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Signal", "Dashboard"],
    }),
    publishSignal: builder.mutation<SignalResponse, string>({
      query: (id) => ({
        url: `/api/v1/signal/${id}/publish`,
        method: "POST",
      }),
      invalidatesTags: ["Signal", "Dashboard"],
    }),
    closeSignal: builder.mutation<SignalResponse, { id: string; closeResult: string; closePnl?: string }>({
      query: ({ id, closeResult, closePnl }) => ({
        url: `/api/v1/signal/${id}/close`,
        method: "POST",
        body: { closeResult, closePnl },
      }),
      invalidatesTags: ["Signal", "Dashboard"],
    }),
    archiveSignal: builder.mutation<SignalResponse, string>({
      query: (id) => ({
        url: `/api/v1/signal/${id}/archive`,
        method: "POST",
      }),
      invalidatesTags: ["Signal", "Dashboard"],
    }),
    duplicateSignal: builder.mutation<SignalResponse, string>({
      query: (id) => ({
        url: `/api/v1/signal/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["Signal", "Dashboard"],
    }),
  }),
});

export const {
  useGetSignalsQuery,
  useCreateSignalMutation,
  useUpdateSignalMutation,
  useDeleteSignalMutation,
  usePublishSignalMutation,
  useCloseSignalMutation,
  useArchiveSignalMutation,
  useDuplicateSignalMutation,
} = signalApi;

export const mapApiSignal = (signal: ApiSignal): SignalData => ({
  id: String(signal._id || signal.id || ""),
  asset: signal.asset,
  cat: signal.cat,
  type: signal.type,
  dir: signal.dir,
  entry: signal.entry,
  sl: signal.sl,
  tp1: signal.tp1,
  tp2: signal.tp2 || "—",
  tp3: signal.tp3 || "—",
  status: signal.status,
  pub: signal.pub || "—",
});
