import * as z from "zod";

export const clientsSchema = z.object({
    name: z
        .string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    rucDni: z
        .string({
            required_error: "El RUC o DNI es obligatorio",
        })
        .min(8, {
            message: "El RUC o DNI debe tener al menos 8 caracteres",
        })
        .regex(/^[0-9]+$/, {
            message: "El RUC o DNI debe ser un número válido",
        }),
    address: z.string().min(1, { message: "La dirección es obligatoria" }),
    province: z.string().min(1, { message: "La provincia es obligatoria" }),
    department: z
        .string()
        .min(1, { message: "El departamento es obligatorio" }),
    phone: z.string().optional(),
});

export type CreateClientsSchema = z.infer<typeof clientsSchema>;
