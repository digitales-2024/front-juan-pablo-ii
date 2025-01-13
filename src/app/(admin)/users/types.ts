import { components } from "@/types/api";
export type RolResponseDto = components["schemas"]["RolResponseDto"];
export type User = Omit<components["schemas"]["UserResponseDto"], "roles"> & {
	roles: RolResponseDto[];
};
