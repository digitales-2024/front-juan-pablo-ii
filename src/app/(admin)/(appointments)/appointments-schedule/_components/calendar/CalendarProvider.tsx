'use client';
import { useState, useEffect, useMemo } from 'react';
import { CalendarEvent, Mode } from '@/app/(admin)/(staff)/schedules/_types/CalendarTypes';
import { CalendarContext } from './CalendarContext';
import CalendarNewEventDialog from './dialog/CalendarNewEventDialog';
import CalendarManageEventDialog from './dialog/CalendarManageEventDialog';
import { useEvents } from '@/app/(admin)/(staff)/schedules/_hooks/useEvents';
import { useQueryClient } from '@tanstack/react-query';
import { EventFilterParams } from '@/app/(admin)/(staff)/schedules/_actions/event.actions';
import { startOfMonth, endOfMonth, format, subDays, addDays } from 'date-fns';

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
  console.log("✅ [Provider] Montando CalendarProvider");

  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [manageEventDialogOpen, setManageEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const { extendedStart, extendedEnd } = useMemo(() => {
    const monthStart = startOfMonth(parentDate);
    const monthEnd = endOfMonth(parentDate);
    return {
      extendedStart: subDays(monthStart, 7),
      extendedEnd: addDays(monthEnd, 7)
    };
  }, [parentDate]);

  const safeFilters = useMemo(() => ({
    ...filters,
    type: 'CITA' as const,
    startDate: format(extendedStart, 'yyyy-MM-dd'),
    endDate: format(extendedEnd, 'yyyy-MM-dd')
  }), [filters, extendedStart, extendedEnd]);

  const queryClient = useQueryClient();

  const { eventsCitaQuery } = useEvents(safeFilters);

  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (eventsCitaQuery.data) {
      const onlyCitas = eventsCitaQuery.data.filter(event => event.type === 'CITA');
      console.log('🔄 [Provider] Eventos filtrados por tipo CITA:', onlyCitas.length);
      setFilteredEvents(onlyCitas);
      setEvents(onlyCitas);
    } else {
      console.warn('⚠️ [Provider] No se recibieron eventos.');
      setFilteredEvents([]);
      setEvents([]);
    }
  }, [eventsCitaQuery.data, setEvents]);

  const contextValue = useMemo(() => ({
    events: filteredEvents || [],
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
  }), [filteredEvents, parentDate, setEvents, mode, setMode, parentSetDate, calendarIconIsToday, newEventDialogOpen, manageEventDialogOpen, selectedEvent, safeFilters]);

  useEffect(() => {
    console.log('🔄 [Provider] Filtros actuales:', safeFilters);
    console.log('🔄 [Provider] Eventos filtrados:', filteredEvents);

    if (eventsCitaQuery.isStale && !eventsCitaQuery.data) {
      console.log('🔄 [Provider] Refetching events...');
      eventsCitaQuery.refetch();
    }
  }, [safeFilters, eventsCitaQuery]);

  useEffect(() => {
    console.log('🔄 [Provider] Invalidando query con filtros:', safeFilters);
    queryClient.invalidateQueries({
      queryKey: [EVENT_QUERY_KEY, safeFilters],
      exact: false
    });
  }, [parentDate, queryClient]);

  useEffect(() => {
    console.log('🔄 [Provider] Actualizando eventos principales', eventsCitaQuery.data?.length);
    if (!eventsCitaQuery.data) return;

    const parsedEvents = eventsCitaQuery.data.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));

    setFilteredEvents(parsedEvents);
    setEvents(parsedEvents);

    // Actualizar la caché con los nuevos eventos
    queryClient.setQueryData(['calendar-appointments', safeFilters], parsedEvents);

    // No es necesario invalidar aquí, ya que estamos actualizando la caché directamente
  }, [eventsCitaQuery.data]);

  useEffect(() => {
    console.log('📅 [Calendar] Eventos actualizados', {
      count: filteredEvents?.length || 0,
      source: eventsCitaQuery.dataUpdatedAt
        ? 'Caché'
        : 'Nueva petición'
    });
  }, [filteredEvents]);

  useEffect(() => {
    console.log('🔥 [CalendarProvider] Filtros seguros:', safeFilters);
    console.log('🔄 [CalendarProvider] Eventos filtrados:', filteredEvents?.length);
  }, [safeFilters, filteredEvents]);

  useEffect(() => {
    // Almacenar los filtros actuales
    queryClient.setQueryData(['calendar-filters'], safeFilters);
  }, [safeFilters]);

  useEffect(() => {
    if (eventsCitaQuery.data) {
      setFilteredEvents(eventsCitaQuery.data);
      setEvents(eventsCitaQuery.data);
    }
  }, [eventsCitaQuery.data, setEvents]);

  useEffect(() => {
    // Invalidar la query cuando cambia el mes
    queryClient.invalidateQueries({
      queryKey: ['calendar-appointments', safeFilters],
      exact: false
    });

    console.log('🔄 [Month Change] Invalidando queries para el nuevo mes');
  }, [parentDate, queryClient]);

  useEffect(() => {
    console.log('🔍 [Provider] Query activa:', {
      queryKey: ['calendar-appointments', safeFilters],
      data: queryClient.getQueryData(['calendar-appointments', safeFilters])
    });
  }, [safeFilters, queryClient]);

  console.log('🔧 [Provider] Tipo de setEvents:', typeof setEvents);
  console.log('🔍 Citas recibidas:', {
    count: eventsCitaQuery.data?.length || 0,
    data: eventsCitaQuery.data?.map(t => t.title)
  });

  console.log('🔍 Citas filtradas:', {
    count: filteredEvents?.length || 0,
    tipos: filteredEvents?.map(e => e.type)
  });

  return (
    <CalendarContext.Provider value={contextValue}>
      <CalendarNewEventDialog />
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  );
}
