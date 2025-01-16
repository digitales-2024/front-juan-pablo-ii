"use server";

import { http } from "@/utils/serverFetch";
import { UserResponseDto, UserCreateDto } from "./types";

type GetUsersResponse = UserResponseDto[] | { error: string };
type CreateUserResponse = UserResponseDto | { error: string };

export async function getUsers(): Promise<GetUsersResponse> {
	try {
		const [users, error] = await http.get<UserResponseDto[]>("/users");

		if (error) {
			return { error: error.message };
		}

		return users;
	} catch (error) {
		if (error instanceof Error) return { error: error.message };
		return { error: "Error desconocido" };
	}
}


export async function createUser(data: UserCreateDto): Promise<CreateUserResponse> {
	try {
		const [user, error] = await http.post<UserResponseDto>("/users", data);

		if (error) {
			return { error: error.message };
		}

		return user;
	} catch (error) {
		if (error instanceof Error) return { error: error.message };
		return { error: "Error desconocido" };
	}
}