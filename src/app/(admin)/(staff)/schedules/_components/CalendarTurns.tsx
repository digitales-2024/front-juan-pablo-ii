'use client';
import { useState, useEffect } from 'react';
import { CalendarEvent, Mode } from '../_types/CalendarTypes';
import Calendar from './calendar/Calendar';
import { useEvents, type EventFilterParams } from '../_hooks/useEvents';
import { EventFilters } from './calendar/header/filters/EventFilters';
import CalendarProvider from './calendar/CalendarProvider';



export default function CalendarTurns() {
  const [mode, setMode] = useState<Mode>('mes');
  const [date, setDate] = useState<Date>(new Date());
  const [appliedFilters, setAppliedFilters] = useState<EventFilterParams>({
    staffId: undefined,
    type: 'TURNO',
    branchId: undefined,
    status: 'CONFIRMED',
    staffScheduleId: undefined,
  });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  console.log("calendarEvents", calendarEvents);

  const handleFilterChange = (newFilters: EventFilterParams) => {
    setAppliedFilters(prev => ({
      ...prev,
      ...newFilters,
      status: 'CONFIRMED'
    }));
  };



  // Eliminar completamente la query de useEvents aquí
  return (
    <div>
      <EventFilters
        onFilterChange={handleFilterChange}
        currentDate={date}
      />
      <CalendarProvider
        setEvents={setCalendarEvents}
        mode={mode}
        setMode={setMode}
        date={date}
        setDate={setDate}
        calendarIconIsToday={true}
        filters={appliedFilters}
      >
        <Calendar
        />
      </CalendarProvider>
    </div>
  );
}
