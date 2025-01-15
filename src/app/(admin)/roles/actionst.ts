import { serverFetch } from "@/utils/serverFetch";
import { RoleResponseDto } from "./types";

export const getRoles = async (): Promise<RoleResponseDto[]> => {
	try {
		const [data, error] = await serverFetch<RoleResponseDto[]>("/rol");

		if (!data || error) {
			throw new Error("Error fetching roles");
		}

		return data as unknown as RoleResponseDto[];
	} catch (error) {
		throw new Error(String(error));
	}
};
