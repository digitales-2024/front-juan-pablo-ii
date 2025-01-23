import * as z from "zod";

export const sendNewPasswordSchema = z.object({
    password: z
        .string()
        .min(6, { message: "Debes generar una contraseña" })
        .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message:
                "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
        }),
});

export type SendNewPasswordSchema = z.infer<typeof sendNewPasswordSchema>;
