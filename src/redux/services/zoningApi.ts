import { Zoning } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

interface GetZoningByIdProps {
    id: string;
}

export const zoningApi = createApi({
    reducerPath: "zoningApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Zoning"],
    endpoints: (build) => ({
        //Crear zonificaciones
        createZoning: build.mutation<Zoning, Partial<Zoning>>({
            query: (body) => ({
                url: "/zoning",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Zoning"],
        }),
        //Actualizar zonificaciones
        updateZoning: build.mutation<Zoning, Partial<Zoning> & { id: string }>({
            query: ({ id, ...body }) => ({
                url: `/zoning/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Zoning"],
        }),
        //Obtener zonificación por id
        getZoningById: build.query<Zoning, GetZoningByIdProps>({
            query: ({ id }) => ({
                url: `/zoning/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Zoning"],
        }),
        //Obtener todos los zonificaciones
        getAllZoning: build.query<Zoning[], void>({
            query: () => ({
                url: "/zoning",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Zoning"],
        }),
        //Eliminar zonificaciones
        deleteZoning: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/zoning/remove/all`,
                method: "DELETE",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Zoning"],
        }),
        //Activar zonificaciones
        reactivateZoning: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/zoning/reactivate/all`,
                method: "PATCH",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Zoning"],
        }),
    }),
});

export const {
    useCreateZoningMutation,
    useUpdateZoningMutation,
    useGetZoningByIdQuery,
    useGetAllZoningQuery,
    useDeleteZoningMutation,
    useReactivateZoningMutation,
} = zoningApi;
