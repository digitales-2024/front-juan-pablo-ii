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
export interface CreatePatientWithImage extends CreatePatientDto {
  image?: File | null;
}

export interface UpdatePatientWithImage extends UpdatePatientDto {
  image?: File | null;
}

// Schema de validación para crear paciente
export const createPatientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().optional(),
  dni: z.string().min(8, "El DNI debe tener 8 caracteres"),
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
  language: z.string().optional(),
  notes: z.string().optional(),
  patientPhoto: z.string().optional(),
  // No incluimos image en el schema porque Zod no maneja bien File
}) satisfies z.ZodType<Omit<CreatePatientWithImage, 'image'>>;

// Schema de validación para actualizar paciente
export const updatePatientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  lastName: z.string().min(1, "El apellido es requerido").optional(),
  dni: z.string().min(8, "El DNI debe tener 8 caracteres").optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  healthInsurance: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  workplace: z.string().optional(),
  bloodType: z.string().optional(),
  primaryDoctor: z.string().optional(),
  language: z.string().optional(),
  notes: z.string().optional(),
  patientPhoto: z.string().optional(),
  // No incluimos image en el schema porque Zod no maneja bien File
}) satisfies z.ZodType<Omit<UpdatePatientWithImage, 'image'>>;

// Tipos inferidos de los schemas más el campo image
export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>

// Tipos para manejar la creación y actualización con imagen
export interface CreatePatientFormData {
  data: CreatePatientInput;
  image?: File | null;
}

export interface UpdatePatientFormData {
  data: UpdatePatientInput;
  image?: File | null;
}