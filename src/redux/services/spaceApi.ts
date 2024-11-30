import { Spaces } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const spacesApi = createApi({
    reducerPath: "spacesApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Space"],
    endpoints: (build) => ({
        //Crear ambientes
        createSpace: build.mutation<Spaces, Partial<Spaces>>({
            query: (body) => ({
                url: "/space",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Space"],
        }),
        //Actualizar ambientes
        updateSpace: build.mutation<Spaces, Partial<Spaces> & { id: string }>({
            query: ({ id, ...body }) => ({
                url: `/space/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Space"],
        }),
        //Obtener ambientes por id
        getSpaceById: build.query<Spaces, string>({
            query: (id) => ({
                url: `/space/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, id) => [{ type: "Space", id }],
        }),
        //Obtener todos los ambientes
        getAllSpace: build.query<Spaces[], void>({
            query: () => ({
                url: "/space",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Space"],
        }),
        //Eliminar ambientes
        desactivateSpace: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/space/remove/all`,
                method: "DELETE",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Space"],
        }),
        //Activar ambientes
        reactivateSpace: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/space/reactivate/all`,
                method: "PATCH",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Space"],
        }),
    }),
});

export const {
    useCreateSpaceMutation,
    useUpdateSpaceMutation,
    useGetSpaceByIdQuery,
    useGetAllSpaceQuery,
    useDesactivateSpaceMutation,
    useReactivateSpaceMutation,
} = spacesApi;
