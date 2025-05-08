import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Patient = components["schemas"]["Patient"];
export type CreatePatientDto = components["schemas"]["CreatePatientDto"];
export type UpdatePatientDto = components["schemas"]["UpdatePatientDto"];
export type DeletePatientDto = { ids: string[] };

// Para la reactivación usamos el mismo DTO que para eliminar
export type ReactivatePatientDto = DeletePatientDto;

// Interfaces extendidas para manejar imágenes
type CreatePatientWithImage = Omit<CreatePatientDto, "patientPhoto"> & {
  patientPhoto?: File;
};
type UpdatePatientWithImage = UpdatePatientDto;
  

// Crear un custom type para File
const fileSchema = z
  .custom<File>((file) => {
    return file instanceof File;
  }, "El archivo debe ser una imagen válida")
  .refine((file) => {
    if (!file) return true; // Permite que sea opcional
    return file instanceof File && file.type.startsWith("image/");
  }, "El archivo debe ser una imagen válida (PNG, JPG, etc.)");

// Schema de validación para crear paciente
export const createPatientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido").optional(),
  dni: z.string().min(8, "El documento debe tener caracteres correspodntintes"),
  birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
  gender: z.string().min(1, "El género es requerido"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  healthInsurance: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  workplace: z.string().optional(),
  bloodType: z.string().optional(),
  primaryDoctor: z.string().optional(),
  sucursal: z.string().min(1, "Por favor selecciona una sucursal"),
  notes: z.string().optional(),
  patientPhoto: fileSchema.optional(), // Usar el esquema personalizado para validar archivos
}) satisfies z.ZodType<CreatePatientWithImage>;

// Schema de validación para actualizar paciente
export const updatePatientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  lastName: z.string().min(1, "El apellido es requerido").optional(),
  dni: z.string().min(8, "El documento debe tener caracteres correspodntintes").optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  healthInsurance: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  workplace: z.string().optional(),
  bloodType: z.string().optional(),
  primaryDoctor: z.string().optional(),
  sucursal: z.string(),
  notes: z.string().optional(),
  patientPhoto: z.string().optional(), // Usar el esquema personalizado para validar archivos
  image: fileSchema.optional(), // Usar el esquema personalizado para validar archivos
}) satisfies z.ZodType<UpdatePatientWithImage>;

// Tipos inferidos de los schemas más el campo image
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;

// Tipos para manejar la creación y actualización con imagen
export interface CreatePatientFormData {
  data: CreatePatientInput;
  image?: File | null;
}

export interface UpdatePatientFormData {
  id: string;
  data: UpdatePatientInput;
  image?: File | null | string;
}
