import { ResourceType } from "@/types";
import * as z from "zod";

export const resourceSchema = z.object({
    type: z.nativeEnum(ResourceType, {
        required_error: "El tipo del recurso es obligatorio",
        invalid_type_error:
            "El tipo debe ser uno de: TOOLS, LABOR, SUPPLIES, SERVICES",
    }),
    name: z
        .string({
            required_error: "El nombre del recurso es obligatorio",
        })
        .min(2, {
            message: "El nombre del recurso debe tener al menos 2 caracteres",
        }),

    unit: z
        .string({
            required_error: "La unidad del recurso es obligatorio",
        })
        .min(1, {
            message: "La unidad del recurso debe tener al menos 1 caracteres",
        }),

    unitCost: z
        .number({
            required_error: "El costo unitario debe ser un número",
        })
        .min(0, {
            message: "El costo unitario debe ser mayor o igual a 0",
        }),
});

export type CreateResourceSchema = z.infer<typeof resourceSchema>;
