import {
    useGetAllProjectCharterQuery,
    useGetProjectCharterByIdQuery,
} from "@/redux/services/projectCharterApi";

interface UseProjectCharterProps {
    id?: string;
}

export const useProjectCharter = (options: UseProjectCharterProps = {}) => {
    const { id } = options;

    const {
        data: dataProjectCharterAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllProjectCharterQuery();

    const { data: projectCharterById, refetch: refetchProjectCharterById } =
        useGetProjectCharterByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    return {
        dataProjectCharterAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        projectCharterById,
        refetchProjectCharterById,
    };
};
