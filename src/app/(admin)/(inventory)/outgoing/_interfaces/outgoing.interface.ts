import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Outgoing = components['schemas']['Outgoing'];
export type DetailedOutgoingPrototype = components['schemas']['DetailedOutgoing'];
export type OutgoingProductPrototype = components['schemas']['OutgoingProduct']
export type OutgoingProduct = {
  id: string;
  categoriaId: string;
  tipoProductoId: string;
  name: string;
  precio: number;
  unidadMedida: string;
  proveedor: string;
  usoProducto: string;
  description: string;
  codigoProducto: string;
  isActive: boolean;
}
export type OutgoingBranchPrototype = components['schemas']['OutgoingBranch'];
export type OutgoingBranch = {
  id: string;
  name: string;
}

export type OutgoingStorageTypePrototype = components['schemas']['OutgoingStorageType']
export type OutgoingStorageType = {
  id: string;
  name: string;
  branch?: OutgoingBranch;
}

export type OutgoingStoragePrototype = components['schemas']['OutgoingStorage'];
export type OutgoingStorage = {
  id: string;
  name: string;
  TypeStorage: OutgoingStorageType;
}

export type OutgoingMovementPrototype = components['schemas']['OutgoingMovement'];
export type OutgoingMovement = {
  id: string;
  movementTypeId: string;
  quantity: number;
  date: string;
  state: boolean;
  buyingPrice?: number;
  isActive: boolean;
  Producto: OutgoingProduct;
}

export type DetailedOutgoing = {
  id: string;
  name: string;
  description: string;
  storageId: string;
  date: string;
  state: boolean;
  referenceId: string;
  isTransference?: boolean;
  isActive: boolean;
  Storage: OutgoingStorage;
  Movement: OutgoingMovement[];
}

export type MovementDto = components['schemas']['OutgoingIncomingMovementDto'];
export type CreateOutgoingDto = components['schemas']['CreateOutgoingDtoStorage'];
export type UpdateOutgoingDto = components['schemas']['UpdateOutgoingDto'];
export type DeleteOutgoingDto = components['schemas']['DeleteOutgoingDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateOutgoingDto = DeleteOutgoingDto;

export interface OutgoingableItem extends DetailedOutgoing {
  selected?: boolean;
}

export const outgoingMovementSchema = z.object({
  productId: z.string().min(1, "El producto es requerido"),
  quantity: z.coerce.number({
    required_error: "La cantidad es requerida",
    invalid_type_error: "La cantidad debe ser un número"
  }).min(1, "Se debe tener al menos una unidad").nonnegative(),
  buyingPrice: z.coerce.number().optional(),
  date: z.string().optional(),
  state: z.coerce.boolean().optional(),
});

export const movementArrayOutgoingSchema = z.array(
  outgoingMovementSchema
).min(1, "Debe contener al menos un elemento");;


export const createOutgoingSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  storageId: z.string().min(1, "El almacen es requerido"),
  date: z.coerce.string().min(1, "La fecha es requerida"),
  state: z.coerce.boolean(),
  isTransference: z.coerce.boolean().optional(),
  referenceId: z.string().optional(),
  movement: movementArrayOutgoingSchema,
});

export const updateOutgoingSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  storageId: z.string().optional(),
  date: z.coerce.string().optional(),
  state: z.coerce.boolean().optional(),
  isTransference: z.coerce.boolean().optional(),
  referenceId: z.string().optional(),
}) satisfies z.ZodType<UpdateOutgoingDto>;

export type CreateOutgoingInput = z.infer<typeof createOutgoingSchema>;
export type UpdateOutgoingInput = z.infer<typeof updateOutgoingSchema>;
