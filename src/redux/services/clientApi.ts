import { Client, ClientWithDescription } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const clientsApi = createApi({
    reducerPath: "clientsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Client"],
    endpoints: (build) => ({
        //Crear clientes
        createClient: build.mutation<Client, Partial<Client>>({
            query: (body) => ({
                url: "/clients",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Client"],
        }),
        //Actualizar clientes
        updateClient: build.mutation<Client, Partial<Client> & { id: string }>({
            query: ({ id, ...body }) => ({
                url: `/clients/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Client"],
        }),
        //Obtener cliente por id
        getClientById: build.query<Client, string>({
            query: (id) => ({
                url: `/clients/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, id) => [{ type: "Client", id }],
        }),
        //Obtener todos los clientes
        getAllClients: build.query<ClientWithDescription[], void>({
            query: () => ({
                url: "/clients",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Client"],
        }),
        //Eliminar clientes
        deleteClients: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/clients/remove/all`,
                method: "DELETE",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Client"],
        }),
        //Activar clientes
        reactivateClients: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/clients/reactivate/all`,
                method: "PATCH",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Client"],
        }),
    }),
});

export const {
    useCreateClientMutation,
    useUpdateClientMutation,
    useGetClientByIdQuery,
    useGetAllClientsQuery,
    useDeleteClientsMutation,
    useReactivateClientsMutation,
} = clientsApi;
