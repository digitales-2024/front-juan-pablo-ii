'use client';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CalendarProvider from './calendar/CalendarProvider';
import Calendar from './calendar/Calendar';
import { EventFilterParams } from '@/app/(admin)/(staff)/schedules/_hooks/useEvents';
import { CalendarEvent, Mode } from '@/app/(admin)/(staff)/schedules/_types/CalendarTypes';
import { EventFilters } from './calendar/header/filters/EventFilters';

export default function CalendarAppointments() {
    const [mode, setMode] = useState<Mode>('mes');
    const [date, setDate] = useState<Date>(new Date());
    const [appliedFilters, setAppliedFilters] = useState<EventFilterParams>({
        type: 'CITA',
        status: undefined,
        staffId: undefined,
        branchId: undefined,
        staffScheduleId: undefined,
    });
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    console.log("calendarEvents", calendarEvents);

    const queryClient = useQueryClient();

    const handleFilterChange = (newFilters: Partial<EventFilterParams>) => {
        setAppliedFilters(prev => ({
            ...prev,
            ...newFilters,
            type: 'CITA'
        }));
    };

    useEffect(() => {
        console.log('🔄 [CalendarAppointments] Eventos actualizados:', calendarEvents);
    }, [calendarEvents]);

    useEffect(() => {
        console.log('🔄 [CalendarAppointments] Filtros aplicados:', appliedFilters);
    }, [appliedFilters]);

    return (
        <div className="flex flex-col h-full">
            <EventFilters
                appliedFilters={appliedFilters}
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
                <Calendar />
            </CalendarProvider>
        </div>
    );
}
