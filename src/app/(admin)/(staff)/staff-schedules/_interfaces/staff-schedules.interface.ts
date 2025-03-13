import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export type StaffSchedule = components['schemas']['StaffSchedule'] & {
  staff?: {
    name: string;
    lastName: string;
  };
  branch?: {
    name: string;
  };
};
export type CreateStaffScheduleDto = components['schemas']['CreateStaffScheduleDto'];
export type UpdateStaffScheduleDto = components['schemas']['UpdateStaffScheduleDto'];
export type DeleteStaffSchedulesDto = components['schemas']['DeleteStaffSchedulesDto'];

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateStaffSchedulesDto = DeleteStaffSchedulesDto;

// Interfaz para la tabla extendiendo el tipo base
export type StaffScheduleTableItem = StaffSchedule & { selected?: boolean };

// Actualizar el timeSchema para coincidir con el formato HH:mm estricto
const timeSchema = z.string()
  .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Formato HH:mm requerido (ej: 09:00)");

export const createStaffScheduleSchema = z.object({
  staffId: z.string().min(1, "El personal es requerido"),
  branchId: z.string().min(1, "La sucursal es requerida"),
  title: z.string().min(1, "El título es requerido"),
  color: z.string().min(1, "El color es requerido"),
  startTime: timeSchema,
  endTime: timeSchema,
  daysOfWeek: z.array(z.enum([
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
    "FRIDAY", "SATURDAY", "SUNDAY"
  ])).min(1, "Se requiere al menos un día"),
  recurrence: z.object({
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    interval: z.number().int().positive().min(1, "El intervalo debe ser al menos 1"),
    until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD requerido")
  }),
  exceptions: z.array(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD requerido")
  )
});

// Schema de actualización actualizado para coincidir con el nuevo DTO del backend
// Ahora incluimos el campo title como opcional
export const updateStaffScheduleSchema = z.object({
  title: z.string().min(1, "El título es requerido").optional(),
  staffId: z.string().min(1, "El personal es requerido").optional(),
  branchId: z.string().min(1, "La sucursal es requerida").optional(),
  color: z.string().min(1, "El color es requerido").optional(),
  startTime: timeSchema.optional(),
  endTime: timeSchema.optional(),
  daysOfWeek: z.array(z.enum([
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
    "FRIDAY", "SATURDAY", "SUNDAY"
  ])).optional(),
  recurrence: z.object({
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    interval: z.number().int().positive(),
    until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD requerido")
  }).optional(),
  exceptions: z.array(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD requerido")
  ).optional().default([])
});