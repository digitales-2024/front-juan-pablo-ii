import { components } from "@/types/api";
import { z } from "zod";

/**
 * Esquema de validación para la creación y actualización de tipos de productos
 */
export const TypeProductSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    description: z.string().optional(),
});

/**
 * DTO para la creación de un tipo de producto.
 *
 * El DTO tiene las propiedades:
 * - id: string
 * - name: string, required, min 1 character
 * - description: string, optional
 */
export type CreateTypeProductDto = components["schemas"]["TypeProduct"];

/**
 * Esquema de validación para la creación y actualización de tipos de productos.
 *
 * El esquema tiene dos propiedades:
 * - name: string, required, min 1 character
 * - description: string, optional
 */
export type TypeProduct = z.infer<typeof TypeProductSchema> & { id: string } & { isActive: boolean };

/**
 * Input para crear un tipo de producto.
 *
 * La interfaz tiene dos propiedades:
 * - name: string, required, min 1 character
 * - description: string, optional
 */
export type CreateTypeProductInput = z.infer<typeof TypeProductSchema>;

/**
 * Input para actualizar un tipo de producto.
 *
 * La interfaz tiene dos propiedades:
 * - name: string, optional
 * - description: string, optional
 */
export type UpdateTypeProductInput = Partial<CreateTypeProductInput>;