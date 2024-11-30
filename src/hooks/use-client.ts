import {
    useCreateClientMutation,
    useDeleteClientsMutation,
    useGetAllClientsQuery,
    useReactivateClientsMutation,
    useUpdateClientMutation,
} from "@/redux/services/clientApi";
import { Client, CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useClients = () => {
    const {
        data: dataClientsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllClientsQuery();

    const [createClient, { isSuccess: isSuccessCreateClient }] =
        useCreateClientMutation();

    const [
        updateClient,
        { isSuccess: isSuccessUpdateClient, isLoading: isLoadingUpdateClient },
    ] = useUpdateClientMutation();

    const [deleteClients, { isSuccess: isSuccessDeleteClients }] =
        useDeleteClientsMutation();

    const [
        reactivateClients,
        {
            isSuccess: isSuccessReactivateClients,
            isLoading: isLoadingReactivateClients,
        },
    ] = useReactivateClientsMutation();

    const onCreateClient = async (input: Partial<Client>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createClient(input);
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
            loading: "Creando cliente...",
            success: "Cliente creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateClient = async (input: Partial<Client> & { id: string }) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateClient(input);
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
            loading: "Actualizando cliente...",
            success: "Cliente actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onReactivateClients = async (ids: Client[]) => {
        const onlyIds = ids.map((client) => client.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await reactivateClients(idsString);
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
            success: "Clientes reactivados con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onDeleteClients = async (ids: Client[]) => {
        const onlyIds = ids.map((client) => client.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteClients(idsString);
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
            success: "Clientes eliminados con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };
    return {
        dataClientsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        onCreateClient,
        isSuccessCreateClient,
        onUpdateClient,
        isSuccessUpdateClient,
        isLoadingUpdateClient,
        onDeleteClients,
        isSuccessDeleteClients,
        onReactivateClients,
        isSuccessReactivateClients,
        isLoadingReactivateClients,
    };
};
