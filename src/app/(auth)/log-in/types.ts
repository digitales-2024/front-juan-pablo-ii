import { z } from "zod";

export const authSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: "Ingrese su email",
        })
        .email({
            message: "Email no válido",
        }),
    password: z.string().min(1, {
        message: "Ingrese su contraseña",
    }),
});

export type Credentials = {
    email: string;
    password: string;
};

export type UserLogin = {
    id: string;
    name: string;
    email: string;
    phone: string;
    roles: { id: string; name: string }[];
};