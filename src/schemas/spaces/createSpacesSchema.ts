import * as z from "zod";

export const spacesSchema = z.object({
    name: z
        .string({
            required_error: "El nombre del ambiente es obligatorio",
        })
        .min(2, { message: "El ambiente debe tener al menos 2 caracteres" }),
    description: z.string().optional(),
});

export type CreateSpacesSchema = z.infer<typeof spacesSchema>;
