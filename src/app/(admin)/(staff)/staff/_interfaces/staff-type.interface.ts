import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type StaffType = components['schemas']['StaffType'];
export type CreateStaffTypeDto = components['schemas']['CreateStaffTypeDto'];
export type UpdateStaffTypeDto = components['schemas']['UpdateStaffTypeDto'];
export type DeleteStaffTypeDto = components['schemas']['DeleteStaffTypeDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateStaffTypeDto = DeleteStaffTypeDto;

// Interfaz para la tabla extendiendo el tipo base
export type StaffTypeTableItem = StaffType & { selected?: boolean };

// Schema de validación para crear tipo de personal
export const createStaffTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string(),
}) satisfies z.ZodType<CreateStaffTypeDto>;

// Schema de validación para actualizar tipo de personal
export const updateStaffTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional(),
}) satisfies z.ZodType<UpdateStaffTypeDto>;
