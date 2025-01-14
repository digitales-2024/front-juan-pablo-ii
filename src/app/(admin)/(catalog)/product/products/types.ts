import { components } from "@/types/api";
import { z } from "zod";

export const productSchema = z.object({
	name: z.string().min(1, { message: "El nombre es requerido" }),
	precio: z
		.string()
		.min(0, { message: "El precio debe ser mayor o igual a 0" }),
	description: z.string().optional(),
});

export type Product = z.infer<typeof productSchema> & { id: string } & { isActive: boolean };
export type CreateProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = Partial<CreateProductInput>;

export type CreateProductDto = components["schemas"]["CreateProductDto"];
