import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Service = components['schemas']['Service'];
export type CreateServiceDto = components['schemas']['CreateServiceDto'];
export type UpdateServiceDto = components['schemas']['UpdateServiceDto'];
export type DeleteServicesDto = components['schemas']['DeleteServicesDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateServicesDto = DeleteServicesDto;

// Interfaz para la tabla extendiendo el tipo base
export type ServiceTableItem = Service & { selected?: boolean };

// Schema de validación para crear servicio
export const createServiceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  serviceTypeId: z.string().min(1, "El tipo de servicio es requerido"),
}) satisfies z.ZodType<CreateServiceDto>;

// Schema de validación para actualizar servicio
export const updateServiceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0").optional(),
  serviceTypeId: z.string().min(1, "El tipo de servicio es requerido").optional(),
}) satisfies z.ZodType<UpdateServiceDto>;

