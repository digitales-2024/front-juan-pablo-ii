import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type TypeStorage = components['schemas']['TypeStorage'];
// export type DetailedTypeStorage = components['schemas']['DetailedTypeStorage'];
export type CreateTypeStorageDto = components['schemas']['CreateTypeStorageDto'];
export type UpdateTypeStorageDto = components['schemas']['UpdateTypeStorageDto'];
export type DeleteTypeStorageDto = components['schemas']['DeleteTypeStorageDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateTypeStorageDto = DeleteTypeStorageDto;

// Interfaz para la tabla extendiendo el tipo base
export interface TypeStorageTableItem extends TypeStorage {
  selected?: boolean;
}

// Schema de validación para crear/actualizar
// type CreateTypeStorageDto = {
//   name: string;
//   description?: string;
// }
export const createTypeStorageSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
}) satisfies z.ZodType<CreateTypeStorageDto>;

// type UpdateTypeStorageDto = {
//   name?: string;
//   description?: string;
// }

export const updateTypeStorageSchema = z.object(
  {
    name: z.string().optional(),
    description: z.string().optional(),
  }
) satisfies z.ZodType<UpdateTypeStorageDto>;

export type CreateTypeStorageInput = z.infer<typeof createTypeStorageSchema>;
export type UpdateTypeStorageInput = z.infer<typeof updateTypeStorageSchema>;
