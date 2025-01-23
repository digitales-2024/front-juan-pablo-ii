import {
    useCreateObservationMutation,
    useDeleteObservationsFromProjectChartersMutation,
    useDeleteObservationsMutation,
    useGenPdfProjectCharterMutation,
    useGetAllObservationQuery,
    useGetObservationByIdQuery,
    useUpdateObservationMutation,
} from "@/redux/services/observationApi";
import { CustomErrorData, Observation, ProjectCharter } from "@/types";
import { translateError } from "@/utils/translateError";
import { format } from "date-fns";
import { toast } from "sonner";

interface UseObservationProps {
    id?: string;
    idProjectCharter?: string;
}

export const useObservation = (options: UseObservationProps = {}) => {
    const { id, idProjectCharter } = options;

    const { data: observationById, refetch: refetchObservationById } =
        useGetObservationByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    const {
        data: observationByProjectCharter,
        refetch: refetchObservationByProjectCharter,
    } = useGetAllObservationQuery(
        { id: idProjectCharter as string },
        {
            skip: !idProjectCharter, // Evita hacer la query si no hay id
        },
    );

    const [createObservation, { isSuccess: isSuccessCreateObservation }] =
        useCreateObservationMutation();

    const [
        updateObservation,
        {
            isSuccess: isSuccessUpdateObservation,
            isLoading: isLoadingUpdateObservation,
        },
    ] = useUpdateObservationMutation();

    const [deleteObservation, { isSuccess: isSuccessDeleteObservation }] =
        useDeleteObservationsMutation();

    const [genPdfProjectCharter] = useGenPdfProjectCharterMutation();

    const [
        deleteObservationsFromProjectCharters,
        { isSuccess: isSuccessDeleteObservationsFromProjectCharters },
    ] = useDeleteObservationsFromProjectChartersMutation();

    const onCreateObservation = async (input: Partial<Observation>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createObservation(input);
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
            loading: "Creando observación...",
            success: "Observación creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateObservation = async (
        input: Partial<Observation> & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateObservation(input);
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
            loading: "Actualizando observación...",
            success: "Observación actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onDeleteObservation = async (ids: Observation[]) => {
        const onlyIds = ids.map((observation) => observation.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteObservation(idsString);
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
            loading: "Eliminando observación...",
            success: "Observación eliminado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    const exportProjectCharterToPdf = async (
        id: string,
        codeProject: string,
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await genPdfProjectCharter(id).unwrap();

                    // Crear el enlace de descarga
                    const url = window.URL.createObjectURL(result);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                        "download",
                        `ACTA-PROYECTO-${codeProject}-${format(new Date(), "yyyy-MM-dd")}.pdf`,
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
            loading: "Descargando acta de proyecto en PDF...",
            success: "Acta de proyecto descargada con éxito en PDF",
            error: (err) => err.message,
        });
    };

    const onDeleteObservationsFromProjectCharters = async (
        ids: ProjectCharter[],
    ) => {
        const onlyIds = ids.map((projectCharter) => projectCharter.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result =
                        await deleteObservationsFromProjectCharters(idsString);
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
            loading: "Eliminando todas las observaciones...",
            success: "Observaciones eliminadas con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };
    return {
        observationById,
        observationByProjectCharter,
        refetchObservationById,
        refetchObservationByProjectCharter,
        onCreateObservation,
        isSuccessCreateObservation,
        onUpdateObservation,
        isSuccessUpdateObservation,
        isLoadingUpdateObservation,
        onDeleteObservation,
        isSuccessDeleteObservation,
        exportProjectCharterToPdf,
        onDeleteObservationsFromProjectCharters,
        isSuccessDeleteObservationsFromProjectCharters,
    };
};
