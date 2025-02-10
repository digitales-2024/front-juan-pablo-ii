import { components } from "@/types/api";
import { z } from "zod";

// Tipos base de la API
export enum EventType {
  TURNO = 'TURNO',
  CITA = 'CITA',
  OTRO = 'OTRO'
}

export enum EventStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

// Tipo Event actualizado
export type Event = {
  id: string;
  title: string;
  type: EventType;
  start: Date;
  end: Date;
  color?: string;
  status: EventStatus;
  isActive: boolean;
  isCancelled: boolean;
  isBaseEvent: boolean;
  recurrence: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval: number;
    until: string;
  };
  exceptionDates?: Date[];
  cancellationReason?: string;
  staffScheduleId: string;
  staffId: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
  staff: {
    name: string;
    lastName: string;
  };
  branch: {
    name: string;
  };
};

export type CreateEventDto = components['schemas']['CreateEventDto'];
export type UpdateEventDto = components['schemas']['UpdateEventDto'];
export type DeleteEventsDto = components['schemas']['DeleteEventsDto'];

// Mismo DTO para reactivación
export type ReactivateEventsDto = DeleteEventsDto;

// Interfaz extendida para tabla
export type EventTableItem = Event & { selected?: boolean };

// Esquemas de validación
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD requerido");
const timeSchema = z.string()
  .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Formato HH:mm requerido (ej: 09:00)");

export const createEventSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  type: z.enum(["TURNO", "CITA", "OTRO"]),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
  description: z.string().optional(),
  patientId: z.string().min(1, "Paciente requerido"),
  staffId: z.string().min(1, "Personal requerido"),
  branchId: z.string().min(1, "Sucursal requerida"),
  recurrence: z.object({
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    interval: z.number().int().positive(),
    until: dateSchema
  }).optional(),
  exceptions: z.array(dateSchema).optional().default([])
}) satisfies z.ZodType<CreateEventDto>;

export const updateEventSchema = z.object({
  title: z.string().min(1, "El título es requerido").optional(),
  start: z.string().datetime({ offset: true }).optional(),
  end: z.string().datetime({ offset: true }).optional(),
  type: z.enum(["TURNO", "CITA", "OTRO"]).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  description: z.string().optional(),
  patientId: z.string().min(1, "Paciente requerido").optional(),
  staffId: z.string().min(1, "Personal requerido").optional(),
  branchId: z.string().min(1, "Sucursal requerida").optional(),
  recurrence: z.object({
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    interval: z.number().int().positive(),
    until: dateSchema
  }).optional(),
  exceptions: z.array(dateSchema).optional().default([])
}) satisfies z.ZodType<UpdateEventDto>;
