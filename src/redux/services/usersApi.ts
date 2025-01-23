import { CreateUsersSchema, UpdateUsersSchema } from "@/schemas";
import { SendNewPasswordSchema } from "@/schemas/users/sendNewPasswordSchema";
import { User } from "@/types/user";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

//  Interfaz de usuario actualizado
interface UserUpdate {
    data: User;
    message: string;
    statusCode: number;
}

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Users"],
    endpoints: (build) => ({
        // Crear un nuevo usuario
        createUser: build.mutation<CreateUsersSchema, CreateUsersSchema>({
            query: (body) => ({
                url: "users",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),

        // Actualizar información del usuario por id del parametro /users/:id
        updateUser: build.mutation<
            UserUpdate,
            UpdateUsersSchema & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `users/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),

            invalidatesTags: ["Users"],
        }),

        // Eliminar un usuario por id del parametro /users/:id
        deleteUser: build.mutation<User, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),

        // Eliminar varios usuarios
        deleteUsers: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: "users/deactivate/all",
                method: "DELETE",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),

        // Reactivar varios usuarios
        reactivateUsers: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: "users/reactivate/all",
                method: "PATCH",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),

        // Mostrar todos los usuarios
        getUsers: build.query<User[], void>({
            query: () => ({
                url: "users",
                credentials: "include",
            }),
            providesTags: ["Users"],
        }),

        // Generar una constraseña
        generatePassword: build.mutation({
            query: () => ({
                url: "users/generate-password",
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),

        // Enviar un correo con una nueva contraseña
        sendNewPassword: build.mutation<
            SendNewPasswordSchema & { email: string },
            SendNewPasswordSchema & { email: string }
        >({
            query: (data) => ({
                url: "users/send-new-password",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),

        //Reactivar a un usuario
        reactivateUser: build.mutation<User, string>({
            query: (id) => ({
                url: `users/reactivate/${id}`,
                method: "PATCH",
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useUpdateUserMutation,
    useGetUsersQuery,
    useGeneratePasswordMutation,
    useCreateUserMutation,
    useDeleteUserMutation,
    useDeleteUsersMutation,
    useReactivateUsersMutation,
    useSendNewPasswordMutation,
    useReactivateUserMutation,
} = usersApi;
