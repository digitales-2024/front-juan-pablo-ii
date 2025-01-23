import { components } from "@/types/api";
import { z } from "zod";

export const productCreateSchema = z.object({
    categoriaId: z.string(),
    tipoProductoId: z.string(),
    name: z.string().min(1, { message: "El nombre es requerido" }),
    codigoProducto: z.string().optional(),
    precio: z.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
    unidadMedida: z.string().optional(),
    descuento: z.number().optional(),
    proveedor: z.string().optional(),
    description: z.string().optional(),
}) satisfies z.ZodType<CreateProductDto>;

export const productUpdateSchema = z.object({
    categoriaId: z.string(),
    tipoProductoId: z.string(),
    name: z.string().min(1, { message: "El nombre es requerido" }),
    codigoProducto: z.string().optional(),
    precio: z.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
    unidadMedida: z.string().optional(),
    descuento: z.number().optional(),
    proveedor: z.string().optional(),
    description: z.string().optional(),
}) satisfies z.ZodType<UpdateProductDto>;

export type ProductDto = components["schemas"]["Product"];
export type CreateProductDto = components["schemas"]["CreateProductDto"];
export type UpdateProductDto = components["schemas"]["UpdateProductDto"];