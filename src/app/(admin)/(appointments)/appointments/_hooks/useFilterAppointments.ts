import { useState, useCallback } from 'react';
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

    // Función para resetear la paginación - usar useCallback para evitar recrear la función
    const resetPagination = useCallback(() => {
        setPagination({
            page: 1,
            limit: pagination.limit
        });
    }, [setPagination, pagination.limit]);

    // Función para filtrar por estado - usar useCallback para evitar recrear la función
    const setFilterByStatus = useCallback((status: AppointmentStatus) => {
        // Evitar trabajo innecesario si el estado no ha cambiado
        if (status === statusFilter) return;

        if (status === "all") {
            setFilterType(AppointmentsFilterType.ALL);
        } else {
            setFilterType(AppointmentsFilterType.BY_STATUS);
        }

        // Resetear paginación al filtrar (antes de cambiar el filtro)
        resetPagination();
        
        // Actualiza el filtro de estado en useAppointments
        setStatusFilter(status);
    }, [statusFilter, setFilterType, resetPagination, setStatusFilter]);

    // Función para mostrar todas las citas - usar useCallback para evitar recrear la función
    const setFilterAllAppointments = useCallback(() => {
        // Evitar trabajo innecesario si ya estamos en "all"
        if (statusFilter === "all") return;

        setFilterType(AppointmentsFilterType.ALL);
        
        // Resetear paginación al quitar filtro (antes de cambiar el filtro)
        resetPagination();
        
        // Actualiza el filtro de estado en useAppointments
        setStatusFilter("all");
    }, [statusFilter, setFilterType, resetPagination, setStatusFilter]);

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