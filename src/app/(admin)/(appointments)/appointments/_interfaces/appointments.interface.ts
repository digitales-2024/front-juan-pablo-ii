import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type Appointment = components['schemas']['Appointment'] & {
    notes?: string;
};

export type CreateAppointmentDto = components['schemas']['CreateAppointmentDto'];
export type UpdateAppointmentDto = components['schemas']['UpdateAppointmentDto'];
export type DeleteAppointmentsDto = components['schemas']['DeleteAppointmentsDto'];

// Interfaz para la tabla extendiendo el tipo base
export type AppointmentTableItem = Appointment & { selected?: boolean };

// Schema de validación para crear cita
export const createAppointmentSchema = z.object({
    staffId: z.string().min(1, "El ID del personal médico es requerido"),
    serviceId: z.string().min(1, "El ID del servicio es requerido"),
    branchId: z.string().min(1, "El ID de la sucursal es requerido"),
    patientId: z.string().min(1, "El ID del paciente es requerido"),
    start: z.string().min(1, "La fecha y hora de inicio son requeridas"),
    end: z.string().min(1, "La fecha y hora de fin son requeridas"),
    type: z.enum(["CONSULTA", "OTRO"]).optional(),
    notes: z.string().optional(),
}) satisfies z.ZodType<CreateAppointmentDto>;

// Schema de validación para actualizar cita
export const updateAppointmentSchema = z.object({
    staffId: z.string().optional(),
    serviceId: z.string().optional(),
    branchId: z.string().optional(),
    patientId: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    type: z.enum(["CONSULTA", "OTRO"]).optional(),
    notes: z.string().optional(),
}) satisfies z.ZodType<UpdateAppointmentDto>;
