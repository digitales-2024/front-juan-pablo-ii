import { Observation, ObservationProject } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

interface GetObservationByIdProps {
    id: string;
}

export const observationApi = createApi({
    reducerPath: "observationApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Observation"],
    endpoints: (build) => ({
        //Crear observaciones
        createObservation: build.mutation<Observation, Partial<Observation>>({
            query: (body) => ({
                url: "/observations",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Observation"],
        }),
        //Actualizar observaciones
        updateObservation: build.mutation<
            Observation,
            Partial<Observation> & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/observations/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Observation"],
        }),
        //Obtener observación por id
        getObservationById: build.query<Observation, GetObservationByIdProps>({
            query: ({ id }) => ({
                url: `/observations/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Observation"],
        }),
        //Obtener todos las observaciones de una acta de proyecto
        getAllObservation: build.query<ObservationProject[], { id: string }>({
            query: ({ id }) => ({
                url: `/observations/project-charter/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Observation"],
        }),

        //Eliminar todas las observaciones de un acta de proyecto
        deleteObservationsFromProjectCharters: build.mutation<
            void,
            { ids: string[] }
        >({
            query: (ids) => ({
                url: `/observations/project-charter/removeAll`,
                method: "DELETE",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Observation"],
        }),

        //Eliminar observaciones
        deleteObservations: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/observations/remove/all`,
                method: "DELETE",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Observation"],
        }),
        // Generar Pdf de acta de proyecto
        genPdfProjectCharter: build.mutation<Blob, string>({
            query: (id) => ({
                url: `/observations/${id}/pdf`,
                method: "GET",
                responseHandler: (response: Response) => response.blob(),
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useCreateObservationMutation,
    useUpdateObservationMutation,
    useGetObservationByIdQuery,
    useGetAllObservationQuery,
    useDeleteObservationsMutation,
    useGenPdfProjectCharterMutation,
    useDeleteObservationsFromProjectChartersMutation,
} = observationApi;
