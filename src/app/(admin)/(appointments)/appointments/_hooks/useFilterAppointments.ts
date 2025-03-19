import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAppointments, APPOINTMENTS_QUERY_KEY, buildAppointmentsQueryKey } from './useAppointments';
import { AppointmentsFilterType } from '../_interfaces/filter.interface';
import { AppointmentStatus } from '../_interfaces/appointments.interface';
import { useQueryClient } from '@tanstack/react-query';

export const useFilterAppointments = () => {
    // Hooks de estado y referencias - siempre al inicio y en el mismo orden
    const [filterType, setFilterType] = useState<AppointmentsFilterType>(AppointmentsFilterType.ALL);
    const queryClient = useQueryClient();
    const lastForceUpdateRef = useRef<string>('');
    const appliedFilterRef = useRef<string>(null);
    
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
        
        // Construimos la nueva clave de consulta que se generará
        const newQueryKey = buildAppointmentsQueryKey(status, 1, pagination.limit);
        console.log('🔑 Nueva QueryKey que se usará:', newQueryKey);

        // IMPORTANTE: Reseteamos el estado de la última actualización forzada
        // para permitir que se fuerce una actualización para la nueva queryKey
        lastForceUpdateRef.current = '';
        
        // Actualiza el filtro de estado usando la función optimizada en useAppointments
        setStatusFilter(status);
    }, [statusFilter, setFilterType, resetPagination, setStatusFilter, pagination.limit]);

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
        
        // Construimos la nueva clave de consulta que se generará
        const newQueryKey = buildAppointmentsQueryKey("all", 1, pagination.limit);
        console.log('🔑 Nueva QueryKey que se usará:', newQueryKey);

        // IMPORTANTE: Reseteamos el estado de la última actualización forzada
        // para permitir que se fuerce una actualización para la nueva queryKey
        lastForceUpdateRef.current = '';
        
        // Actualiza el filtro de estado a "all"
        setStatusFilter("all");
    }, [statusFilter, setFilterType, resetPagination, setStatusFilter, pagination.limit]);

    // Para debugging - monitorear cuando cambia la queryKey actual
    useEffect(() => {
        console.log('🔄 Query Key actual en useFilterAppointments:', currentQueryKey);
        console.log('🔍 Filtro aplicado en useFilterAppointments:', statusFilter);
        
        // Verificar si tenemos datos en caché para esta queryKey
        const queryData = queryClient.getQueryData(currentQueryKey);
        console.log('🔍 ¿Tenemos datos en caché?', queryData ? 'Sí' : 'No');
        
        // Solo forzar una actualización si:
        // 1. No tenemos datos para esta query
        // 2. Es diferente a la última query que forzamos actualizar
        // 3. No estamos ya en proceso de carga
        if (!queryData && lastForceUpdateRef.current !== currentQueryKeyString && !isLoading) {
            console.log('🔄 Forzando actualización única para:', currentQueryKey);
            // Guardar la queryKey actual para no forzar otra actualización para la misma query
            lastForceUpdateRef.current = currentQueryKeyString;
            
            // Usar un timeout para evitar actualizaciones en el mismo ciclo de renderizado
            const timer = setTimeout(() => {
                // Refrescar la consulta actual
                console.log('♻️ Ejecutando refetchQueries para:', currentQueryKey);
                queryClient.refetchQueries({
                    queryKey: currentQueryKey,
                    exact: true,
                    // Forzar refetch porque realmente necesitamos estos datos
                    refetchType: 'active',
                });
            }, 150);
            
            return () => clearTimeout(timer);
        }
    }, [currentQueryKey, currentQueryKeyString, queryClient, isLoading, statusFilter]);

    // Log adicional para ayudar a diagnosticar problemas
    useEffect(() => {
        if (activeQuery?.data) {
            console.log('✅ Datos en activeQuery:', {
                statusFilter,
                appointments: activeQuery.data.appointments?.length || 0,
                total: activeQuery.data.total || 0,
                queryKey: currentQueryKey
            });
        } else {
            console.log('⚠️ No hay datos en activeQuery para el filtro:', statusFilter);
        }
    }, [activeQuery.data, statusFilter, currentQueryKey]);

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