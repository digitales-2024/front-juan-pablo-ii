import { useState } from 'react';
import { useAppointments } from './useAppointments';
import { AppointmentsFilterType } from '../_interfaces/filter.interface';
import { AppointmentStatus } from '../_interfaces/appointments.interface';

export const useFilterAppointments = () => {
    const [filterType, setFilterType] = useState<AppointmentsFilterType>(AppointmentsFilterType.ALL);
    const {
        appointmentsQuery,
        paginatedAppointmentsQuery,
        appointmentsByStatusQuery,
        statusFilter,
        setStatusFilter,
        pagination,
        setPagination
    } = useAppointments();

    // Función para resetear la paginación
    const resetPagination = () => {
        setPagination({
            page: 1,
            limit: pagination.limit
        });
    };

    // Función para filtrar por estado
    const setFilterByStatus = (status: AppointmentStatus) => {
        setFilterType(AppointmentsFilterType.BY_STATUS);
        setStatusFilter(status);
        resetPagination(); // Resetear paginación al filtrar
    };

    // Función para mostrar todas las citas
    const setFilterAllAppointments = () => {
        setFilterType(AppointmentsFilterType.ALL);
        setStatusFilter(null);
        resetPagination(); // Resetear paginación al quitar filtro
    };

    // Determinar la query activa según el tipo de filtro
    const getActiveQuery = () => {
        switch (filterType) {
            case AppointmentsFilterType.BY_STATUS:
                return appointmentsByStatusQuery;
            case AppointmentsFilterType.ALL:
            default:
                return paginatedAppointmentsQuery;
        }
    };

    const activeQuery = getActiveQuery();

    return {
        filterType,
        setFilterType,
        statusFilter,
        setFilterByStatus,
        setFilterAllAppointments,
        query: activeQuery,
        isLoading: activeQuery.isLoading,
        pagination,
        setPagination,
        resetPagination
    };
}; 