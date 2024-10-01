import {
  CreateRolesSchema,
  UpdateRolesSchema,
} from "@/schemas/users/rolesSchema";
import { ModulePermissions, Role } from "@/types/roles";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include",
});

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: baseQuery,
  tagTypes: ["Roles"],
  endpoints: (build) => ({
    // Obtener todos los roles
    getRoles: build.query<Role[], void>({
      query: () => ({
        url: `/rol`,
        credentials: "include",
      }),
      providesTags: ["Roles"],
    }),

    // Obtener un rol por id
    getRole: build.query({
      query: (id: string) => ({
        url: `rol/${id}`,
        credentials: "include",
      }),
    }),

    // Crear un nuevo rol
    createRole: build.mutation<Role, CreateRolesSchema>({
      query: (body) => ({
        url: `rol`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),
    // Actualizar un rol por id
  /*   updateRole: build.mutation<Role, UpdateRolesSchema>({
      query: ({ id, ...body }) => ({
        url: `rol/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Roles"],
    }), */
    // Eliminar un rol por id
    deleteRole: build.mutation<void, number>({
      query: (id) => ({
        url: `rol/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),

    // Eliminar varios roles
    deleteRoles: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: "rol/remove/all",
        method: "DELETE",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Roles"],
    }),

    // Reactivar varios roles
    reactivateRoles: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: "rol/reactivate/all",
        method: "PATCH",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Roles"],
    }),

    // Mostrar todos los modulos con sus permisos
    getRolPermissions: build.query<ModulePermissions[], void>({
      query: () => ({
        url: `rol/modules-permissions/all`,
        credentials: "include",
      }),
      providesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
/*   useUpdateRoleMutation, */
  useDeleteRoleMutation,
  useDeleteRolesMutation,
  useGetRolPermissionsQuery,
  useReactivateRolesMutation,
} = rolesApi;
