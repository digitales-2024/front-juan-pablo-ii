import * as z from "zod";

export const createBusinessSchema = z.object({
    name: z
        .string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    ruc: z.string().length(11, { message: "El RUC debe contener 11 dígitos" }),
    address: z
        .string()
        .min(2, { message: "La dirección debe tener al menos 2 caracteres" }),
    legalRepName: z.string().min(2, {
        message:
            "El nombre del representante legal debe tener al menos 2 caracteres",
    }),
    legalRepDni: z
        .string()
        .length(8, { message: "El DNI debe tener 8 dígitos" }),
});

export type CreateBusinessSchema = z.infer<typeof createBusinessSchema>;

export const updateBusinessSchema = createBusinessSchema.omit({});
export type UpdateBusinessSchema = z.infer<typeof updateBusinessSchema>;
