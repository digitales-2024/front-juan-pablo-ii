"use client";

import { AppointmentTable } from "./_components/AppointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useFilterAppointments } from "./_hooks/useFilterAppointments";
import { FilterAppointmentsDialog } from "./_components/FilterComponents/FilterAppointmentsDialog";
import { FilterStatusBadge } from "./_components/FilterComponents/FilterStatusBadge";
import { useCallback, useEffect, useRef, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function PageAppointments() {
    // 1. Primero, todos los hooks de react y refs
    const queryClient = useQueryClient();
    const forceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastForceUpdateRef = useRef<string>('');
    const lastFilterRef = useRef<string>('all');
    
    // 2. Hooks personalizados
    const {
        query: activeQuery,
        statusFilter,
        pagination,
        setPagination,
        filterType,
        buildQueryKey,
        currentQueryKey
    } = useFilterAppointments();

    // 3. Valores calculados con useMemo - IMPORTANTE: Todos los useMemo deben definirse ANTES de useCallback
    // Define isLoading y otros valores useMemo primero para mantener la consistencia
    const isLoading = useMemo(() => 
        activeQuery.isLoading || activeQuery.isFetching,
    [activeQuery.isLoading, activeQuery.isFetching]);
    
    const isError = useMemo(() => 
        activeQuery.isError,
    [activeQuery.isError]);
    
    const error = useMemo(() => 
        activeQuery.error,
    [activeQuery.error]);

    // IMPORTANTE: Obtenemos los datos más recientes del caché según la queryKey actual
    const latestData = useMemo(() => {
        // Obtener datos directamente de la caché para la queryKey actual
        const cachedData = queryClient.getQueryData<any>(currentQueryKey);
        
        // Log para depuración
        console.log('🔍 PageAppointments - Comprobando datos:', {
            statusFilter,
            hasCachedData: !!cachedData,
            hasActiveQueryData: !!activeQuery.data,
            queryKey: currentQueryKey
        });
        
        // Si tenemos datos en la caché para la queryKey actual, usar esos
        if (cachedData) {
            console.log('✅ PageAppointments - Usando datos de caché para:', currentQueryKey);
            return cachedData;
        }
        
        // Si tenemos datos en activeQuery y coincide con el filtro actual, usar esos datos
        if (activeQuery.data) {
            console.log('✅ PageAppointments - Usando datos de activeQuery para:', currentQueryKey);
            // Actualizar manualmente la caché con estos datos para asegurar consistencia
            queryClient.setQueryData(currentQueryKey, activeQuery.data);
            return activeQuery.data;
        }
        
        console.log('⚠️ PageAppointments - No hay datos disponibles para:', currentQueryKey);
        return null;
    }, [queryClient, currentQueryKey, activeQuery.data, statusFilter]);
    
    // 4. Funciones memoizadas con useCallback - todas DESPUÉS de los useMemo
    const handlePaginationChange = useCallback((page: number, limit: number) => {
        // Construir la clave de la siguiente página para prefetch
        const nextPageKey = buildQueryKey(statusFilter, page, limit);
        console.log('📄 Cambiando paginación a:', page, limit, 'con queryKey:', nextPageKey);
        
        // Prefetch opcional de la siguiente página
        if (page > pagination.page) {
            const nextNextPageKey = buildQueryKey(statusFilter, page + 1, limit);
            queryClient.prefetchQuery({
                queryKey: nextNextPageKey,
                queryFn: () => Promise.resolve(null), 
                staleTime: 0
            });
        }
        
        // Resetear el estado de forzado para que se pueda forzar una actualización para la nueva página
        lastForceUpdateRef.current = '';
        
        // Actualizar paginación
        setPagination({ page, limit });
    }, [setPagination, statusFilter, pagination.page, buildQueryKey, queryClient]);

    // 5. Efectos secundarios con useEffect - siempre en el mismo orden
    // Para debugging - verificar que estamos usando la query key correcta
    useEffect(() => {
        console.log('📊 PageAppointments - Query Key actual:', currentQueryKey);
        console.log('📊 PageAppointments - Status Filter:', statusFilter);
        console.log('📊 PageAppointments - Hay datos?', activeQuery.data ? 'Sí' : 'No');
        
        // Detectar cambios de filtro para controlar mejor la UI
        if (statusFilter !== lastFilterRef.current) {
            console.log('🔄 Filtro cambió de', lastFilterRef.current, 'a', statusFilter);
            lastFilterRef.current = statusFilter;
            
            // IMPORTANTE: Cuando el filtro cambia, reset el estado de forzado de actualización
            // para permitir que se fuerce una actualización para el nuevo filtro
            lastForceUpdateRef.current = '';
        }
    }, [currentQueryKey, statusFilter, activeQuery.data]);

    // Forzar una actualización si los datos no coinciden con la queryKey actual
    useEffect(() => {
        // Convertir la queryKey a string para poder compararla
        const currentKeyString = JSON.stringify(currentQueryKey);
        
        // Verificar si tenemos datos en caché para esta queryKey
        const cachedData = queryClient.getQueryData(currentQueryKey);
        
        // Solo forzar actualización si:
        // 1. Tenemos un filtro activo
        // 2. No tenemos datos en caché o en el query actual
        // 3. No estamos ya cargando datos
        // 4. No hemos forzado ya una actualización para esta misma queryKey
        if (
            statusFilter && 
            (!activeQuery.data || !cachedData) && 
            !activeQuery.isLoading && 
            !activeQuery.isFetching &&
            lastForceUpdateRef.current !== currentKeyString
        ) {
            console.log('🔄 PageAppointments - Forzando actualización única para:', currentQueryKey);
            
            // Marcar esta queryKey como actualizada
            lastForceUpdateRef.current = currentKeyString;
            
            // Limpiar timeout anterior si existe
            if (forceUpdateTimeoutRef.current) {
                clearTimeout(forceUpdateTimeoutRef.current);
            }
            
            // Usar un timeout para evitar múltiples actualizaciones
            forceUpdateTimeoutRef.current = setTimeout(() => {
                console.log('⚡ PageAppointments - Ejecutando refetchQueries para:', currentQueryKey);
                queryClient.refetchQueries({
                    queryKey: currentQueryKey,
                    exact: true,
                    // Importante: forzar refetch para asegurar los datos más recientes
                    refetchType: 'all'
                });
                forceUpdateTimeoutRef.current = null;
            }, 100);  // Reducimos el tiempo para una respuesta más rápida
        }
        
        // Limpiar el timeout al desmontar
        return () => {
            if (forceUpdateTimeoutRef.current) {
                clearTimeout(forceUpdateTimeoutRef.current);
                forceUpdateTimeoutRef.current = null;
            }
        };
    }, [currentQueryKey, statusFilter, activeQuery.data, activeQuery.isLoading, activeQuery.isFetching, queryClient]);

    // Forzar una actualización de la UI cuando cambie el filtro
    useEffect(() => {
        // Cuando cambia el filtro o los datos, forzar un renderizado
        if (latestData) {
            console.log('📊 PageAppointments - Mostrando datos para filtro:', statusFilter, 'con', latestData.appointments?.length || 0, 'registros');
        }
    }, [latestData, statusFilter]);

    // Forzar una actualización cuando cambia el filtro
    useEffect(() => {
        // Si estamos en el primer render, no hacer nada
        if (lastFilterRef.current === 'all' && statusFilter === 'all') {
            return;
        }
        
        // Detectar cambio de filtro
        if (lastFilterRef.current !== statusFilter) {
            console.log('🔄 PageAppointments - Filtro cambió de', lastFilterRef.current, 'a', statusFilter);
            lastFilterRef.current = statusFilter;
            
            // Asegurarse de que tenemos los datos para el filtro actual
            if (!latestData) {
                console.log('🔄 PageAppointments - Forzando obtención de datos para filtro:', statusFilter);
                queryClient.refetchQueries({
                    queryKey: currentQueryKey,
                    exact: true,
                    refetchType: 'all'
                });
            }
        }
    }, [statusFilter, currentQueryKey, queryClient, latestData]);

    // 6. Lógica de renderizado condicional
    if (isLoading && !activeQuery.data) {
        return (
            <>
                <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
                    <PageHeader
                        title="Citas"
                        description="Administra las citas de tus pacientes"
                    />
                    <div className="flex items-center space-x-2">
                        <FilterAppointmentsDialog />
                    </div>
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <FilterStatusBadge />
                    <div className="flex items-center justify-center p-8 w-full">
                        <Skeleton className="h-8 w-8 animate-spin" />
                        <span className="ml-2 text-lg text-muted-foreground">
                            Cargando citas {statusFilter !== 'all' ? `con estado ${statusFilter}` : ''}...
                        </span>
                    </div>
                </div>
            </>
        );
    }

    if (isError) {
        console.error("💥 Error en la página:", error);
        notFound();
    }

    // Si no hay datos disponibles, mostramos mensaje
    if (!activeQuery.data) {
        console.error("❌ No hay datos disponibles para la query actual:", currentQueryKey);
        // No usar notFound() aquí, puede ser que estemos esperando datos
        return (
            <>
                <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
                    <PageHeader
                        title="Citas"
                        description="Administra las citas de tus pacientes"
                    />
                    <div className="flex items-center space-x-2">
                        <FilterAppointmentsDialog />
                    </div>
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <FilterStatusBadge />
                    <div className="flex items-center justify-center p-8 w-full">
                        <Skeleton className="h-8 w-8 animate-spin" />
                        <span className="ml-2 text-lg text-muted-foreground">
                            Cargando datos filtrados para {statusFilter}...
                        </span>
                    </div>
                </div>
            </>
        );
    }

    // 7. Renderizado principal
    return (
        <>
            <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
                <PageHeader
                    title="Citas"
                    description="Administra las citas de tus pacientes"
                />
                <div className="flex items-center space-x-2">
                    <FilterAppointmentsDialog />
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <FilterStatusBadge />
                <AppointmentTable
                    data={[]} // No usamos data sin paginar en esta vista
                    paginatedData={latestData}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </>
    );
}
