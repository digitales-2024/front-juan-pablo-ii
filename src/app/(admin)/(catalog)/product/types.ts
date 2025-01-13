import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    precio: z.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
    unidadMedida: z.string().optional(),
    proveedor: z.string().optional(),
    uso: z.string().optional(),
    usoProducto: z.string().optional(),
    description: z.string().optional(),
    codigoProducto: z.string().optional(),
    descuento: z.number().min(0).optional(),
    observaciones: z.string().optional(),
    condicionesAlmacenamiento: z.string().optional(),
    isActive: z.boolean().default(true),
    imagenUrl: z.string().url().optional(),
});

export type Product = z.infer<typeof productSchema> & { id: string };
export type CreateProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = Partial<CreateProductInput>;
