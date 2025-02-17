import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Staff = components['schemas']['Staff'] & {
  staffType?: {
    name: string;
  };
};
export type CreateStaffDto = components['schemas']['CreateStaffDto'];
export type UpdateStaffDto = components['schemas']['UpdateStaffDto'];
export type DeleteStaffDto = components['schemas']['DeleteStaffDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateStaffDto = DeleteStaffDto;

// Interfaz para la tabla extendiendo el tipo base
export type StaffTableItem = Staff & { selected?: boolean };

// Schema de validación para crear personal
export const createStaffSchema = z.object({
  staffTypeId: z.string().min(1, "El tipo de personal es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  dni: z.string().min(8, "El DNI debe tener 8 dígitos").max(8, "El DNI debe tener 8 dígitos"),
  birth: z.string().min(1, "La fecha de nacimiento es requerida"),
  email: z.string().email("El email no es válido"),
  phone: z.string().optional(),
  cmp: z.string().optional(),
}) satisfies z.ZodType<CreateStaffDto>;

// Schema de validación para actualizar personal
export const updateStaffSchema = z.object({
  staffTypeId: z.string().min(1, "El tipo de personal es requerido").optional(),
  name: z.string().min(1, "El nombre es requerido").optional(),
  lastName: z.string().min(1, "El apellido es requerido").optional(),
  dni: z.string().min(8, "El DNI debe tener 8 dígitos").max(8, "El DNI debe tener 8 dígitos").optional(),
  birth: z.string().min(1, "La fecha de nacimiento es requerida").optional(),
  email: z.string().email("El email no es válido").optional(),
  phone: z.string().optional(),
}) satisfies z.ZodType<UpdateStaffDto>;
