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
        placeholder: "Nombre del almacén",
        name: "name",
    },
    location: {
        required: false,
        label: "Ubicación interna del almacén (Opcional)",
        defaultValue: "",
        type: "text",
        placeholder: "Segundo piso, primer piso, etc.",
        name: "location",
    },
    typeStorageId: {
        required: true,
        label: "Tipo de almacén",
        defaultValue: "",
        type: "text",
        placeholder: "Tipo de almacén",
        name: "typeStorageId",
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

export const UPDATEFORMSTATICS: FormStatics<UpdateStorageInput> = {
    name: {
        required: false,
        label: "Nombre",
        defaultValue: "",
        type: "text",
        placeholder: "Nombre del almacén",
        name: "name",
    },
    location: {
        required: false,
        label: "Ubicación",
        defaultValue: "",
        type: "text",
        placeholder: "Ubicación del almacén",
        name: "location",
    },
    typeStorageId: {
        required: false,
        label: "Tipo de almacén",
        defaultValue: "",
        type: "text",
        placeholder: "Tipo de almacén",
        name: "typeStorageId",
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