"use client";

import { AppointmentTable } from "./_components/AppointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useFilterAppointments } from "./_hooks/useFilterAppointments";
import { FilterAppointmentsDialog } from "./_components/FilterComponents/FilterAppointmentsDialog";
import { FilterStatusBadge } from "./_components/FilterComponents/FilterStatusBadge";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function PageAppointments() {
    // Hook para forzar renderizado - último recurso
    const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
    const forceUpdate = useCallback(() => {
        setForceUpdateCounter(prev => prev + 1);
        console.log('🔄 PageAppointments - Forzando renderizado completo');
    }, []);

    // 1. Primero, todos los hooks de react y refs
    const queryClient = useQueryClient();
    const forceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastForceUpdateRef = useRef<string>('');
    const lastFilterRef = useRef<string>('all');
    const syncStatusRef = useRef<{
        lastKnownFilter: string;
        dataFilter: string | null;
        needsSync: boolean;
    }>({
        lastKnownFilter: 'all',
        dataFilter: null,
        needsSync: false
    });

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

    // IMPORTANTE: Obtenemos los datos más recientes según la queryKey actual
    const latestData = useMemo(() => {
        // Verificamos si estamos filtrando y tenemos datos en activeQuery
        console.log('🔍 PageAppointments - Comprobando datos para filtro:', statusFilter, 'con queryKey:', JSON.stringify(currentQueryKey));

        // Primero, intentar usar directamente los datos del activeQuery (más recientes)
        if (activeQuery.data) {
            console.log('✅ PageAppointments - Usando datos de activeQuery para filtro:', statusFilter, 'con',
                activeQuery.data.appointments?.length || 0, 'citas',
                'algunos IDs:', activeQuery.data.appointments?.slice(0, 3).map((a: any) => a.id).join(', ') || 'N/A');
            return activeQuery.data;
        }

        // Si no hay datos en activeQuery, intentar obtenerlos de la caché
        const cachedData = queryClient.getQueryData<any>(currentQueryKey);
        if (cachedData) {
            console.log('✅ PageAppointments - Usando datos de caché para:', JSON.stringify(currentQueryKey), 'con',
                cachedData.appointments?.length || 0, 'citas',
                'algunos IDs:', cachedData.appointments?.slice(0, 3).map((a: any) => a.id).join(', ') || 'N/A');
            return cachedData;
        }

        // Intentemos consultar todas las claves en caché para depuración
        console.log('🔍 PageAppointments - Explorando la caché para encontrar datos:',
            queryClient.getQueryCache().getAll().map(q => JSON.stringify(q.queryKey)));

        console.log('⚠️ PageAppointments - No hay datos disponibles para filtro:', statusFilter);
        return null;
    }, [activeQuery.data, statusFilter, queryClient, currentQueryKey]);

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
                console.log('🔄 PageAppointments - Forzando obtención de datos para filtro:', statusFilter,
                    'activeQuery.data existe?', activeQuery.data ? 'Sí' : 'No',
                    'activeQuery.isFetching?', activeQuery.isFetching ? 'Sí' : 'No');

                queryClient.refetchQueries({
                    queryKey: currentQueryKey,
                    exact: true,
                    refetchType: 'all'
                }).then(() => {
                    console.log('✅ PageAppointments - Refresco forzado completado para:', JSON.stringify(currentQueryKey));
                    // Verificar si ahora tenemos datos
                    const updatedData = queryClient.getQueryData<any>(currentQueryKey);
                    console.log('Estado post-refresco:', updatedData ?
                        `Tenemos ${updatedData.appointments?.length || 0} citas` :
                        'Aún sin datos');
                });
            }
        }
    }, [statusFilter, currentQueryKey, queryClient, latestData, activeQuery.data, activeQuery.isFetching]);

    // Detector de desincronización extrema entre filtro y datos
    useEffect(() => {
        // Verificar si hay desincronización entre el filtro aplicado y los datos mostrados
        if (latestData && latestData.appointments?.length > 0) {
            // Guardar referencia del filtro actual para verificación
            syncStatusRef.current.lastKnownFilter = statusFilter;

            // Intenta determinar el filtro real de los datos
            let dataFilter = 'all'; // Valor por defecto

            // Si hay datos pero con filtro diferente...
            if (activeQuery.data && activeQuery.data !== latestData) {
                console.log('⚠️ PageAppointments - Posible desincronización: activeQuery.data ≠ latestData');
            }

            syncStatusRef.current.dataFilter = dataFilter;

            // Verificar desincronización: filtro aplicado vs datos mostrados
            if (dataFilter !== 'all' && dataFilter !== statusFilter) {
                console.log('🚨 PageAppointments - POSIBLE DESINCRONIZACIÓN DETECTADA:');
                console.log('Filtro aplicado:', statusFilter);
                console.log('Filtro de los datos:', dataFilter);

                // Marcar para sincronización
                syncStatusRef.current.needsSync = true;

                // Programar comprobación posterior
                setTimeout(() => {
                    // Si aún necesita sincronización...
                    if (syncStatusRef.current.needsSync) {
                        console.log('🔄 PageAppointments - Ejecutando sincronización forzada');

                        // Intentar obtener datos actualizados
                        queryClient.refetchQueries({
                            queryKey: currentQueryKey,
                            exact: true,
                            refetchType: 'all'
                        }).then(() => {
                            // Verificar si ayudó
                            const freshData = queryClient.getQueryData<any>(currentQueryKey);
                            if (freshData) {
                                console.log('✅ PageAppointments - Sincronización exitosa:',
                                    freshData.appointments?.length || 0, 'citas obtenidas');
                                syncStatusRef.current.needsSync = false;

                                // Forzar renderizado para aplicar cambios
                                forceUpdate();
                            } else {
                                console.log('❌ PageAppointments - Sincronización fallida, sin datos');
                            }
                        });
                    }
                }, 500);
            } else {
                // Todo sincronizado
                syncStatusRef.current.needsSync = false;
            }
        }
    }, [latestData, statusFilter, activeQuery.data, currentQueryKey, queryClient, forceUpdate]);

    // Monitorear explícitamente el contador de forzado para detectar cambios
    useEffect(() => {
        if (forceUpdateCounter > 0) {
            console.log('👁️ PageAppointments - Renderizado forzado #', forceUpdateCounter);

            // Verificar estado de datos tras forzado
            const currentData = queryClient.getQueryData<any>(currentQueryKey);
            console.log('Estado de datos post-forzado:', currentData ?
                `Hay ${currentData.appointments?.length || 0} citas` :
                'Sin datos en caché');

            // Si no hay datos, intentar obtenerlos
            if (!currentData && !activeQuery.isLoading) {
                console.log('🔍 PageAppointments - Sin datos post-forzado, intentando obtenerlos');
                queryClient.refetchQueries({
                    queryKey: currentQueryKey,
                    exact: true,
                    refetchType: 'all'
                });
            }
        }
    }, [forceUpdateCounter, currentQueryKey, queryClient, activeQuery.isLoading]);

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
