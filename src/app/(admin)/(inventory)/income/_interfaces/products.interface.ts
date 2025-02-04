import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Incoming = components['schemas']['Incoming'];
export type DetailedIncoming = components['schemas']['DetailedIncoming'];
export type CreateResponse = components['schemas']['IncomingCreateResponseData'];
export type CreateIncomingDto = components['schemas']['CreateIncomingDto'];
export type UpdateIncomingDto = components['schemas']['UpdateIncomingDto'];
export type DeleteIncomingDto = components['schemas']['DeleteIncomingDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateProductDto = DeleteIncomingDto;

// Interfaz para la tabla extendiendo el tipo base
export interface ProductTableItem extends DetailedIncoming {
  selected?: boolean;
}

// Schema de validación para crear/actualizar producto
// CreateIncomingDto: {
//   name?: string;
//   description?: string;
//   storageId: string;
//   date: string;
//   state: boolean;
//   referenceId?: string;
// }
export const createProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  storageId: z.string().min(1, "El tipo de almacenamiento es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  state: z.boolean(),
  referenceId: z.string().optional(),
}) satisfies z.ZodType<CreateIncomingDto>;

// UpdateIncomingDto: {
//   name?: string;
//   description?: string;
//   storageId?: string;
//   date?: string;
//   state?: boolean;
//   referenceId?: string;
// }
export const updateProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().optional(),
  storageId: z.string().optional(),
  date: z.string().optional(),
  state: z.boolean().optional(),
  referenceId: z.string().optional(),
}) satisfies z.ZodType<UpdateIncomingDto>;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
