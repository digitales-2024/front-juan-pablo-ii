import { EventFilterParams } from "../_hooks/useEvents";
import { UseQueryResult } from "@tanstack/react-query";
import { Event } from "../_interfaces/event.interface";

export type CalendarProps = {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday?: boolean;
};

export interface CalendarContextType {
  eventsQuery: UseQueryResult<Event[], Error>;
  currentMonth: number;
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday?: boolean;
  newEventDialogOpen: boolean;
  setNewEventDialogOpen: (open: boolean) => void;
  manageEventDialogOpen: boolean;
  setManageEventDialogOpen: (open: boolean) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  filters: EventFilterParams;
}

export type ColorType =
  | 'blue'
  | 'indigo'
  | 'pink'
  | 'red'
  | 'orange'
  | 'amber'
  | 'emerald'
  | 'sky';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  staff: {
    name: string;
    lastName: string;
  };
  branch: {
    name: string;
  };
  type: 'TURNO' | 'CITA' | 'OTRO';
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  isActive: boolean;
  isCancelled: boolean;
  isBaseEvent: boolean;
  branchId: string;
  staffId: string;
  staffScheduleId: string;
  recurrence: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval: number;
    until: string;
  };
  exceptionDates?: Date[];
  cancellationReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
//TODO: Cambiar a "dia", "semana", "mes"
export const calendarModes = ['mes', 'semana', 'dia'] as const;
export type Mode = (typeof calendarModes)[number];
