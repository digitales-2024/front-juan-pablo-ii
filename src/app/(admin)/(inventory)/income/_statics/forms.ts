import { ComplexFormStatics, FormStatics } from "@/types/statics/forms";
import { CreateIncomeInput, MovementDto, UpdateIncomeInput } from "../_interfaces/income.interface";
// export const createProductSchema = z.object({
//   name: z.string().min(1, "El nombre es requerido"), //En el back es opcional, pero considero que debe ser requerido
//   description: z.string().optional(),
//   storageId: z.string().min(1, "El tipo de almacenamiento es requerido"),
//   date: z.string().date("La fecha es requerida"),
//   state: z.boolean(),
//   referenceId: z.string().optional(),
//   movement: z.array(
//     z.object({
//       productId: z.string().min(1, "El producto es requerido"),
//       quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
//       date: z.string().optional(),
//       state: z.boolean().optional(),
//     })
//   ),
// }) satisfies z.ZodType<CreateIncomingDto>;

export const FORMSTATICS: ComplexFormStatics<CreateIncomeInput, MovementDto> = {
    name: {
        required: true,
        label: "Nombre",
        type: "text",
        placeholder: "Ingreso de regulación , aumento de stock, etc.",
        name: "name",
    },
    description: {
        required: false,
        label: "Descripción",
        defaultValue: "",
        type: "text",
        placeholder: "Descripción",
        name: "description",
    },
    storageId: {
        required: true,
        label: "Almacenamiento",
        defaultValue: "",
        type: "select",
        placeholder: "Selecciona un almacenamiento",
        emptyMessage: "No se encontraron almacenes",
        name: "storageId",
    },
    date: {
        required: true,
        label: "Fecha",
        defaultValue: new Date().toISOString().split("T")[0],
        type: "date",
        placeholder: "Fecha",
        name: "date",
    },
    state: {
        required: false,
        label: "Estado de consumación de ingreso",
        defaultValue: undefined,
        type: "checkbox",
        placeholder: "Estado",
        name: "state",
    },
    referenceId: {
        required: false,
        label: "Referencia",
        defaultValue: "",
        type: "text",
        placeholder: "Referencia",
        name: "referenceId",
    },
    movement: {
        required: true,
        label: "Movimientos",
        type: "array",
        placeholder: "Movimientos",
        name: "movement",
        subFields: {
            productId: {
                required: true,
                label: "Producto",
                defaultValue: "",
                type: "select",
                placeholder: "Selecciona un producto",
                emptyMessage: "No se encontraron productos",
                name: "productId",
            },
            quantity: {
                required: true,
                label: "Cantidad",
                defaultValue: 0,
                type: "number",
                placeholder: "Cantidad",
                name: "quantity",
            },
            date: {
                required: false,
                label: "Fecha",
                defaultValue: undefined,//new Date().toISOString().split("T")[0],
                type: "date",
                placeholder: "Fecha",
                name: "date",
            },
            state: {
                required: false,
                label: "Estado",
                defaultValue: "false",
                type: "checkbox",
                placeholder: "Estado",
                name: "state",
            },
        },
    },
}

// export const updateProductSchema = z.object({
//   name: z.string().optional(),
//   description: z.string().optional(),
//   storageId: z.string().optional(),
//   date: z.string().optional(),
//   state: z.boolean().optional(),
//   referenceId: z.string().optional(),
// }) satisfies z.ZodType<UpdateIncomingDto>;
export const UPDATEFORMSTATICS: FormStatics<UpdateIncomeInput> = {
    name: {
        required: false,
        label: "Nombre",
        type: "text",
        defaultValue: "",
        placeholder: "Ingreso de regulación , aumento de stock, etc.",
        name: "name",
    },
    description: {
        required: false,
        label: "Descripción",
        defaultValue: "",
        type: "text",
        placeholder: "Descripción",
        name: "description",
    },
    storageId: {
        required: false,
        label: "Almacenamiento",
        defaultValue: "",
        type: "select",
        placeholder: "Selecciona un almacenamiento",
        emptyMessage: "No se encontraron almacenes",
        name: "storageId",
    },
    date: {
        required: false,
        label: "Fecha",
        defaultValue: undefined,
        type: "date",
        placeholder: "Fecha",
        name: "date",
    },
    state: {
        required: false,
        label: "Estado de consumación de ingreso",
        defaultValue: undefined,
        type: "checkbox",
        placeholder: "Estado",
        name: "state",
    },
    referenceId: {
        required: false,
        label: "Referencia",
        defaultValue: "",
        type: "text",
        placeholder: "Referencia",
        name: "referenceId",
    },
}