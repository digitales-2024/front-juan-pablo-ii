import { components } from "@/types/api";
import { z } from "zod";

export const productSchema = z.object({
    categoriaId: z.string(),
    tipoProductoId: z.string(),
    name: z.string().min(1, { message: "El nombre es requerido" }),
    codigoProducto: z.string().optional(),
    precio: z.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
    unidadMedida: z.string().optional(),
    descuento: z.number().optional(),
    proveedor: z.string().optional(),
    description: z.string().optional(),
});
export type Product = z.infer<typeof productSchema> & { id: string } & { isActive: boolean };
export type CreateProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = Partial<CreateProductInput>;

export type CreateProductDto = components["schemas"]["CreateProductDto"];
