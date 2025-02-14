import { z } from "zod";

export type FilterByStorage = {
    storageId: string;
}

export type FilterByProduct = {
    productId: string;
}

export type FilterByStorageAndProduct = FilterByProduct & FilterByStorage;

export const FilterByStorageSchema = z.object({
    storageId: z.string().min(1, "El id de almacén es requerido"),
}) satisfies z.ZodType<FilterByStorage>;

export const FilterByProductSchema = z.object({
    productId: z.string().min(1, "El id de producto es requerido"),
}) satisfies z.ZodType<FilterByProduct>;

export const FilterByStorageAndProductSchema = z.object({
    storageId: z.string().min(1, "El id de almacén es requerido"),
    productId: z.string().min(1, "El id de producto es requerido"),
}) satisfies z.ZodType<FilterByStorageAndProduct>;