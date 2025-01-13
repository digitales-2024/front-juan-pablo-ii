import { serverFetch } from "@/utils/serverFetch";
import { User } from "./types";

/**
 * Obtiene la lista de usuarios.
 *
 * @returns {Promise<User[]>}
 */

export const getUsers = async (): Promise<User[]> => {
	const response = await serverFetch("/users");
	return response as User[];
};
