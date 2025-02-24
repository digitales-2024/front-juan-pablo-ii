import { EventFilterParams } from "./useEvents";
import { format } from "date-fns";

export const getEventQueryKey = (filters: EventFilterParams, extendedStart: Date, extendedEnd: Date) => {
    return [
        'calendar-turns',
        {
            ...filters,
            startDate: format(extendedStart, 'yyyy-MM-dd'),
            endDate: format(extendedEnd, 'yyyy-MM-dd'),
            status: 'CONFIRMED'
        }
    ];
} 