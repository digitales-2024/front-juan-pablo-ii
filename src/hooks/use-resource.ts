import {
    useCreateResourceMutation,
    useDeleteResourcesMutation,
    useGetResourceByIdQuery,
    useGetResourcesByTypeQuery,
    useReactivateResourcesMutation,
    useUpdateResourceMutation,
} from "@/redux/services/resourceApi";
import { CustomErrorData, Resource, ResourceType } from "@/types";
import { ResourceArray } from "@/types/resource";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

interface UseResourceProps {
    id?: string;
    type?: ResourceType;
}

export const useResource = (options: UseResourceProps = {}) => {
    const { id, type } = options;

    const { data: resourceById, refetch: refetchResourceById } =
        useGetResourceByIdQuery(
            { id: id as string },
            {
                skip: !id,
            },
        );

    const {
        data: resourceByType,
        refetch: refetchResourceByType,
        isLoading: isLoadingResourceByType,
    } = useGetResourcesByTypeQuery(
        { type: type as ResourceType },
        {
            skip: !type,
        },
    ) as unknown as {
        data: ResourceArray;
        refetch: () => void;
        isLoading: boolean;
    };
    const [createResource, { isSuccess: isSuccessCreateResource }] =
        useCreateResourceMutation();

    const [
        updateResource,
        {
            isSuccess: isSuccessUpdateResource,
            isLoading: isLoadingUpdateResource,
        },
    ] = useUpdateResourceMutation();

    const [deleteResources, { isSuccess: isSuccessDeleteResource }] =
        useDeleteResourcesMutation();

    const [
        reactivateResources,
        {
            isSuccess: isSuccessReactivateResource,
            isLoading: isLoadingReactivateResource,
        },
    ] = useReactivateResourcesMutation();

    const onCreateResource = async (input: Partial<Resource>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createResource(input);

                    if (result.error) {
                        if (
                            typeof result.error === "object" &&
                            "data" in result.error
                        ) {
                            const error = (result.error.data as CustomErrorData)
                                .message;
                            const message = translateError(error as string);
                            reject(new Error(message));
                        } else {
                            reject(
                                new Error(
                                    "Ocurrió un error inesperado, por favor intenta de nuevo",
                                ),
                            );
                        }
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        return toast.promise(promise(), {
            loading: "Creando recurso...",
            success: "Recurso creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateResource = async (
        input: Partial<Resource> & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateResource(input);
                    if (result.error) {
                        if (
                            typeof result.error === "object" &&
                            "data" in result.error
                        ) {
                            const error = (result.error.data as CustomErrorData)
                                .message;
                            const message = translateError(error as string);
                            reject(new Error(message));
                        } else {
                            reject(
                                new Error(
                                    "Ocurrió un error inesperado, por favor intenta de nuevo",
                                ),
                            );
                        }
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        return toast.promise(promise(), {
            loading: "Actualizando recurso...",
            success: "Recurso actualizado con éxito",
            error: (err) => err.message,
        });
    };

    const onDeleteResources = async (resources: Resource[]) => {
        const ids = resources.map((resource) => resource.id);
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteResources({ ids });
                    if (result.error) {
                        if (
                            typeof result.error === "object" &&
                            "data" in result.error
                        ) {
                            const error = (result.error.data as CustomErrorData)
                                .message;
                            const message = translateError(error as string);
                            reject(new Error(message));
                        } else {
                            reject(
                                new Error(
                                    "Ocurrió un error inesperado, por favor intenta de nuevo",
                                ),
                            );
                        }
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        return toast.promise(promise(), {
            loading: "Eliminando recursos...",
            success: "Recursos eliminados con éxito",
            error: (err) => err.message,
        });
    };

    const onReactivateResources = async (resources: Resource[]) => {
        const ids = resources.map((resource) => resource.id);
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await reactivateResources({ ids });
                    if (result.error) {
                        if (
                            typeof result.error === "object" &&
                            "data" in result.error
                        ) {
                            const error = (result.error.data as CustomErrorData)
                                .message;
                            const message = translateError(error as string);
                            reject(new Error(message));
                        } else {
                            reject(
                                new Error(
                                    "Ocurrió un error inesperado, por favor intenta de nuevo",
                                ),
                            );
                        }
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        return toast.promise(promise(), {
            loading: "Reactivando recursos...",
            success: "Recursos reactivados con éxito",
            error: (err) => err.message,
        });
    };

    return {
        resourceById,
        refetchResourceById,
        resourceByType,
        refetchResourceByType,
        onCreateResource,
        isSuccessCreateResource,
        onUpdateResource,
        isSuccessUpdateResource,
        isLoadingUpdateResource,
        onDeleteResources,
        isSuccessDeleteResource,
        onReactivateResources,
        isSuccessReactivateResource,
        isLoadingReactivateResource,
        isLoadingResourceByType,
    };
};
