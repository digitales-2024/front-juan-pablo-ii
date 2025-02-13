
import { components } from "@/types/api";
// Tipos base de la API
export type Patient = components["schemas"]["Patient"];

/* export interface Paciente extends Patient */
/* export interface Paciente {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    correo: string;
    direccion: string;
    foto: string;
  } */

   export interface PrescriptionItem {
    nombre: string;
    dosis: string;
    frecuencia: string;
  }
  
  export interface Servicio {
    serviceId: string;
    staffId: string;
    branchId: string;
    prescription: boolean;
    prescriptionId?: string;
    prescriptionTitle?: string;
    prescriptionDescription?: string;
    prescriptionItems: PrescriptionItem[];
    description: string;
    medicalLeave: boolean;
    medicalLeaveStartDate?: string;
    medicalLeaveEndDate?: string;
    medicalLeaveDays?: number;
    leaveDescription?: string;
    newImages: string[];
    date: string;
  }
  //clave y valo de json de historia medica
  export interface HistorialItem {
    titulo: string;
    contenido: string;
    tipo: string
  }