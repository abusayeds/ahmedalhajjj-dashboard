import { baseApi } from "./baseApi";
import type { NotifData } from "../../app/components/shared";

export interface ApiNotification extends Omit<NotifData, "id"> {
  _id?: string;
  id?: string;
  scheduledAt?: string;
}

export interface NotificationListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ApiNotification[];
}

export interface NotificationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ApiNotification;
}

export interface AudienceStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    all: number;
    vip: number;
    forex: number;
    crypto: number;
    trial: number;
  };
}

export interface NotificationPayload {
  title: string;
  message: string;
  audience: string;
  scheduledAt?: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationListResponse, void>({
      query: () => ({
        url: "/api/v1/notification",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    getAudienceStats: builder.query<AudienceStatsResponse, void>({
      query: () => ({
        url: "/api/v1/notification/audience-stats",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    sendNotification: builder.mutation<NotificationResponse, NotificationPayload>({
      query: (body) => ({
        url: "/api/v1/notification/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification", "Dashboard"],
    }),
    scheduleNotification: builder.mutation<NotificationResponse, NotificationPayload>({
      query: (body) => ({
        url: "/api/v1/notification/schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification", "Dashboard"],
    }),
    updateNotification: builder.mutation<NotificationResponse, { id: string; data: Partial<NotificationPayload> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/notification/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Notification", "Dashboard"],
    }),
    deleteNotification: builder.mutation<NotificationResponse, string>({
      query: (id) => ({
        url: `/api/v1/notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification", "Dashboard"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetAudienceStatsQuery,
  useSendNotificationMutation,
  useScheduleNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;

export const mapApiNotification = (notification: ApiNotification): NotifData => ({
  id: String(notification._id || notification.id || ""),
  title: notification.title,
  audience: notification.audience,
  sent: notification.sent || "—",
  reach: notification.reach || 0,
  opened: notification.opened || 0,
  status: notification.status,
  message: notification.message,
});
