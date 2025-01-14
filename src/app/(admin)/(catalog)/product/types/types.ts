import { components } from "@/types/api";
import { z } from "zod";

/**
 * Esquema de validación para la creación y actualización de categorías de productos
 */
export const CategorySchema = z.object({
	name: z.string().min(1, { message: "El nombre es requerido" }),
	description: z.string().optional(),
});

/**
 * DTO para la creación de una categoría de productos.
 *
 * El DTO tiene las propiedades:
 * - id: string
 * - name: string, required, min 1 character
 * - description: string, optional
 */
export type CreateCategoryDto = components["schemas"]["TypeProduct"];

/**
 * Esquema de validación para la creación y actualización de categorías de productos.
 *
 * El esquema tiene dos propiedades:
 * - name: string, required, min 1 character
 * - description: string, optional
 */
export type Category = z.infer<typeof CategorySchema> & { id: string } & { isActive: boolean };
/**
 * Input para crear una categoría de productos.
 *
 * La interfaz tiene dos propiedades:
 * - name: string, required, min 1 character
 * - description: string, optional
 */
export type CreateCategoryInput = z.infer<typeof CategorySchema>;
/**
 * Input para actualizar una categoría de productos.
 *
 * La interfaz tiene dos propiedades:
 * - name: string, optional
 * - description: string, optional
 */
export type UpdateCategoryInput = Partial<CreateCategoryInput>;


