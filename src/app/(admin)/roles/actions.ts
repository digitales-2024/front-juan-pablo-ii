"use server";

import { http } from "@/utils/serverFetch";
import { RoleResponseDto } from "./types";

type GetRolesResponse = RoleResponseDto[] | { error: string };
type CreateRoleResponse = RoleResponseDto | { error: string };

export async function getRoles(): Promise<GetRolesResponse> {
	try {
		const [roles, error] = await http.get<RoleResponseDto[]>("/rol");

		if (error) {
			return { error: error.message };
		}

		return roles;
	} catch (error) {
		if (error instanceof Error) return { error: error.message };
		return { error: "Error desconocido" };
	}
}

export async function createRole(data: RoleResponseDto): Promise<CreateRoleResponse> {
	try {
		const [role, error] = await http.post<RoleResponseDto>("/rol", data);

		if (error) {
			return { error: error.message };
		}

		return role;
	} catch (error) {
		if (error instanceof Error) return { error: error.message };
		return { error: "Error desconocido" };
	}
}
