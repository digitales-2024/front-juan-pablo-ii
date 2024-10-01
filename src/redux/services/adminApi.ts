import { User } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include",
});

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQuery,
  tagTypes: ["Admin"],
  endpoints: (build) => ({
    profile: build.query<User, void>({
      query: () => ({
        url: "/profile",
      }),
      providesTags: ["Admin"],
    }),
    updatePassword: build.mutation<
      User,
      {
        password: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({
        url: "/update-password",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const { useProfileQuery, useUpdatePasswordMutation } = adminApi;