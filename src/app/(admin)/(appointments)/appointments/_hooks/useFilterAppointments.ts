import { useState, useEffect } from 'react';
import { useAppointments } from './useAppointments';
import { AppointmentsFilterType } from '../_interfaces/filter.interface';
import { AppointmentStatus } from '../_interfaces/appointments.interface';

export const useFilterAppointments = () => {
    console.log("🔧 Inicializando useFilterAppointments");

    const [filterType, setFilterType] = useState<AppointmentsFilterType>(AppointmentsFilterType.ALL);
    const {
        appointmentsByStatusQuery,
        statusFilter,
        setStatusFilter,
        pagination,
        setPagination
    } = useAppointments();

    // Log cuando cambian los valores importantes
    useEffect(() => {
        console.log("🔧 [useFilterAppointments] filterType cambió:", filterType);
        console.log("🔧 [useFilterAppointments] statusFilter actual:", statusFilter);
    }, [filterType, statusFilter]);

    // Función para resetear la paginación
    const resetPagination = () => {
        console.log("🔧 Reseteando paginación a página 1");
        setPagination({
            page: 1,
            limit: pagination.limit
        });
    };

    // Función para filtrar por estado
    const setFilterByStatus = (status: AppointmentStatus) => {
        console.log("🔧 Estableciendo filtro por estado:", status);

        if (status === "all") {
            console.log("🔧 Estado es 'all', estableciendo tipo de filtro a ALL");
            setFilterType(AppointmentsFilterType.ALL);
        } else {
            console.log("🔧 Estado específico, estableciendo tipo de filtro a BY_STATUS");
            setFilterType(AppointmentsFilterType.BY_STATUS);
        }

        setStatusFilter(status);
        resetPagination(); // Resetear paginación al filtrar
    };

    // Función para mostrar todas las citas
    const setFilterAllAppointments = () => {
        console.log("🔧 Estableciendo filtro para mostrar todas las citas");
        setFilterType(AppointmentsFilterType.ALL);
        setStatusFilter("all");
        resetPagination(); // Resetear paginación al quitar filtro
    };

    // Siempre usamos la query filtrada por estado, que incluye "all" para todas las citas
    const activeQuery = appointmentsByStatusQuery;

    // Log del estado actual del query
    console.log("🔧 Estado actual de activeQuery en useFilterAppointments:", {
        isLoading: activeQuery.isLoading,
        isError: activeQuery.isError,
        dataLength: activeQuery.data?.appointments?.length || 0,
        filterType,
        statusFilter
    });

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