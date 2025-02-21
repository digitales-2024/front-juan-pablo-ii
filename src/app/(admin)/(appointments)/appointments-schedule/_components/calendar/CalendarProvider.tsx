'use client';
import { useState, useEffect, useMemo } from 'react';
import { CalendarContext } from './CalendarContext';
import CalendarNewEventDialog from './dialog/CalendarNewEventDialog';
import CalendarManageEventDialog from './dialog/CalendarManageEventDialog';
import { useQueryClient } from '@tanstack/react-query';
import { startOfMonth, endOfMonth, format, subDays, addDays } from 'date-fns';
import { useEvents } from '@/app/(admin)/(staff)/schedules/_hooks/useEvents';
import { EventFilterParams } from '@/app/(admin)/(staff)/schedules/_actions/event.actions';
import { CalendarEvent, Mode } from '@/app/(admin)/(staff)/schedules/_types/CalendarTypes';

const EVENT_QUERY_KEY = ['calendar-appointments'] as const;

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

  const monthStart = startOfMonth(parentDate);
  const monthEnd = endOfMonth(parentDate);

  // Ampliar el rango de fechas
  const extendedStart = subDays(monthStart, 7);
  const extendedEnd = addDays(monthEnd, 7);

  const queryClient = useQueryClient();

  const safeFilters = useMemo(() => ({
    ...filters,
    startDate: format(extendedStart, 'yyyy-MM-dd'),
    endDate: format(extendedEnd, 'yyyy-MM-dd')
  }), [filters, extendedStart, extendedEnd]);

  const { events: filteredEvents, eventsCitaQuery } = useEvents(safeFilters);

  useEffect(() => {
    setEvents(eventsCitaQuery.data || []);
  }, [eventsCitaQuery.data]);

  console.log('✅ [CalendarProvider] Eventos actualizados:', {
    count: eventsCitaQuery.data?.length || 0,
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    console.log('🔥 [CalendarProvider] Filtros seguros:', safeFilters);
    console.log('🔥 [CalendarProvider] Eventos filtrados:', eventsCitaQuery.data?.length);
  }, [safeFilters, eventsCitaQuery.data]);

  useEffect(() => {
    // Forzar recarga de datos cuando cambian los filtros
    queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY });
  }, [safeFilters, queryClient]);

  return (
    <CalendarContext.Provider
      value={{
        events: eventsCitaQuery.data || [],
        eventsQuery: eventsCitaQuery,
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
