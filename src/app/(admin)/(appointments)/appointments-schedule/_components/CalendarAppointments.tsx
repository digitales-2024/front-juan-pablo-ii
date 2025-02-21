'use client';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CalendarProvider from './calendar/CalendarProvider';
import Calendar from './calendar/Calendar';
import { EventFilterParams } from '@/app/(admin)/(staff)/schedules/_hooks/useEvents';
import { Mode } from '@/app/(admin)/(staff)/schedules/_types/CalendarTypes';
import { EventFilters } from './calendar/header/filters/EventFilters';

export default function CalendarAppointments() {
    const [mode, setMode] = useState<Mode>('mes');
    const [date, setDate] = useState<Date>(new Date());
    const [appliedFilters, setAppliedFilters] = useState<EventFilterParams>({
        type: 'CITA',
        status: 'CONFIRMED',
        staffId: undefined,
        branchId: undefined,
        staffScheduleId: undefined,
    });

    const queryClient = useQueryClient();

    const handleFilterChange = (newFilters: Partial<EventFilterParams>) => {
        setAppliedFilters(prev => ({
            ...prev,
            ...newFilters,
            status: 'CONFIRMED'
        }));
    };

    return (
        <div className="flex flex-col h-full">
            <EventFilters
                appliedFilters={appliedFilters}
                onFilterChange={handleFilterChange}
                currentDate={date}
            />
            <CalendarProvider
                setEvents={() => { }}
                mode={mode}
                setMode={setMode}
                date={date}
                setDate={setDate}
                calendarIconIsToday={true}
                filters={appliedFilters}
            >
                <Calendar
                    events={[]}
                    setEvents={() => { }}
                    mode={mode}
                    setMode={setMode}
                    date={date}
                    setDate={setDate}
                />
            </CalendarProvider>
        </div>
    );
}
