import { ProjectCharter } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

interface GetProjectCharterByIdProps {
    id: string;
}

export const projectCharterApi = createApi({
    reducerPath: "projectCharterApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Project Charter"],
    endpoints: (build) => ({
        //Obtener una acta de proyecto por id
        getProjectCharterById: build.query<
            ProjectCharter,
            GetProjectCharterByIdProps
        >({
            query: ({ id }) => ({
                url: `/project-charter/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Project Charter"],
        }),
        //Obtener todas las actas de proyectos
        getAllProjectCharter: build.query<ProjectCharter[], void>({
            query: () => ({
                url: "/project-charter",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Project Charter"],
        }),
    }),
});

export const { useGetAllProjectCharterQuery, useGetProjectCharterByIdQuery } =
    projectCharterApi;
