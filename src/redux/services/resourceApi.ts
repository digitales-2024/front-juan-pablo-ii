import { Resource } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

interface GetResourceByIdProps {
    id: string;
}
interface GetResourceByTypeProps {
    type: string;
}

export const resourceApi = createApi({
    reducerPath: "resourceApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Resource"],
    endpoints: (build) => ({
        createResource: build.mutation<Resource, Partial<Resource>>({
            query: (body) => ({
                url: "/resources",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Resource"],
        }),

        updateResource: build.mutation<Resource, Partial<Resource>>({
            query: ({ id, ...body }) => ({
                url: `/resources/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Resource"],
        }),

        getResourceById: build.query<Resource, GetResourceByIdProps>({
            query: ({ id }) => ({
                url: `/resources/item/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Resource"],
        }),

        getResourcesByType: build.query<Resource, GetResourceByTypeProps>({
            query: ({ type }) => ({
                url: `/resources/${type}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Resource"],
        }),

        deleteResources: build.mutation<void, { ids: string[] }>({
            query: (body) => ({
                url: `/resources/remove/all`,
                method: "DELETE",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Resource"],
        }),

        reactivateResources: build.mutation<void, { ids: string[] }>({
            query: (body) => ({
                url: `/resources/reactivate/all`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Resource"],
        }),
    }),
});

export const {
    useCreateResourceMutation,
    useUpdateResourceMutation,
    useGetResourceByIdQuery,
    useGetResourcesByTypeQuery,
    useDeleteResourcesMutation,
    useReactivateResourcesMutation,
} = resourceApi;
