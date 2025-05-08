import { AppointmentStatus } from "../_interfaces/appointments.interface";

export const APPOINTMENT_STATUS_TRANSLATIONS: Record<AppointmentStatus, string> = {
    "PENDING": "Pendiente",
    "CONFIRMED": "Confirmada",
    "CANCELLED": "Cancelada",
    "COMPLETED": "Completada",
    "NO_SHOW": "No asistió",
    "RESCHEDULED": "Reprogramada",
    "all": "Todas"
};

export const getStatusTranslation = (status: AppointmentStatus): string => {
    return APPOINTMENT_STATUS_TRANSLATIONS[status] || status;
}; 