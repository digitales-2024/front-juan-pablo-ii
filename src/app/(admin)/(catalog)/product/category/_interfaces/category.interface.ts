import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Category = components['schemas']['Category'];
export type CreateCategoryDto = components['schemas']['CreateCategoryDto'];
export type UpdateCategoryDto = components['schemas']['UpdateCategoryDto'];
export type DeleteCategoriesDto = components['schemas']['DeleteCategoryDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateCategoryDto = DeleteCategoriesDto;

// Interfaz para la tabla extendiendo el tipo base
export interface CategoryTableItem extends Category {
  selected?: boolean;
}

// Schema de validación para crear/actualizar sucursal
export const createCategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida").optional(),
}) satisfies z.ZodType<CreateCategoryDto>;

export const updateCategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().min(1, "La descripción es requerida").optional(),
}) satisfies z.ZodType<UpdateCategoryDto>;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
