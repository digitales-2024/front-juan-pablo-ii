'use client';
import { useState, useEffect } from 'react';
import { CalendarEvent, Mode } from '../../_types/CalendarTypes';
import { CalendarContext } from './CalendarContext';
import CalendarNewEventDialog from './dialog/CalendarNewEventDialog';
import CalendarManageEventDialog from './dialog/CalendarManageEventDialog';
import { useEvents } from '../../_hooks/useEvents';
import { useQueryClient } from '@tanstack/react-query';

export default function CalendarProvider({
  setEvents,
  mode,
  setMode,
  calendarIconIsToday = true,
  children,
  date: parentDate,
  setDate: parentSetDate,
}: {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday: boolean;
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
      1 - 8 // 8 días antes del inicio del mes
    )
  )
    .toISOString()
    .split('T')[0];

  const utcMonthEnd = new Date(
    Date.UTC(
      parentDate.getUTCFullYear(),
      parentDate.getUTCMonth() + 1,
      0 + 8 // 8 días después del final del mes
    )
  )
    .toISOString()
    .split('T')[0];

  const { events: filteredEvents } = useEvents({
    startDate: utcMonthStart,
    endDate: utcMonthEnd,
    status: 'CONFIRMED',
    type: 'TURNO',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('[🔄] Mes actualizado:', parentDate.toISOString());
    queryClient.removeQueries({ queryKey: ['events'] });
  }, [parentDate, queryClient]);

  return (
    <CalendarContext.Provider
      value={{
        events: (filteredEvents ?? []).map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        })),
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
      }}>
      <CalendarNewEventDialog />
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  );
}
