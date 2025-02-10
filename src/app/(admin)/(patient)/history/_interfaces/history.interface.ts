import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type MedicalHistory = components["schemas"]["MedicalHistory"];
export type CreateMedicalHistoryDto =
  components["schemas"]["CreateMedicalHistoryDto"];
export type UpdateMedicalHistoryDto =
  components["schemas"]["UpdateMedicalHistoryDto"];
export type DeleteMedicalHistoryDto =
  components["schemas"]["DeleteMedicalHistoryDto"];
// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateMedicalHistoryDto = DeleteMedicalHistoryDto;

//ejmplo del dto de create qie tambien es el de update
/**
 * @description ID of the patient
 * @example 123e4567-e89b-12d3-a456-426614174000
 */
//patientId: string;
/**
 * @description Medical history data
 * @example {
 *       "antecedentes": "No relevant history",
 *       "alergias": "None known",
 *       "enfermedadesCronicas": [
 *         "Hypertension"
 *       ],
 *       "cirugiasPrevias": [
 *         "Appendectomy 2018"
 *       ]
 *     }
 */
//medicalHistory: Record<string, never>;
/**
 * @description Additional description
 * @example First patient consultation
 */
//description?: string;

// Schema de validación para crear/actualizar producto
/* MedicalHistory: {
  id: string;
  patientId: string;
  medicalHistory: Record<string, never>;
  description: string;
  isActive: boolean;
} */
// }
export const createMedicalHistorySchema = z.object({
  patientId: z.string(),
  medicalHistory: z.record(z.never()).optional(),
  description: z.string().optional(),
}) satisfies z.ZodType<CreateMedicalHistoryDto>;

export const updateMedicalHistorySchema = z.object({
  patientId: z.string(),
  medicalHistory: z.record(z.never()).optional(),
  description: z.string().optional(),
}) satisfies z.ZodType<UpdateMedicalHistoryDto>;

export type CreateMedicalHistoryInput = z.infer<
  typeof createMedicalHistorySchema
>;
export type UpdateMedicalHistoryInput = z.infer<
  typeof updateMedicalHistorySchema
>;
