import { components } from "@/types/api";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

// Tipos base de la API
export type Branch = components['schemas']['Branch'];
export type CreateBranchDto = components['schemas']['CreateBranchDto'];
export type UpdateBranchDto = components['schemas']['UpdateBranchDto'];
export type DeleteBranchesDto = components['schemas']['DeleteBranchesDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateBranchesDto = DeleteBranchesDto;

// Interfaz para la tabla extendiendo el tipo base
export interface BranchTableItem extends Branch {
  selected?: boolean;
}

// Schema de validación para crear/actualizar sucursal
export const createBranchSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional()
    .refine(value => !value || isValidPhoneNumber(value), {
      message: "El número de teléfono no es válido",
    }),
}) satisfies z.ZodType<CreateBranchDto>;

export const updateBranchSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  address: z.string().min(1, "La dirección es requerida").optional(),
  phone: z.string().optional(),
}) satisfies z.ZodType<UpdateBranchDto>;

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
