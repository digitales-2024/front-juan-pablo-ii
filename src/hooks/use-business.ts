import {
    useCreateBusinessMutation,
    useGetBusinessQuery,
    useUpdateBusinessMutation,
} from "@/redux/services/businessApi";
import {
    CreateBusinessSchema,
    UpdateBusinessSchema,
} from "@/schemas/business/CreateBusinessSchema";
import { CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useBusiness = () => {
    const { data, error, isLoading } = useGetBusinessQuery();
    const [
        createBusiness,
        { isSuccess: isSuccessCreateBusiness, isLoading: isCreateLoading },
    ] = useCreateBusinessMutation();
    const [
        updateBusiness,
        {
            isSuccess: isSuccessUpdateBusiness,
            isLoading: isLoadingUpdateBusiness,
        },
    ] = useUpdateBusinessMutation();

    const onCreateBusiness = async (input: CreateBusinessSchema) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createBusiness(input);
                    if (
                        result.error &&
                        typeof result.error === "object" &&
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
            loading: "Creando negocio...",
            success: "Datos del negocio creados con éxito",
            error: (error) => error.message,
        });
    };

    const onUpdateBusiness = async (
        input: UpdateBusinessSchema & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateBusiness(input);
                    if (
                        result.error &&
                        typeof result.error === "object" &&
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
            loading: "Actualizando datos del negocio...",
            success: "Datos del negocio actualizados con éxito",
            error: (error) => error.message,
        });
    };

    return {
        data,
        error,
        isLoading: isLoading || isCreateLoading || isLoadingUpdateBusiness,
        onCreateBusiness,
        onUpdateBusiness,
        isSuccessCreateBusiness,
        isSuccessUpdateBusiness,
        isLoadingUpdateBusiness,
    };
};
