import { components } from "@/types/api";
import { z } from "zod";
export type RolResponseDto = components["schemas"]["RolResponseDto"];
export type UserResponseDto = Omit<
	components["schemas"]["UserResponseDto"],
	"roles"
> & {
	roles: RolResponseDto[];
};
export type UserCreateDto = components["schemas"]["CreateUserDto"];
export type UserUpdateDto = components["schemas"]["UpdateUserDto"]

export const userCreateSchema = z.object({
	name: z.string().min(1, { message: "El nombre es requerido" }),
	email: z.string().min(1, { message: "El email es requerido" }),
	password: z.string().min(1, { message: "La contraseña es requerida" }),
	phone: z
		.string()
		.min(1, { message: "El telefono es requerido" })
		.optional(),
	roles: z.array(z.string()).min(1, { message: "El rol es requerido" }),
}) satisfies z.ZodType<UserCreateDto>;

export const userUpdateSchema = z.object({
	name: z.string().min(1, { message: "El nombre es requerido" }),
	phone: z
		.string()
		.min(1, { message: "El telefono es requerido" })
		.optional(),
	roles: z.array(z.string()).min(1, { message: "El rol es requerido" }),
}) satisfies z.ZodType<UserUpdateDto>;

export const sendNewPasswordSchema = z.object({
	password: z
		.string()
		.min(6, { message: "La contraseña es requerida" })
})

export type SendNewPasswordDto = z.infer<typeof sendNewPasswordSchema>

export type SendEmailDto = components["schemas"]["SendEmailDto"];
