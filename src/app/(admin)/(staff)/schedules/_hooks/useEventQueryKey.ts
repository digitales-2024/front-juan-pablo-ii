import { EventFilterParams } from "./useEvents";

export const getEventQueryKey = (filters: EventFilterParams, date: Date) => {
    // Calcular inicio y fin del mes en UTC
    const utcMonthStart = new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            1
        )
    ).toISOString().split('T')[0];

    const utcMonthEnd = new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth() + 1,
            0
        )
    ).toISOString().split('T')[0];

    return [
        'events',
        {
            ...filters,
            status: filters.status ?? 'CONFIRMED',
            startDate: utcMonthStart,
            endDate: utcMonthEnd
        }
    ];
} 