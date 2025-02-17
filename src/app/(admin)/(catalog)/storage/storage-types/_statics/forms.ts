import { FormStatics } from "@/types/statics/forms";
import { CreateTypeStorageInput, UpdateTypeStorageInput } from "../_interfaces/storageTypes.interface";

// export type FormFieldStatics<T> = {
//     label: string;
//     required: boolean;
//     name : T; //El nombre es el mismo string de la validaciòn de zod
//     placeholder: string;
//     type: HTMLInputTypeAttribute;
//     isNotEditable?: boolean;
//     defaultValue?: string | number; //Change according to necessity
//     description?: string;
//     emptyMessage?: string; //In case of a search select
// }
// export type FormStatics<T> = Record<keyof T, FormFieldStatics<keyof T>>;

// export const createTypeStorageSchema = z.object({
//     name: z.string().min(1, "El nombre es requerido"),
//     description: z.string().optional(),
//     branchId: z.string().uuid().optional(),
//     staffId: z.string().uuid().optional(),
//   }) satisfies z.ZodType<CreateTypeStorageDto>;
//  export const updateTypeStorageSchema = z.object(
//     {
//       name: z.string().optional(),
//       description: z.string().optional(),
//       branchId: z.string().uuid().optional(),
//       staffId: z.string().uuid().optional(),
//     }
//   ) satisfies z.ZodType<UpdateTypeStorageDto>;

export const FORMSTATICS: FormStatics<CreateTypeStorageInput> = {
    name: {
        required: true,
        label: "Nombre",
        defaultValue: "",
        type: "text",
        placeholder: "Nombre del tipo de almacenamiento",
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
    branchId: {
        required: true,
        label: "Sucursal",
        defaultValue: "",
        type: "text",
        placeholder: "Sucursal",
        name: "branchId",
    },
    staffId: {
        required: true,
        label: "Personal",
        defaultValue: "",
        type: "text",
        placeholder: "Personal",
        name: "staffId",
    },
}

export const UPDATEFORMSTATICS: FormStatics<UpdateTypeStorageInput> = {
    name: {
        required: false,
        label: "Nombre",
        defaultValue: "",
        type: "text",
        placeholder: "Nombre del tipo de almacenamiento",
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
    branchId: {
        required: false,
        label: "Sucursal",
        defaultValue: "",
        type: "text",
        placeholder: "Sucursal",
        name: "branchId",
    },
    staffId: {
        required: false,
        label: "Personal",
        defaultValue: "",
        type: "text",
        placeholder: "Personal",
        name: "staffId",
    },
}