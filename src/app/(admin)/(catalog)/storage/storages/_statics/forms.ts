import { FormStatics } from "@/types/statics/forms";
import { CreateStorageInput, UpdateStorageInput } from "../_interfaces/storage.interface";
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

  // export const createStorageSchema = z.object({
  //   name: z.string().min(1, "El nombre es requerido"),
  //   location: z.string().optional(),
  //   typeStorageId: z.string().uuid(),
  // }) satisfies z.ZodType<CreateStorageDto>;

// export const updateStorageSchema = z.object({
//   name: z.string().optional(),
//   location: z.string().optional(),
//   typeStorageId: z.string().optional(),
// }) satisfies z.ZodType<UpdateStorageDto>;
export const FORMSTATICS: FormStatics<CreateStorageInput> = {
    name: {
        required: true,
        label: "Nombre",
        defaultValue: "",
        type: "text",
        placeholder: "Nombre del almacenamiento",
        name: "name",
    },
    location: {
        required: false,
        label: "Ubicación",
        defaultValue: "",
        type: "text",
        placeholder: "Ubicación del almacenamiento",
        name: "location",
    },
    typeStorageId: {
        required: true,
        label: "Tipo de almacenamiento",
        defaultValue: "",
        type: "text",
        placeholder: "Tipo de almacenamiento",
        name: "typeStorageId",
    }
}

export const UPDATEFORMSTATICS: FormStatics<UpdateStorageInput> = {
    name: {
        required: false,
        label: "Nombre",
        defaultValue: "",
        type: "text",
        placeholder: "Nombre del almacenamiento",
        name: "name",
    },
    location: {
        required: false,
        label: "Ubicación",
        defaultValue: "",
        type: "text",
        placeholder: "Ubicación del almacenamiento",
        name: "location",
    },
    typeStorageId: {
        required: false,
        label: "Tipo de almacenamiento",
        defaultValue: "",
        type: "text",
        placeholder: "Tipo de almacenamiento",
        name: "typeStorageId",
    }
}