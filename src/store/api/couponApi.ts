import { baseApi } from "./baseApi";

export interface ICoupon {
  _id?: string;
  code: string;
  discount: string | number;
  discountType?: "percentage" | "fixed";
  expiry?: string;
  expiryDate?: string;
  limit: number;
  used: number;
  status: "Active" | "Inactive" | "Exhausted" | "Expired" | string;
  applicablePlans?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CouponApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ICoupon[];
}

export interface SingleCouponApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ICoupon;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query<CouponApiResponse, void>({
      query: () => ({
        url: "/api/v1/coupon",
        method: "GET",
      }),
      providesTags: ["Coupon"],
    }),
    getCouponDetail: builder.query<SingleCouponApiResponse, string>({
      query: (id) => ({
        url: `/api/v1/coupon/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Coupon", id }],
    }),
    createCoupon: builder.mutation<SingleCouponApiResponse, Partial<ICoupon>>({
      query: (body) => ({
        url: "/api/v1/coupon/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: builder.mutation<SingleCouponApiResponse, { id: string; data: Partial<ICoupon> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/coupon/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation<SingleCouponApiResponse, string>({
      query: (id) => ({
        url: `/api/v1/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
    validateCoupon: builder.mutation<SingleCouponApiResponse, { code: string }>({
      query: (body) => ({
        url: "/api/v1/coupon/validate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetCouponDetailQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
} = couponApi;
