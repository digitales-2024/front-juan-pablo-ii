import { useLogoutMutation } from "@/redux/services/authApi";
import { CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const useLogout = () => {
    const [logout, { isLoading, error, isSuccess }] = useLogoutMutation();

    const signOut = async () => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await logout();
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
            loading: "Cerrando sesión...",
            success: "Sesión cerrada correctamente",
            error: (error) => error.message,
        });
    };

    const router = useRouter();

    useEffect(() => {
        if (isSuccess) {
            router.push("/log-in");
        }
    }, [isSuccess, router]);

    return { signOut, isLoading, error };
};
