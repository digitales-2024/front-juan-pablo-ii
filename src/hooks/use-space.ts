import {
    useCreateSpaceMutation,
    useUpdateSpaceMutation,
    useGetAllSpaceQuery,
    useDesactivateSpaceMutation,
    useReactivateSpaceMutation,
} from "@/redux/services/spaceApi";
import { CustomErrorData, Spaces } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useSpaces = () => {
    const {
        data: dataSpacesAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllSpaceQuery();

    const [createSpace, { isSuccess: isSuccessCreateSpace }] =
        useCreateSpaceMutation();

    const [
        updateSpace,
        { isSuccess: isSuccessUpdateSpace, isLoading: isLoadingUpdateSpace },
    ] = useUpdateSpaceMutation();

    const [desactivateSpaces, { isSuccess: isSuccessDeleteSpaces }] =
        useDesactivateSpaceMutation();

    const [
        reactivateSpaces,
        {
            isSuccess: isSuccessReactivateSpaces,
            isLoading: isLoadingReactivateSpaces,
        },
    ] = useReactivateSpaceMutation();

    const onCreateSpace = async (input: Partial<Spaces>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createSpace(input);
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
            loading: "Creando Ambiente...",
            success: "Ambiente creado exitosamente",
            error: (err) => err.message,
        });
    };

    const onUpdateSpace = async (input: Partial<Spaces> & { id: string }) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateSpace(input);
                    if (
                        result.error &&
                        typeof result.error === "object" &&
                        result.error !== null &&
                        "data" in result.error
                    ) {
                        const error = (result.error.data as CustomErrorData)
                            .message;
                        const message = translateError(error as string);
                        reject(new Error(message));
                    }
                    if (result.error) {
                        reject(
                            new Error(
                                "Ocurrió un error inesperado, por favor intenta de nuevo",
                            ),
                        );
                    }
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        toast.promise(promise(), {
            loading: "Actualizando Ambiente...",
            success: "Ambiente actualizado exitosamente",
            error: (err) => err.message,
        });
    };

    const onReactivateSpaces = async (ids: Spaces[]) => {
        const onlyIds = ids.map((space) => space.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await reactivateSpaces(idsString);
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

        toast.promise(promise(), {
            loading: "Reactivando...",
            success: "Ambientes reactivados",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onDesactivateSpaces = async (ids: Spaces[]) => {
        const onlyIds = ids.map((space) => space.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await desactivateSpaces(idsString);
                    if (
                        result.error &&
                        typeof result.error === "object" &&
                        result.error !== null &&
                        "data" in result.error
                    ) {
                        const error = (result.error.data as CustomErrorData)
                            .message;
                        const message = translateError(error as string);
                        reject(new Error(message));
                    } else if (result.error) {
                        reject(
                            new Error(
                                "Ocurrió un error inesperado, por favor intenta de nuevo",
                            ),
                        );
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        toast.promise(promise(), {
            loading: "Eliminando...",
            success: "Ambientes eliminados",
            error: (error) => {
                return error.message;
            },
        });
    };
    return {
        dataSpacesAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        onCreateSpace,
        isSuccessCreateSpace,
        onUpdateSpace,
        isSuccessUpdateSpace,
        isLoadingUpdateSpace,
        onDesactivateSpaces,
        isSuccessDeleteSpaces,
        onReactivateSpaces,
        isSuccessReactivateSpaces,
        isLoadingReactivateSpaces,
    };
};
