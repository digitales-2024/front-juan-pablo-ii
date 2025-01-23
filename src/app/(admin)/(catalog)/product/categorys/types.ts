import { components } from "@/types/api";
import { z } from "zod";

// Esquema de validación para la creación de productos
export const CategoryProductCreateSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    description: z.string().optional(),
}) satisfies z.ZodType<CreateCategoryDto>;

// Esquema de validación para la actualización de productos
export const CategoryProductUpdateSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    description: z.string().optional(),
}) satisfies z.ZodType<UpdateCategoryDto>;

// Tipos DTO
export type CategoryProductDto = components["schemas"]["Category"];
export type CreateCategoryDto = components["schemas"]["CreateCategoryDto"];
export type UpdateCategoryDto = components["schemas"]["UpdateCategoryDto"];