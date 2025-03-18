import { z } from "zod";
import { AppointmentStatus } from "./appointments.interface";

// Enum para los tipos de filtro
export enum AppointmentsFilterType {
    ALL = "ALL",
    BY_STATUS = "BY_STATUS",
    BY_DATE_RANGE = "BY_DATE_RANGE",
    BY_PATIENT = "BY_PATIENT",
    BY_STAFF = "BY_STAFF",
}

// Schema para filtrar por estado
export const FilterByStatusSchema = z.object({
    appointmentStatus: z.enum([
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
        "RESCHEDULED"
    ]),
});

// Schema para filtrar por rango de fechas
export const FilterByDateRangeSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
});

// Schema para filtrar por paciente
export const FilterByPatientSchema = z.object({
    patientId: z.string(),
});

// Schema para filtrar por personal médico
export const FilterByStaffSchema = z.object({
    staffId: z.string(),
});

// Tipos inferidos de los schemas
export type FilterByStatus = z.infer<typeof FilterByStatusSchema>;
export type FilterByDateRange = z.infer<typeof FilterByDateRangeSchema>;
export type FilterByPatient = z.infer<typeof FilterByPatientSchema>;
export type FilterByStaff = z.infer<typeof FilterByStaffSchema>; 