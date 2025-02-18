import { components } from "@/types/api";
//import { z } from "zod";
/* tipado para el paciente */
export type Patient = components["schemas"]["Patient"];
export type CreatePatientDto = components["schemas"]["CreatePatientDto"];
export type UpdatePatientDto = components["schemas"]["UpdatePatientDto"];
export type DeletePatientDto = components["schemas"]["DeletePatientDto"];
/* tipado para la historia medica */
export type MedicalHistory = components["schemas"]["MedicalHistory"];
export type MedicalHistoryPrototype = components["schemas"]["MedicalHistory"];
export type UpdateHistoryResponsePrototype = components["schemas"]["UpdateHistoryResponse"];
export type UpdateHistoryDataPrototype = components["schemas"]["UpdateHistoryData"]
export type UpdateHistoryImagePrototype = components["schemas"]["UpdateHistoryImage"]
export type UpdateHistoryImage = {
    id: string;
    url: string;
}
export type UpdateHistoryData = {
    branch: string;
    service: string;
    staff: string;
    images?: UpdateHistoryImage[];
}
export type UpdateHistoryResponse = {
    id: string;
    patientId: string;
    medicalHistory: Record<string, never>;
    description: string;
    isActive: boolean;
    updates?: UpdateHistoryData[];
}
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


//tipado para crear y actualizar la historia medica con la imagen

export type CreateUpdateHistoryDto = components["schemas"]["CreateUpdateHistoryDto"];
export interface CreateUpdateHistoryFormData {
  data: CreateUpdateHistoryDto;
  image?: File | null;
}

export type UpdateUpdateHistoryDto = components["schemas"]["UpdateUpdateHistoryDto"];

export interface UpdateUpdateHistoryFormData {
    data: UpdateUpdateHistoryDto;
    image?: File | null;
  }
//fin


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