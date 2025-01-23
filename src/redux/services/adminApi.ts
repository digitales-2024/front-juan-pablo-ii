import { User, UserProfileOutput } from "@/types/user";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Admin"],
    endpoints: (build) => ({
        profile: build.query<User, void>({
            query: () => ({
                url: "/profile",
            }),
            providesTags: ["Admin"],
        }),
        updatePassword: build.mutation<User, UserProfileOutput>({
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
