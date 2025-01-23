import {
    useCreateQuotationMutation,
    useGenPdfQuotationMutation,
    useGetAllQuotationsQuery,
    useGetQuotationByIdQuery,
    useUpdateQuotationMutation,
    useUpdateStatusQuotationMutation,
} from "@/redux/services/quotationApi";
import {
    CustomErrorData,
    QuotationStatusType,
    QuotationStructure,
} from "@/types";
import { translateError } from "@/utils/translateError";
import { format } from "date-fns";
import { toast } from "sonner";

interface UseQuotationsProps {
    id?: string;
}

export const useQuotations = (options: UseQuotationsProps = {}) => {
    const { id } = options;
    const {
        data: dataQuotationsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllQuotationsQuery();

    const { data: quotationById, refetch: refetchQuotationsById } =
        useGetQuotationByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    const [createQuotation, { isSuccess: isSuccessCreateQuotation }] =
        useCreateQuotationMutation();

    const [
        updateQuotationStatus,
        { isSuccess: isSuccessUpdateQuotationStatus },
    ] = useUpdateStatusQuotationMutation();

    const [genPdfQuotation] = useGenPdfQuotationMutation();

    const [
        updateQuotation,
        {
            isSuccess: isSuccessUpdateQuotation,
            isLoading: isLoadingUpdateQuotation,
        },
    ] = useUpdateQuotationMutation();

    const onCreateQuotation = async (input: Partial<QuotationStructure>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createQuotation(input);
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
            loading: "Creando cotización...",
            success: "Cotización creada con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateQuotationStatus = async (
        id: string,
        newStatus: QuotationStatusType,
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateQuotationStatus({
                        id,
                        newStatus,
                    });
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
            loading: "Actualizando estado de cotización...",
            success: "Estado de cotización actualizado con éxito",
            error: (err) => err.message,
        });
    };

    const exportQuotationToPdf = async (id: string, publicCode: number) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await genPdfQuotation(id).unwrap();

                    // Crear el enlace de descarga
                    const url = window.URL.createObjectURL(result);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                        "download",
                        `COT-DIS-${publicCode}-${format(new Date(), "yyyy-MM-dd")}.pdf`,
                    );

                    // Añadir el enlace al DOM y disparar la descarga
                    document.body.appendChild(link);
                    link.click();

                    // Eliminar el enlace temporal del DOM
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url); // Limpiar el objeto URL

                    resolve(result);
                } catch (error) {
                    if (error && typeof error === "object" && "data" in error) {
                        const errorMessage = (error.data as CustomErrorData)
                            .message;
                        const message = translateError(errorMessage as string);
                        reject(new Error(message));
                    } else {
                        reject(
                            new Error(
                                "Ocurrió un error inesperado, por favor intenta de nuevo",
                            ),
                        );
                    }
                }
            });

        return toast.promise(promise(), {
            loading: "Descargando cotización en PDF...",
            success: "Cotización descargada con éxito en PDF",
            error: (err) => err.message,
        });
    };

    const onUpdateQuotation = async (
        input: Partial<QuotationStructure> & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateQuotation(input);
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
            loading: "Actualizando cotización...",
            success: "Cotización actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    return {
        dataQuotationsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        onCreateQuotation,
        isSuccessCreateQuotation,
        onUpdateQuotationStatus,
        isSuccessUpdateQuotationStatus,
        exportQuotationToPdf,
        quotationById,
        refetchQuotationsById,
        onUpdateQuotation,
        isSuccessUpdateQuotation,
        isLoadingUpdateQuotation,
    };
};
