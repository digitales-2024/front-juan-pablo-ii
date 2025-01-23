import {
    useGetUsersQuery,
    useGeneratePasswordMutation,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUsersMutation,
    useReactivateUsersMutation,
    useSendNewPasswordMutation,
    useDeleteUserMutation,
    useReactivateUserMutation,
} from "@/redux/services/usersApi";
import { CreateUsersSchema, UpdateUsersSchema } from "@/schemas";
import { SendNewPasswordSchema } from "@/schemas/users/sendNewPasswordSchema";
import { CustomErrorData, User } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useUsers = () => {
    const { data, error, isLoading } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [reactivateUser] = useReactivateUserMutation();
    const [generatePassword, { data: password }] =
        useGeneratePasswordMutation();
    const [createUser, { isSuccess: isSuccessCreateUser }] =
        useCreateUserMutation();
    const [
        updateUser,
        { isSuccess: isSuccessUpdateUser, isLoading: isLoadingUpdateUser },
    ] = useUpdateUserMutation();
    const [deleteUsers, { isSuccess: isSuccessDeleteUsers }] =
        useDeleteUsersMutation();
    const onDesactivateUser = async (id: string) => {
        const promise = async () => await deleteUser(id).unwrap();

        toast.promise(promise(), {
            loading: "Desactivando usuario...",
            success: "Usuario desactivado exitosamente",
            error: (error) => error.message,
        });
    };

    const onReactivateUser = async (id: string) => {
        const promise = async () => await reactivateUser(id).unwrap();

        toast.promise(promise(), {
            loading: "Desactivando usuario...",
            success: "Usuario desactivado exitosamente",
            error: (error) => error.message,
        });
    };

    const [
        reactivateUsers,
        {
            isSuccess: isSuccessReactivateUsers,
            isLoading: isLoadingReactivateUsers,
        },
    ] = useReactivateUsersMutation();

    const [
        sendNewPassword,
        {
            data: dataSendNewPassword,
            isSuccess: isSuccessSendNewPassword,
            isLoading: isLoadingSendNewPasswrod,
        },
    ] = useSendNewPasswordMutation();

    const handleGeneratePassword = async () => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await generatePassword(null);
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
            loading: "Generando...",
            success: "Contraseña generada",
            error: (error) => error.message,
        });
    };

    const onCreateUser = async (input: CreateUsersSchema) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createUser(input);
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
            loading: "Creando y Enviando correo...",
            success: "Usuario creado y envío exitoso.",
            error: (error) => error.message,
        });
    };

    const onUpdateUser = async (input: UpdateUsersSchema & { id: string }) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateUser(input);
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
            loading: "Actualizando...",
            success: "Usuario actualizado",
            error: (error) => error.message,
        });
    };

    const onDeleteUsers = async (ids: User[]) => {
        const onlyIds = ids.map((user) => user.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteUsers(idsString);
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
            loading: "Eliminando...",
            success: "Usuarios eliminados",
            error: (error) => error.message,
        });
    };

    const onReactivateUsers = async (ids: User[]) => {
        const onlyIds = ids.map((user) => user.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await reactivateUsers(idsString);
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
            loading: "Reactivando...",
            success: "Usuarios reactivados",
            error: (error) => error.message,
        });
    };

    const onSendNewPassword = async (
        data: SendNewPasswordSchema & { email: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await sendNewPassword(data);
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
            loading: "Enviando correo...",
            success: "Envío exitoso.",
            error: (error) => error.message,
        });
    };

    return {
        data,
        error,
        isLoading,
        handleGeneratePassword,
        password,
        onCreateUser,
        isSuccessCreateUser,
        onDesactivateUser,
        onDeleteUsers,
        isSuccessDeleteUsers,
        onReactivateUsers,
        onReactivateUser,
        isSuccessReactivateUsers,
        isLoadingReactivateUsers,
        onUpdateUser,
        isSuccessUpdateUser,
        isLoadingUpdateUser,
        onSendNewPassword,
        isSuccessSendNewPassword,
        isLoadingSendNewPasswrod,
        dataSendNewPassword,
    };
};
