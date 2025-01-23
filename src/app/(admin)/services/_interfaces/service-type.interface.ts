import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type ServiceType = components['schemas']['ServiceType'];
export type CreateServiceTypeDto = components['schemas']['CreateServiceTypeDto'];
export type UpdateServiceTypeDto = components['schemas']['UpdateServiceTypeDto'];
export type DeleteServiceTypesDto = components['schemas']['DeleteServiceTypesDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateServiceTypesDto = DeleteServiceTypesDto;

// Interfaz para la tabla extendiendo el tipo base
export type ServiceTypeTableItem = ServiceType & { selected?: boolean };

// Schema de validación para crear tipo de servicio
export const createServiceTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional(),
}) satisfies z.ZodType<CreateServiceTypeDto>;

// Schema de validación para actualizar tipo de servicio
export const updateServiceTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional(),
}) satisfies z.ZodType<UpdateServiceTypeDto>; 