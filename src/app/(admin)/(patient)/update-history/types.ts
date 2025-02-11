export interface Paciente {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    correo: string;
    direccion: string;
    foto: string;
  }
  
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
  }
  
  export interface HistorialItem {
    titulo: string;
    contenido: string;
  }