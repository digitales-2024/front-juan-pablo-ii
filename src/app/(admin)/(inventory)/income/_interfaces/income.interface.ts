import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Incoming = components['schemas']['Incoming'];
export type Movement = components['schemas']['OutgoingIncomingMovementDto'];
export type DetailedIncoming = components['schemas']['DetailedIncoming'];
export type CreateIncomingDto = components['schemas']['CreateIncomingDtoStorage'];
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

// OutgoingIncomingMovementDto: {
  // productId: string;
  // quantity: number;
  // date?: string;
  // state?: boolean;
// }
export const createIncomeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"), //En el back es opcional, pero considero que debe ser requerido
  description: z.string().optional(),
  storageId: z.string().min(1, "El tipo de almacenamiento es requerido"),
  date: z.string().date("La fecha es requerida"),
  state: z.boolean(),
  referenceId: z.string().optional(),
  movement: z.array(
    z.object({
      productId: z.string().min(1, "El producto es requerido"),
      quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
      date: z.string().optional(),
      state: z.boolean().optional(),
    })
  ),
}) satisfies z.ZodType<CreateIncomingDto>;

// UpdateIncomingDto: {
//   name?: string;
//   description?: string;
//   storageId?: string;
//   date?: string;
//   state?: boolean;
//   referenceId?: string;
// }
export const updateIncomeSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  storageId: z.string().optional(),
  date: z.string().optional(),
  state: z.boolean().optional(),
  referenceId: z.string().optional(),
}) satisfies z.ZodType<UpdateIncomingDto>;

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;
