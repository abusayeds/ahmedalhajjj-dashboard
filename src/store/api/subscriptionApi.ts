import { baseApi } from "./baseApi";

export interface ISubscriptionPlan {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
  monthly?: string | number;
  yearly?: string | number;
  billingCycle?: "monthly" | "yearly";
  features?: string[];
  maxSignalsPerDay?: number;
  includesGoldSignals?: boolean;
  includesTechnicalAnalysis?: boolean;
  includesMarketSentiment?: boolean;
  includesEconomicCalendar?: boolean;
  support?: "basic" | "advanced" | "premium" | string;
  signalTypes?: string[];
  isActive?: boolean;
  status?: string;
  subs?: number;
  emoji?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITrialConfig {
  _id?: string;
  promoOn: boolean;
  promoLimit: number;
  promoDuration: string;
  trialOn: boolean;
  trialDuration: string;
}

export interface SubscriptionApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ISubscriptionPlan[];
}

export interface SingleSubscriptionApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ISubscriptionPlan;
}

export interface TrialConfigApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ITrialConfig;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query<SubscriptionApiResponse, void>({
      query: () => ({
        url: "/api/v1/subscription",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    getSubscriptionDetail: builder.query<SingleSubscriptionApiResponse, string>({
      query: (id) => ({
        url: `/api/v1/subscription/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Subscription", id }],
    }),
    createSubscription: builder.mutation<SingleSubscriptionApiResponse, Partial<ISubscriptionPlan>>({
      query: (body) => ({
        url: "/api/v1/subscription/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
    updateSubscription: builder.mutation<SingleSubscriptionApiResponse, { id: string; data: Partial<ISubscriptionPlan> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/subscription/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    deleteSubscription: builder.mutation<SingleSubscriptionApiResponse, string>({
      query: (id) => ({
        url: `/api/v1/subscription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
    getTrialConfig: builder.query<TrialConfigApiResponse, void>({
      query: () => ({
        url: "/api/v1/subscription/trial-config",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    updateTrialConfig: builder.mutation<TrialConfigApiResponse, Partial<ITrialConfig>>({
      query: (body) => ({
        url: "/api/v1/subscription/trial-config",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useGetSubscriptionDetailQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetTrialConfigQuery,
  useUpdateTrialConfigMutation,
} = subscriptionApi;
