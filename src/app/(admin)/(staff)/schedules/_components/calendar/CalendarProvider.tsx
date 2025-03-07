'use client';
import { useState, useEffect, useMemo } from 'react';
import { CalendarEvent, Mode } from '../../_types/CalendarTypes';
import { CalendarContext } from './CalendarContext';
import CalendarNewEventDialog from './dialog/CalendarNewEventDialog';
import CalendarManageEventDialog from './dialog/CalendarManageEventDialog';
import { useEvents } from '../../_hooks/useEvents';
import { useQueryClient } from '@tanstack/react-query';
import { EventFilterParams } from '../../_actions/event.actions';
import { startOfMonth, endOfMonth, format, subDays, addDays } from 'date-fns';

const EVENT_QUERY_KEY = ['calendar-turns'] as const;

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
    startDate: format(extendedStart, 'yyyy-MM-dd'),
    endDate: format(extendedEnd, 'yyyy-MM-dd')
  }), [filters, extendedStart, extendedEnd]);

  const queryClient = useQueryClient();

  const { events: turnos, eventsQuery } = useEvents(safeFilters);

  console.log("hola xd", turnos);

  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])
  console.log(filteredEvents);

  useEffect(() => {
    console.log('🔄 [Provider] Eventos recibidos:', turnos);
    if (turnos) {
      setFilteredEvents(turnos);
    } else {
      console.warn('⚠️ [Provider] No se recibieron eventos.');
    }
  }, [turnos]);

  const contextValue = useMemo(() => ({
    events: filteredEvents || [],
    eventsQuery,
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

    if (eventsQuery.isStale && !eventsQuery.data) {
      console.log('🔄 [Provider] Refetching events...');
      eventsQuery.refetch();
    }
  }, [safeFilters, eventsQuery]);

  useEffect(() => {
    console.log('🔄 [Provider] Invalidando query con filtros:', safeFilters);
    queryClient.invalidateQueries({
      queryKey: [EVENT_QUERY_KEY, safeFilters],
      exact: false
    });
  }, [parentDate, queryClient]);

  useEffect(() => {
    console.log('🔄 [Provider] Actualizando eventos principales', turnos?.length);
    if (!turnos) return;

    const parsedEvents = turnos.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));

    setFilteredEvents(parsedEvents);
    setEvents(parsedEvents);

    // Actualizar la caché con los nuevos eventos
    queryClient.setQueryData(['calendar-turns', safeFilters], parsedEvents);

    // No es necesario invalidar aquí, ya que estamos actualizando la caché directamente
  }, [turnos]);

  useEffect(() => {
    console.log('📅 [Calendar] Eventos actualizados', {
      count: filteredEvents?.length || 0,
      source: eventsQuery.dataUpdatedAt
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
    if (eventsQuery.data) {
      setFilteredEvents(eventsQuery.data);
      setEvents(eventsQuery.data);
    }
  }, [eventsQuery.data, setEvents, setFilteredEvents]);

  useEffect(() => {
    // Invalidar la query cuando cambia el mes
    queryClient.invalidateQueries({
      queryKey: ['calendar-turns', safeFilters],
      exact: false
    });

    console.log('🔄 [Month Change] Invalidando queries para el nuevo mes');
  }, [parentDate, queryClient]);

  useEffect(() => {
    console.log('🔍 [Provider] Query activa:', {
      queryKey: ['calendar-turns', safeFilters],
      data: queryClient.getQueryData(['calendar-turns', safeFilters])
    });
  }, [safeFilters, queryClient]);

  console.log('🔧 [Provider] Tipo de setEvents:', typeof setEvents);
  console.log('🔍 Turnos recibidos:', {
    count: turnos?.length || 0,
    data: turnos?.map(t => t.title)
  });

  return (
    <CalendarContext.Provider value={contextValue}>
      <CalendarNewEventDialog />
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  );
}
