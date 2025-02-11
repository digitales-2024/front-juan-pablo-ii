import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
/* export type CreateMedicalHistoryDto =
  components["schemas"]["CreateMedicalHistoryDto"]; */

export type MedicalHistory = components["schemas"]["MedicalHistory"];
export type UpdateMedicalHistoryDto =
  components["schemas"]["UpdateMedicalHistoryDto"]; //
export type DeleteMedicalHistoryDto =
  components["schemas"]["DeleteMedicalHistoryDto"]; /* DeleteMedicalHistoryDto: { ids: string[]; }; */
// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateMedicalHistoryDto = DeleteMedicalHistoryDto;
//historia completa con actualizaciones e imagenes
export type CompleteMedicalHistory = {
  data: MedicalHistory & {
    updates: Record<
      string,
      {
        service: string;
        staff: string;
        branch: string;
        images: {
          id: string;
          url: string;
        }[];
      }
    >;
  };
};

//ejemplo del dto de actualizar que tambien es el de update
//UpdateMedicalHistoryDto: {
/**
 * @description ID of the patient
 * @example 123e4567-e89b-12d3-a456-426614174000
 */
//patientId?: string;
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
//medicalHistory?: Record<string, never>;
/**
 * @description Additional description
 * @example First patient consultation
 */
//description?: string;

export const updateMedicalHistorySchema = z.object({
  patientId: z.string(),
  medicalHistory: z.record(z.never()).optional(),
  description: z.string().optional(),
  //datos para actualizar la historia medica
  titulo: z.string().optional(),
  contenido: z.string().optional(),
}) satisfies z.ZodType<UpdateMedicalHistoryDto>;

export type UpdateMedicalHistoryInput = z.infer<
  typeof updateMedicalHistorySchema

>;

// Schema de validación para crear/actualizar producto
/* MedicalHistory: {
  id: string;
  patientId: string;
  medicalHistory: Record<string, never>;
  description: string;
  isActive: boolean;
} */
// }
/* export const createMedicalHistorySchema = z.object({
  patientId: z.string(),
  medicalHistory: z.record(z.never()).optional(),
  description: z.string().optional(),
}) satisfies z.ZodType<CreateMedicalHistoryDto>; */

/* export type CreateMedicalHistoryInput = z.infer<
  typeof createMedicalHistorySchema
>; */
