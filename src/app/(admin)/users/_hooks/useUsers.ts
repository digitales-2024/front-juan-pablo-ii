import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createUser,
	deleteUser,
	sendNewPassword,
	updateUser,
} from "../actions";
import { toast } from "sonner";
import {
	SendEmailDto,
	UserCreateDto,
	UserResponseDto,
	UserUpdateDto,
} from "../types";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateUserVariables {
	id: string;
	data: UserUpdateDto;
}

export const useUsers = () => {
	const queryClient = useQueryClient();

	// Mutación para crear usuario
	const createMutation = useMutation<UserResponseDto, Error, UserCreateDto>({
		mutationFn: async (data) => {
			const response = await createUser(data);
			if ("error" in response) {
				throw new Error(response.error);
			}
			return response;
		},
		onSuccess: (newUser) => {
			// Actualizar la caché de usuarios
			queryClient.setQueryData<UserResponseDto[]>(
				["users"],
				(oldUsers) => {
					if (!oldUsers) return [newUser];
					return [...oldUsers, newUser];
				}
			);

			toast.success("Usuario creado exitosamente");
		},
		onError: (error: Error) => {
			// Manejar diferentes tipos de errores
			if (
				error.message.includes("no autorizado") ||
				error.message.includes("sesión expirada")
			) {
				toast.error(
					"Sesión expirada. Por favor, inicie sesión nuevamente"
				);
				// TODO: Redirigir al login
				return;
			}

			toast.error(error.message);
		},
	});

	// Mutación para actualizar usuario
	const updateMutation = useMutation<
		UserResponseDto,
		Error,
		UpdateUserVariables
	>({
		mutationFn: async ({ id, data }) => {
			const response = await updateUser(id, data);
			if ("error" in response) {
				throw new Error(response.error);
			}
			return response;
		},
		onSuccess: (updatedUser) => {
			// Actualizar la caché de usuarios
			queryClient.setQueryData<UserResponseDto[]>(
				["users"],
				(oldUsers) => {
					if (!oldUsers) return [updatedUser];
					return oldUsers.map((user) =>
						user.id === updatedUser.id ? updatedUser : user
					);
				}
			);

			toast.success("Usuario actualizado exitosamente");
		},
		onError: (error: Error) => {
			// Manejar diferentes tipos de errores
			if (
				error.message.includes("no autorizado") ||
				error.message.includes("sesión expirada")
			) {
				toast.error(
					"Sesión expirada. Por favor, inicie sesión nuevamente"
				);
				// TODO: Redirigir al login
				return;
			}

			toast.error(error.message);
		},
	});

	const sendNewPasswordMutation = useMutation<
		{ error?: string },
		Error,
		SendEmailDto
	>({
		mutationFn: async (data) => {
			const response = await sendNewPassword(data);
			if ("error" in response) {
				throw new Error(response.error);
			}
			return response;
		},
		onSuccess: () => {
			toast.success("Nueva contraseña enviada exitosamente");
		},
		onError: (error: Error) => {
			if (
				error.message.includes("no autorizado") ||
				error.message.includes("sesión expirada")
			) {
				toast.error(
					"Sesión expirada. Por favor, inicie sesión nuevamente"
				);
				return;
			}
			toast.error(error.message);
		},
	});

	const deleteUserMutation = useMutation<BaseApiResponse, Error, string>({
		mutationFn: async (id) => {
			const response = await deleteUser(id);
			if ("error" in response) {
				throw new Error(response.error);
			}
			return response;
		},
		onSuccess: (response) => {
			toast.success(response.message);
		},
		onError: (error: Error) => {
			if (
				error.message.includes("no autorizado") ||
				error.message.includes("sesión expirada")
			) {
				toast.error(
					"Sesión expirada. Por favor, inicie sesión nuevamente"
				);
				return;
			}
			toast.error(error.message);
		},
	});

	return {
		// Mutations
		createUser: createMutation.mutate,
		isCreating: createMutation.isPending,
		createError: createMutation.error,
		updateUser: updateMutation.mutate,
		isUpdating: updateMutation.isPending,
		updateError: updateMutation.error,
		sendNewPassword: sendNewPasswordMutation.mutate,
		isLoadingSendNewPassword: sendNewPasswordMutation.isPending,
		isSuccessSendNewPassword: sendNewPasswordMutation.isSuccess,
		sendNewPasswordError: sendNewPasswordMutation.error,
		deleteUser: deleteUserMutation.mutate,
		isDeleting: deleteUserMutation.isPending,
		deleteError: deleteUserMutation.error,
	};
};
