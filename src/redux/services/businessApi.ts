import {
    CreateBusinessSchema,
    UpdateBusinessSchema,
} from "@/schemas/business/CreateBusinessSchema";
import { Business } from "@/types/business";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const businessApi = createApi({
    reducerPath: "businessApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Business"],
    endpoints: (build) => ({
        // Crear un nuevo usuario
        createBusiness: build.mutation<void, CreateBusinessSchema>({
            query: (body) => ({
                url: "business",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Business"],
        }),

        // obtener todos los business
        getBusiness: build.query<Business[], void>({
            query: () => ({
                url: "business",
            }),
            providesTags: ["Business"],
        }),

        // Actualizar un business por id
        updateBusiness: build.mutation<
            void,
            UpdateBusinessSchema & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `business/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Business"],
        }),
    }),
});

export const {
    useCreateBusinessMutation,
    useGetBusinessQuery,
    useUpdateBusinessMutation,
} = businessApi;
