import {
    useProfileQuery,
    useUpdatePasswordMutation,
} from "@/redux/services/adminApi";
import { useUpdateUserMutation } from "@/redux/services/usersApi";
import { UpdateUsersSchema } from "@/schemas";
import { CustomErrorData } from "@/types";
import { FormUpdateSecurityProps } from "@/types/form";
import { User } from "@/types/user";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

import { useAuth } from "./use-auth";
import { useLogout } from "./use-logout";

export const useProfile = () => {
    const { setUser } = useAuth();
    const { signOut } = useLogout();

    const { data: user, refetch } = useProfileQuery();
    const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();

    const onUpdate = async (dataForm: UpdateUsersSchema) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    if (!user) {
                        return reject(new Error("No se encontró el usuario"));
                    }
                    const result = await updateUser({
                        id: user.id,
                        ...dataForm,
                    });
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
                    resolve(result);
                    setUser(result?.data?.data as User);
                } catch (error) {
                    reject(error);
                }
            });

        toast.promise(promise(), {
            loading: "Actualizando información...",
            success: "información actualizado correctamente",
            error: (error) => error.message,
        });
    };

    const [updatePassword, { isLoading: isLoadingUpdatePassword }] =
        useUpdatePasswordMutation();

    const onUpdatePassword = async (data: FormUpdateSecurityProps) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updatePassword(data);
                    if (
                        result.error &&
                        typeof result.error === "object" &&
                        "data" in result.error
                    ) {
                        const error = (result.error.data as CustomErrorData)
                            .message;

                        const message = translateError(error as string);
                        reject(new Error(message));
                        return;
                    }
                    resolve(result);
                    signOut();
                } catch (error) {
                    reject(error);
                }
            });

        toast.promise(promise(), {
            loading: "Actualizando contraseña...",
            success: "Contraseña actualizada correctamente",
            error: (error) => error.message,
        });
    };

    return {
        user,
        onUpdate,
        refetch,
        isLoading,
        isSuccess,
        onUpdatePassword,
        isLoadingUpdatePassword,
    };
};
