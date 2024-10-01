import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminApi } from "./adminApi";
import { UserLogin } from "@/types";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include",
});

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: baseQuery,
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    login: build.mutation<UserLogin, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            adminApi.endpoints.profile.initiate(undefined, {
              forceRefetch: true,
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: ["Auth"],
    }),
    updatePassword: build.mutation<
      UserLogin,
      {
        email: string;
        password: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({
        url: "/auth/update-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: build.mutation<{ message: string; statusCode: number }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useUpdatePasswordMutation,
  useLogoutMutation,
} = authApi;