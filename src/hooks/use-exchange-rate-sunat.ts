import { useGetExchangeRateSunatQuery } from "@/redux/services/exchangeRateSunatApi";
import { CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useExchangeRate = () => {
    const {
        data: exchangeRate,
        error,
        isLoading,
    } = useGetExchangeRateSunatQuery();

    const handleFetchExchangeRate = async () => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    if (error && typeof error === "object" && "data" in error) {
                        const errorMessage = (error.data as CustomErrorData)
                            .message;
                        const message = translateError(errorMessage as string);
                        reject(new Error(message));
                    }
                    if (error) {
                        reject(
                            new Error(
                                "Ocurrió un error inesperado, por favor intenta de nuevo",
                            ),
                        );
                    }
                    resolve(exchangeRate);
                } catch (error) {
                    reject(error);
                }
            });

        toast.promise(promise(), {
            loading: "Obteniendo tipo de cambio...",
            success: "Tipo de cambio obtenido de la Sunat",
            error: (error) => error.message,
        });
    };

    return { exchangeRate, isLoading, handleFetchExchangeRate };
};
