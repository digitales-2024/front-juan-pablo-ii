import { components } from "@/types/api";

export type Role = components["schemas"]["CreateRolDto"];

export type UserProfile = {
	id: string;
	name: string;
	email: string;
	phone: string;
	isActive: boolean;
	isSuperAdmin: boolean;
	mustChangePassword: boolean;
	lastLogin: string;
	roles: Role[];
};

export type User = components["schemas"]["CreateUserDto"];

export type Profile = components["schemas"]["UserProfileResponseDto"];
