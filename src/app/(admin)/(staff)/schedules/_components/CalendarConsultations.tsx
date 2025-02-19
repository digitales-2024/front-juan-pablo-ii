'use client';
import { useState, useEffect } from 'react';
import { Mode } from '../_types/CalendarTypes';
import Calendar from './calendar/Calendar';
import { useEvents, type EventFilterParams } from '../_hooks/useEvents';
import { EventFilters } from './calendar/header/filters/EventFilters';
import { useQueryClient } from '@tanstack/react-query';

// Define el tipo de datos que entrega la API
// interface ApiCalendarEvent {
// 	id: string;
// 	title: string;
// 	type: "TURNO" | string;
// 	start: string;
// 	end: string;
// 	color?: string;
// 	status: string;
// 	isActive: boolean;
// 	isCancelled: boolean;
// 	isBaseEvent: boolean;
// 	branchId: string;
// 	staffId: string;
// 	staffScheduleId: string;
// 	recurrence?: string | null;
// 	exceptionDates?: any[];
// 	cancellationReason?: string | null;
// 	createdAt: string;
// 	updatedAt: string;
// }

// Definir tipo explícito para los filtros
// const filters: EventFilterParams = {
// 	staffId: "86438925-75c1-4239-ac91-15004527fe5a",
// 	type: "TURNO",
// 	branchId: "5ed6ea70-3419-4c70-a761-0067b440b753",
// 	status: "CONFIRMED",
// };

export default function CalendarConsultations() {
  const [mode, setMode] = useState<Mode>('mes');
  const [date, setDate] = useState<Date>(new Date());
  const [appliedFilters, setAppliedFilters] = useState<EventFilterParams>({
    staffId: undefined,
    type: 'TURNO',
    branchId: undefined,
    status: 'CONFIRMED',
    staffScheduleId: undefined,
  });

  const queryClient = useQueryClient();

  // Calcular fechas extendidas con buffer
  const utcMonthStart = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1 - 8)
  )
    .toISOString()
    .split('T')[0];

  const utcMonthEnd = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0 + 8)
  )
    .toISOString()
    .split('T')[0];

  const {
    eventsQuery: { data: events, isLoading, error },
  } = useEvents({
    ...appliedFilters,
    startDate: utcMonthStart,
    endDate: utcMonthEnd,
  });

  useEffect(() => {
    console.log('🔄 Estado de carga de eventos:', {
      isLoading,
      error: error?.message,
      eventsCount: events?.length,
    });
  }, [isLoading, error, events]);

  useEffect(() => {
    if (error) {
      console.error('🚨 Error cargando eventos:', error);
    }
  }, [error]);

  const handleFilterChange = (newFilters: EventFilterParams) => {
    setAppliedFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <div>
      <EventFilters onFilterChange={handleFilterChange} />
      {isLoading && <div>Cargando eventos...</div>}
      {error && <div>Error al cargar eventos: {error.message}</div>}
      <Calendar
        events={events ?? []}
        setEvents={() => {
          /* Lógica de actualización no implementada */
        }}
        mode={mode}
        setMode={setMode}
        date={date}
        setDate={(newDate) => {
          setDate(newDate);
          void queryClient.invalidateQueries({
            queryKey: ['events'],
            exact: false,
          });
        }}
      />
    </div>
  );
}
