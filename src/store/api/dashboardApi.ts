import { baseApi } from "./baseApi";

export interface DashboardKpi {
  value: number;
  change: string;
  sparkline: { v: number }[];
}

export interface DashboardStats {
  range: "7D" | "30D" | "6M";
  kpis: {
    total: DashboardKpi;
    vip: DashboardKpi;
    forex: DashboardKpi;
    crypto: DashboardKpi;
  };
  marketTickers: { s: string; p: string; c: string; up: boolean }[];
  growthData: { m: string; v: number; f: number; c: number }[];
  revenueData: { m: string; r: number }[];
  revenueSummary: { total: number; changePercent: string };
  signalPerformance: {
    totalClosed: number;
    winRate: number;
    perfData: { n: string; v: number; color: string }[];
  };
  activityFeed: { icon: string; text: string; time: string; col: string }[];
  systemStatus: string;
}

export interface DashboardStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardStats;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, "7D" | "30D" | "6M" | void>({
      query: (range = "6M") => ({
        url: `/api/v1/dashboard/stats?range=${range}`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
