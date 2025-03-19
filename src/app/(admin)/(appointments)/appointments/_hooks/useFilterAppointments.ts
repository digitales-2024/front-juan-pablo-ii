import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAppointments, buildAppointmentsQueryKey } from './useAppointments';
import { AppointmentsFilterType } from '../_interfaces/filter.interface';
import { AppointmentStatus } from '../_interfaces/appointments.interface';
import { useQueryClient } from '@tanstack/react-query';

export const useFilterAppointments = () => {
    // Hooks de estado y referencias - siempre al inicio y en el mismo orden
    const [filterType, setFilterType] = useState<AppointmentsFilterType>(AppointmentsFilterType.ALL);
    const queryClient = useQueryClient();
    const lastForceUpdateRef = useRef<string>('');
    const appliedFilterRef = useRef<string>(null);
    const firstRenderRef = useRef(true);
    
    // Obtener datos del hook de appointments - siempre después de los estados locales
    const {
        appointmentsByStatusQuery,
        statusFilter,
        setStatusFilter,
        pagination,
        setPagination
    } = useAppointments();

    // Definir valores derivados usando useMemo para mantener consistencia
    const currentQueryKey = useMemo(() => 
        buildAppointmentsQueryKey(statusFilter, pagination.page, pagination.limit),
    [statusFilter, pagination.page, pagination.limit]);
    
    const currentQueryKeyString = useMemo(() => 
        JSON.stringify(currentQueryKey),
    [currentQueryKey]);
    
    // Definir el activeQuery como un valor memoizado
    const activeQuery = useMemo(() => appointmentsByStatusQuery, [appointmentsByStatusQuery]);
    
    // Verificar si está cargando con useMemo
    const isLoading = useMemo(() => 
        activeQuery.isLoading || activeQuery.isFetching, 
    [activeQuery.isLoading, activeQuery.isFetching]);
    
    // Función para resetear la paginación - usar useCallback para evitar recrear la función
    const resetPagination = useCallback(() => {
        setPagination({
            page: 1,
            limit: pagination.limit
        });
    }, [setPagination, pagination.limit]);

    // Efecto para invalidar la consulta cuando cambia el filtro o la paginación
    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        
        // Invalidar la consulta para forzar una actualización
        queryClient
            .invalidateQueries({ 
                queryKey: currentQueryKey,
                exact: true
            })
            .catch(() => console.error("Error al invalidar las consultas"));
            
        console.log('🔄 useFilterAppointments - Invalidando consulta para:', currentQueryKey);
    }, [statusFilter, pagination, currentQueryKey, queryClient]);

    // Función para filtrar por estado - usar useCallback para evitar recrear la función
    const setFilterByStatus = useCallback((status: AppointmentStatus) => {
        // Evitar trabajo innecesario si el estado no ha cambiado
        if (status === statusFilter) return;

        // Guardar el filtro aplicado para seguimiento
        appliedFilterRef.current = status;

        // Log para debugging
        console.log('🔶 Cambiando filtro de:', statusFilter, 'a:', status);

        // Actualizar el tipo de filtro para la UI
        if (status === "all") {
            setFilterType(AppointmentsFilterType.ALL);
        } else {
            setFilterType(AppointmentsFilterType.BY_STATUS);
        }

        // Resetear paginación al filtrar
        resetPagination();
        
        // IMPORTANTE: Primero, eliminar TODAS las consultas relacionadas con citas paginadas
        // Esto asegura que no queden datos obsoletos en caché
        console.log('🧹 Eliminando todas las consultas de citas paginadas antes de cambiar filtro');
        queryClient.removeQueries({ 
            queryKey: ["appointments-paginated"],
            exact: false
        });
        
        // Eliminar explícitamente la consulta anterior
        const oldQueryKey = buildAppointmentsQueryKey(statusFilter, pagination.page, pagination.limit);
        queryClient.removeQueries({ 
            queryKey: oldQueryKey,
            exact: true
        });
        
        // Construimos la nueva clave de consulta que se generará
        const newQueryKey = buildAppointmentsQueryKey(status, 1, pagination.limit);
        console.log('🔑 Nueva QueryKey que se usará:', newQueryKey);

        // IMPORTANTE: Reseteamos el estado de la última actualización forzada
        // para permitir que se fuerce una actualización para la nueva queryKey
        lastForceUpdateRef.current = '';
        
        // Actualiza el filtro de estado usando la función optimizada en useAppointments
        setStatusFilter(status);
        
        // Forzar una revalidación después de un corto retraso para dar tiempo
        // a que se actualice el filtro
        setTimeout(() => {
            console.log('⚡ Forzando obtención de datos para el nuevo filtro:', status);
            queryClient.refetchQueries({
                queryKey: newQueryKey,
                exact: true,
                refetchType: 'active'
            });
        }, 100);
    }, [statusFilter, setFilterType, resetPagination, setStatusFilter, pagination.limit, queryClient]);

    // Función para mostrar todas las citas - usar useCallback para evitar recrear la función
    const setFilterAllAppointments = useCallback(() => {
        // Evitar trabajo innecesario si ya estamos en "all"
        if (statusFilter === "all") return;

        // Guardar el filtro aplicado para seguimiento
        appliedFilterRef.current = "all";

        // Log para debugging
        console.log('🔶 Reseteando filtro a "all" desde:', statusFilter);

        setFilterType(AppointmentsFilterType.ALL);
        
        // Resetear paginación al quitar filtro
        resetPagination();
        
        // IMPORTANTE: Primero, eliminar TODAS las consultas relacionadas con citas paginadas
        // Esto asegura que no queden datos obsoletos en caché
        console.log('🧹 Eliminando todas las consultas de citas paginadas antes de cambiar filtro');
        queryClient.removeQueries({ 
            queryKey: ["appointments-paginated"],
            exact: false
        });
        
        // Eliminar explícitamente la consulta anterior
        const oldQueryKey = buildAppointmentsQueryKey(statusFilter, pagination.page, pagination.limit);
        queryClient.removeQueries({ 
            queryKey: oldQueryKey,
            exact: true
        });
        
        // Construimos la nueva clave de consulta que se generará
        const newQueryKey = buildAppointmentsQueryKey("all", 1, pagination.limit);
        console.log('🔑 Nueva QueryKey que se usará:', newQueryKey);

        // IMPORTANTE: Reseteamos el estado de la última actualización forzada
        // para permitir que se fuerce una actualización para la nueva queryKey
        lastForceUpdateRef.current = '';
        
        // Actualiza el filtro de estado a "all"
        setStatusFilter("all");
        
        // Forzar una revalidación después de un corto retraso para dar tiempo
        // a que se actualice el filtro
        setTimeout(() => {
            console.log('⚡ Forzando obtención de datos para el filtro ALL');
            queryClient.refetchQueries({
                queryKey: newQueryKey,
                exact: true,
                refetchType: 'active'
            });
        }, 100);
    }, [statusFilter, setFilterType, resetPagination, setStatusFilter, pagination.limit, queryClient]);

    // Función auxiliar para construir claves de consulta
    const buildQueryKey = useCallback((status: AppointmentStatus, page: number, limit: number) => 
        buildAppointmentsQueryKey(status, page, limit),
    []);

    return {
        filterType,
        setFilterType,
        statusFilter,
        setFilterByStatus,
        setFilterAllAppointments,
        query: activeQuery,
        isLoading,
        pagination,
        setPagination,
        resetPagination,
        currentQueryKey,
        buildQueryKey
    };
}; 