import { components } from "@/types/api";
import { z } from "zod";
// Tipos DTO
export type TypeProduct = components["schemas"]["TypeProduct"];
export type CreateTypeProductDto = components["schemas"]["CreateTypeProductDto"];
export type UpdateTypeProductDto = components["schemas"]["UpdateTypeProductDto"];
export type DeleteTypeProductDto = components["schemas"]["DeleteTypeProductDto"];
export type ReactivateTypeProductDto = components["schemas"]["DeleteTypeProductDto"];
export type TypeProductResponse = components["schemas"]["TypeProductResponse"];

// Esquema de validación para la creación de productos
export const TypeProductCreateSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    description: z.string().optional(),
}) satisfies z.ZodType<CreateTypeProductDto>;

// Esquema de validación para la actualización de productos
export const TypeProductUpdateSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    description: z.string().optional(),
}) satisfies z.ZodType<UpdateTypeProductDto>;
