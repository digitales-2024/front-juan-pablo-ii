import { useState } from 'react';
import { useAppointments, APPOINTMENTS_QUERY_KEY } from './useAppointments';
import { AppointmentsFilterType } from '../_interfaces/filter.interface';
import { AppointmentStatus } from '../_interfaces/appointments.interface';

export const useFilterAppointments = () => {
    const [filterType, setFilterType] = useState<AppointmentsFilterType>(AppointmentsFilterType.ALL);
    
    const {
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
        if (status === "all") {
            setFilterType(AppointmentsFilterType.ALL);
        } else {
            setFilterType(AppointmentsFilterType.BY_STATUS);
        }

        // Resetear paginación al filtrar (antes de cambiar el filtro)
        resetPagination();
        
        // Actualiza el filtro de estado en useAppointments
        // Esto provocará que se invalide la query a través del efecto en useAppointments
        setStatusFilter(status);
    };

    // Función para mostrar todas las citas
    const setFilterAllAppointments = () => {
        setFilterType(AppointmentsFilterType.ALL);
        
        // Resetear paginación al quitar filtro (antes de cambiar el filtro)
        resetPagination();
        
        // Actualiza el filtro de estado en useAppointments
        // Esto provocará que se invalide la query a través del efecto en useAppointments
        setStatusFilter("all");
    };

    // Usamos la query definida en useAppointments
    const activeQuery = appointmentsByStatusQuery;

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