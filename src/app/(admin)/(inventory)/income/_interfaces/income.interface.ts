import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Incoming = components['schemas']['Incoming'];
export type DetailedIncomingPrototype = components['schemas']['DetailedIncoming'];
export type IncomingProduct = components['schemas']['IncomingProduct'];
export type IncomingBranchPrototype = components['schemas']['IncomingBranch'];
export type IncomingBranch = {
  id: string;
  name: string;
}
export type IncomingStorageTypePrototype= components['schemas']['IncomingStorageType'];
export type IncomingStorageType = {
  id: string;
  name: string;
  branch?: IncomingBranch;
}
export type IncomingStoragePrototype = components['schemas']['IncomingStorage'];
export type IncomingStorage = {
  id: string;
  name: string;
  TypeStorage: IncomingStorageType;
}

export type IncomingMovementPrototype = components['schemas']['IncomingMovement'];
export type IncomingMovement = {
  id: string;
  movementTypeId: string;
  quantity: number;
  date: string;
  state: boolean;
  isActive: boolean;
  Producto: IncomingProduct
};

export type DetailedIncoming = {
  id: string;
  name: string;
  description: string;
  storageId: string;
  date: string;
  state: boolean;
  referenceId: string;
  isActive: boolean;
  Storage: IncomingStorage;
  Movement: IncomingMovement[];
};

export type MovementDto = components['schemas']['OutgoingIncomingMovementDto'];
export type CreateIncomingDto = components['schemas']['CreateIncomingDtoStorage'];
export type UpdateIncomingDto = components['schemas']['UpdateIncomingDto'];
export type DeleteIncomingDto = components['schemas']['DeleteIncomingDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateIncomingDto = DeleteIncomingDto;

// Interfaz para la tabla extendiendo el tipo base
export interface IncomingTableItem extends DetailedIncoming {
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
export const createIncomeSchemaPrototype = z.object({
  name: z.string().min(1, "El nombre es requerido"), //En el back es opcional, pero considero que debe ser requerido
  description: z.string().optional(),
  storageId: z.string().min(1, "El tipo de almacenamiento es requerido"),
  date: z.string().min(1,"La fecha es requerida").refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha debe ser una cadena de fecha válida ISO 8601",
  }),
  state: z.coerce.boolean(),
  referenceId: z.string().optional(),
  movement: z.array(
    z.object({
      productId: z.string().min(1, "El producto es requerido"),
      quantity: z.coerce.number({
        required_error: "La cantidad es requerida",
        invalid_type_error: "La cantidad debe ser un número"
      }).min(1, "Se debe tener al menos una unidad").nonnegative(),
      date: z.string().optional(),
      state: z.coerce.boolean().optional(),
    })
  ).length(1, "Se debe tener al menos un movimiento"),
}) satisfies z.ZodType<CreateIncomingDto>;

export const incomeMovementSchema = z.object({
  productId: z.string().min(1, "El producto es requerido"),
  quantity: z.coerce.number({
    required_error: "La cantidad es requerida",
    invalid_type_error: "La cantidad debe ser un número"
  }).min(1, "Se debe tener al menos una unidad").nonnegative(),
  date: z.string().optional(),
  state: z.coerce.boolean().optional(),
});

export const movementArrayIncomeSchema = z.array(
  incomeMovementSchema
).min(1, "Debe contener al menos un elemento");

export const createIncomeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  storageId: z.string().min(1, "El tipo de almacenamiento es requerido"),
  date: z.coerce.string().min(1, 'Se necesita la fecha'),
  state: z.coerce.boolean(),
  referenceId: z.string().optional(),
  movement: movementArrayIncomeSchema,
});

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
  date: z.coerce.string().optional(),
  state: z.coerce.boolean().optional(),
  referenceId: z.string().optional(),
}) satisfies z.ZodType<UpdateIncomingDto>;

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;
