import * as z from "zod";

export const zoningSchema = z.object({
    zoneCode: z
        .string({
            required_error: "El codigo de zonificación es obligatorio",
        })
        .min(2, {
            message:
                "El codigo de zonificación debe tener al menos 2 caracteres",
        }),

    description: z.string().optional(),

    buildableArea: z
        .number({
            required_error: "El porcentaje área debe ser un número",
        })
        .min(0, {
            message:
                "El porcentaje área construible debe ser mayor o igual a 0",
        })
        .max(100, {
            message:
                "El porcentaje área construible debe ser menor o igual a 100",
        }),

    openArea: z
        .number()
        .min(0, {
            message: "El porcentaje área libre debe ser mayor o igual a 0",
        })
        .max(100, {
            message: "El porcentaje área libre debe ser menor o igual a 100",
        }),
});

export type CreateZoningSchema = z.infer<typeof zoningSchema>;
