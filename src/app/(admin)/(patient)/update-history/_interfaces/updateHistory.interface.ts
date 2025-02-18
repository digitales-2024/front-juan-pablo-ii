import { components } from "@/types/api";
//import { z } from "zod";
/* tipado para el paciente */
export type Patient = components["schemas"]["Patient"];
export type CreatePatientDto = components["schemas"]["CreatePatientDto"];
export type UpdatePatientDto = components["schemas"]["UpdatePatientDto"];
export type DeletePatientDto = components["schemas"]["DeletePatientDto"];
/* tipado para la historia medica */
export type MedicalHistory = components["schemas"]["MedicalHistory"];
export type CreateMedicalHistoryDto = components["schemas"]["CreateMedicalHistoryDto"];

//inicio de retipado
export type UpdateMedicalHistoryDtoPrototype = components["schemas"]["UpdateMedicalHistoryDto"];
//retipamos el campo medicalHistory para que sea un objeto
export type UpdateMedicalHistoryDto = Omit<UpdateMedicalHistoryDtoPrototype, 
'medicalHistory'> & { medicalHistory: Record<string, string> };
//fin

export type DeleteMedicalHistoryDto = components["schemas"]["DeleteMedicalHistoryDto"];
/* tipado para el actualizacion  de la historia  */
export type UpdateHistory = components["schemas"]["UpdateHistory"];
export type CreateUpdateHistoryDto = components["schemas"]["CreateUpdateHistoryDto"];
export type UpdateUpdateHistoryDto = components["schemas"]["UpdateUpdateHistoryDto"];
export type DeleteUpdateHistoryDto = components["schemas"]["DeleteUpdateHistoryDto"];
/* tipado para la receta medica */
export type Prescription = components["schemas"]["Prescription"];
export type CreatePrescriptionDto = components["schemas"]["CreatePrescriptionDto"];
export type UpdatePrescriptionDto = components["schemas"]["UpdatePrescriptionDto"];
export type DeletePrescriptionDto = components["schemas"]["DeletePrescriptionDto"];
/* tipado para la sucursal */
export type Branch = components['schemas']['Branch'];
/* tipado para la personal */
export type Staff = components['schemas']['Staff'];
/* tipado para la sucursal */
export type Service = components['schemas']['Service'];