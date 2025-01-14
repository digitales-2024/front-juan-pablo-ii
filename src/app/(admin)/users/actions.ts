import { serverFetch } from "@/utils/serverFetch";
import { User, UserCreateDto } from "./types";
import { revalidatePath } from "next/cache";
import generator from "generate-password-ts";

/**
 * Obtiene la lista de usuarios del servidor.
 *
 * @returns {Promise<User[]>} Una promesa que resuelve a una variedad de usuarios.
 */

export const getUsers = async (): Promise<User[]> => {
	const response = await serverFetch("/users");
	return response as User[];
};

/**
 * Crea un nuevo usuario en el servidor.
 *
 * @param data Los datos del usuario a crear. Debe cumplir con {@link UserCreateDto}.
 * @returns {Promise<UserCreateDto>} Los datos del usuario creado.
 */
export const createUser = async (
	data: UserCreateDto
): Promise<UserCreateDto> => {
	try {
		const response = await serverFetch("/users", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
		revalidatePath("/users");
		return response as unknown as UserCreateDto;
	} catch (error) {
		throw new Error(String(error));
	}
};

/**
 * Actualiza un usuario existente.
 *
 * @param id El ID del usuario a actualizar.
 * @param data Los datos del usuario a actualizar.
 * @returns {Promise<UserCreateDto>} Los datos del usuario actualizados.
 */
export const updateUser = async (
	id: string,
	data: UserCreateDto
): Promise<UserCreateDto> => {
	try {
		const response = await serverFetch(`/users/${id}`, {
			method: "PATCH",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
		revalidatePath("/users");
		return response as unknown as UserCreateDto;
	} catch (error) {
		throw new Error(String(error));
	}
};

/**
 * Elimina un usuario por su ID.
 *
 * @param id El ID del usuario a eliminar.
 * @returns {Promise<void>}
 */
export const deleteUser = async (id: string): Promise<void> => {
	try {
		await serverFetch(`/users/${id}`, {
			method: "DELETE",
		});
		revalidatePath("/users");
	} catch (error) {
		throw new Error(String(error));
	}
};

/**
 * Generates a random password with the following characteristics:
 * - Length: 10
 * - Contains numbers
 * - Contains uppercase letters
 * @returns {string}
 */
export const generatePassword = (): string => {
	return generator.generate({
		length: 10,
		numbers: true,
		uppercase: true,
	});
};
