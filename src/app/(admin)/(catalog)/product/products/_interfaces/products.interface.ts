import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Product = components['schemas']['Product'];
export type DetailedProduct = components['schemas']['ProductWithRelations'];
export type CreateProductDto = components['schemas']['CreateProductDto'];
export type UpdateProductDto = components['schemas']['UpdateProductDto'];
export type DeleteProductDto = components['schemas']['DeleteProductDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateProductDto = DeleteProductDto;

// Interfaz para la tabla extendiendo el tipo base
export interface ProductTableItem extends DetailedProduct {
  selected?: boolean;
}

// Schema de validación para crear/actualizar producto
// type CreateProductDto = {
//   categoriaId: string;
//   tipoProductoId: string;
//   name: string;
//   precio: number;
//   unidadMedida?: string;
//   proveedor?: string;
//   uso?: string;
//   usoProducto?: string;
//   description?: string;
//   codigoProducto?: string;
//   descuento?: number;
//   observaciones?: string;
//   condicionesAlmacenamiento?: string;
//   imagenUrl?: string;
// }
export const createProductSchema = z.object({
  categoriaId: z.string().min(1, "La categoría es requerida").uuid(),
  tipoProductoId: z.string().min(1, "El tipo de producto es requerido").uuid(),
  name: z.string().min(1, "El nombre es requerido"),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  unidadMedida: z.string().optional(),
  proveedor: z.string().optional(),
  uso: z.string().optional(),
  usoProducto: z.string().optional(),
  description: z.string().optional(),
  codigoProducto: z.string().optional(),
  descuento: z.coerce.number().optional(),
  observaciones: z.string().optional(),
  condicionesAlmacenamiento: z.string().optional(),
  imagenUrl: z.string().url().optional(),
}) satisfies z.ZodType<CreateProductDto>;

// type UpdateProductDto = {
//   categoriaId?: string;
//   tipoProductoId?: string;
//   name?: string;
//   precio?: number;
//   unidadMedida?: string;
//   proveedor?: string;
//   uso?: string;
//   usoProducto?: string;
//   description?: string;
//   codigoProducto?: string;
//   descuento?: number;
//   observaciones?: string;
//   condicionesAlmacenamiento?: string;
//   imagenUrl?: string;
// }

export const updateProductSchema = z.object({
  categoriaId: z.string().uuid().optional(),
  tipoProductoId: z.string().uuid().optional(),
  name: z.string().min(1, "El nombre es requerido").optional(),
  precio: z.number().min(0, "El precio no puede ser negativo").optional(),
  unidadMedida: z.string().optional(),
  proveedor: z.string().optional(),
  uso: z.string().optional(),
  usoProducto: z.string().optional(),
  description: z.string().optional(),
  codigoProducto: z.string().optional(),
  descuento: z.number().optional(),
  observaciones: z.string().optional(),
  condicionesAlmacenamiento: z.string().optional(),
  imagenUrl: z.string().url().optional(),
}) satisfies z.ZodType<UpdateProductDto>;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
