'use client';
import { useState, useEffect, useMemo } from 'react';
import { CalendarEvent, Mode } from '../../_types/CalendarTypes';
import { CalendarContext } from './CalendarContext';
import CalendarNewEventDialog from './dialog/CalendarNewEventDialog';
import CalendarManageEventDialog from './dialog/CalendarManageEventDialog';
import { useEvents } from '../../_hooks/useEvents';
import { useQueryClient } from '@tanstack/react-query';
import { EventFilterParams } from '../../_actions/event.actions';
import { getEventQueryKey } from '../../_hooks/useEventQueryKey';

export default function CalendarProvider({
  setEvents,
  mode,
  setMode,
  calendarIconIsToday = true,
  children,
  filters,
  date: parentDate,
  setDate: parentSetDate,
}: {
  setEvents: (events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday: boolean;
  filters: EventFilterParams
  children: React.ReactNode;
}) {
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [manageEventDialogOpen, setManageEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  const utcMonthStart = new Date(
    Date.UTC(
      parentDate.getUTCFullYear(),
      parentDate.getUTCMonth(),
      1
    )
  ).toISOString().split('T')[0];

  const utcMonthEnd = new Date(
    Date.UTC(
      parentDate.getUTCFullYear(),
      parentDate.getUTCMonth() + 1,
      0
    )
  ).toISOString().split('T')[0];

  const queryClient = useQueryClient();

  // Asegurar valores por defecto en los filtros
  const safeFilters = useMemo(() => ({
    ...filters,  // Asegurar que se propaguen TODOS los filtros
    type: filters?.type ?? 'TURNO',
    status: filters?.status ?? 'CONFIRMED',
    startDate: utcMonthStart,
    endDate: utcMonthEnd
  }), [filters, utcMonthStart, utcMonthEnd]);

  useEffect(() => {
    const queryKey = getEventQueryKey(safeFilters, parentDate);
    console.log('🔥 [CalendarProvider] Invalidando query específica:', queryKey);

    queryClient.invalidateQueries({
      queryKey,
      exact: true,
      refetchType: 'active'
    });

    // Forzar recarga inicial
    queryClient.refetchQueries({ queryKey });
  }, [safeFilters, parentDate]);

  const { events: filteredEvents } = useEvents(safeFilters);

  useEffect(() => {
    // Actualizar los eventos en el contexto con los filtros aplicados
    setEvents(filteredEvents || []);
  }, [filteredEvents]); // Solo ejecutar cuando filteredEvents cambie

  console.log('✅ [CalendarProvider] Eventos actualizados:', {
    count: filteredEvents?.length || 0,
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    console.log('🔥 [CalendarProvider] Filtros seguros:', safeFilters);
    console.log('🔥 [CalendarProvider] Eventos filtrados:', filteredEvents?.length);
  }, [safeFilters, filteredEvents]);

  return (
    <CalendarContext.Provider
      value={{
        events: useMemo(() => filteredEvents || [], [filteredEvents]), // Simplificar
        currentMonth: parentDate.getMonth(),
        setEvents,
        mode,
        setMode,
        date: parentDate,
        setDate: parentSetDate,
        calendarIconIsToday,
        newEventDialogOpen,
        setNewEventDialogOpen,
        manageEventDialogOpen,
        setManageEventDialogOpen,
        selectedEvent,
        setSelectedEvent,
        filters: safeFilters,
      }}>
      <CalendarNewEventDialog />
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  );
}
