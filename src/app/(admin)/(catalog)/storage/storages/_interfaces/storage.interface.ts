import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Storage = components['schemas']['Storage'];
export type TypeStorage = components['schemas']['TypeStorage'];
export type DetailedStorage = components['schemas']['DetailedStorage'];
export type CreateStorageDto = components['schemas']['CreateStorageDto'];
export type UpdateStorageDto = components['schemas']['UpdateStorageDto'];
export type DeleteStorageDto = components['schemas']['DeleteStorageDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateStorageDto = DeleteStorageDto;

// Interfaz para la tabla extendiendo el tipo base
export interface StorageTableItem extends DetailedStorage {
  selected?: boolean;
}

// Schema de validación para crear/actualizar
// type CreateStorageDto = {
//     name: string;
//     location?: string;
//     typeStorageId: string;
// }
export const createStorageSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  location: z.string().optional(),
  typeStorageId: z.string().uuid(),
}) satisfies z.ZodType<CreateStorageDto>;

// type UpdateStorageDto: {
//   name?: string;
//   location?: string;
//   typeStorageId?: string;
// }
export const updateStorageSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  typeStorageId: z.string().optional(),
}) satisfies z.ZodType<UpdateStorageDto>;

export type CreateStorageInput = z.infer<typeof createStorageSchema>;
export type UpdateStorageInput = z.infer<typeof updateStorageSchema>;
