import { baseApi } from "./baseApi";
import type { PostData } from "../../app/components/shared";

export interface ApiPost extends Omit<PostData, "id"> {
  _id?: string;
  id?: string;
  scheduledAt?: string;
}

export interface PostListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ApiPost[];
}

export interface PostResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ApiPost;
}

export interface PostPayload {
  title: string;
  body?: string;
  category: string;
  coverImage?: string;
  status?: string;
  scheduledAt?: string;
  sendPush?: boolean;
}

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PostListResponse, { category?: string; searchTerm?: string; status?: string } | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.category && params.category !== "All Categories") {
          search.set("category", params.category);
        }
        if (params?.searchTerm) search.set("searchTerm", params.searchTerm);
        if (params?.status && params.status !== "All") search.set("status", params.status);
        const qs = search.toString();
        return {
          url: `/api/v1/post${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Post"],
    }),
    createPost: builder.mutation<PostResponse, PostPayload>({
      query: (body) => ({
        url: "/api/v1/post/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post", "Notification", "Dashboard"],
    }),
    updatePost: builder.mutation<PostResponse, { id: string; data: Partial<PostPayload> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/post/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Post", "Dashboard"],
    }),
    deletePost: builder.mutation<PostResponse, string>({
      query: (id) => ({
        url: `/api/v1/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post", "Dashboard"],
    }),
    publishPost: builder.mutation<PostResponse, string>({
      query: (id) => ({
        url: `/api/v1/post/${id}/publish`,
        method: "POST",
      }),
      invalidatesTags: ["Post", "Notification", "Dashboard"],
    }),
    schedulePost: builder.mutation<PostResponse, { id: string; scheduledAt: string }>({
      query: ({ id, scheduledAt }) => ({
        url: `/api/v1/post/${id}/schedule`,
        method: "POST",
        body: { scheduledAt },
      }),
      invalidatesTags: ["Post", "Dashboard"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  usePublishPostMutation,
  useSchedulePostMutation,
} = postApi;

export const mapApiPost = (post: ApiPost): PostData => ({
  id: String(post._id || post.id || ""),
  img: post.img || post.coverImage || "",
  title: post.title,
  cat: post.cat,
  likes: post.likes || 0,
  comments: post.comments || 0,
  date: post.date || "—",
  status: post.status,
  body: post.body,
});
