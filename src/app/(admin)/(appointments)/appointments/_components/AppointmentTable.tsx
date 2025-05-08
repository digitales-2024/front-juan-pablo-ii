"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./AppointmentTableColumns";
import { AppointmentTableToolbarActions } from "./AppointmentTableToolbarActions";
import { Appointment, PaginatedAppointmentsResponse, appointmentStatusConfig } from "../_interfaces/appointments.interface";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { TableState } from "@tanstack/react-table";
import { useAppointments } from "../_hooks/useAppointments";
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog";
import { Input } from "@/components/ui/input";
import { useFilterAppointments } from "../_hooks/useFilterAppointments";
import { AppointmentsFilterType } from "../_interfaces/filter.interface";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface AppointmentTableProps {
    data: Appointment[];
    paginatedData?: PaginatedAppointmentsResponse;
    onPaginationChange?: (page: number, limit: number) => void;
}

export function AppointmentTable({
    data,
    paginatedData,
    onPaginationChange
}: AppointmentTableProps) {
    // Hook de forzar renderizado - utilidad para casos extremos
    const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
    const forceUpdate = useCallback(() => {
        setForceUpdateCounter(prev => prev + 1);
        console.log('🔄 AppointmentTable - Forzando renderizado completo del componente');
    }, []);

    // 1. Hooks básicos de React (useState, useRef)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const lastFilterRef = useRef<string>('');
    const renderedDataRef = useRef<any>(null);
    const forceUpdateRef = useRef<boolean>(false);
    const desyncDetectedRef = useRef<boolean>(false);

    // 2. Hooks personalizados y de terceros
    const queryClient = useQueryClient();
    const { setSelectedAppointmentId, appointmentByIdQuery, statusFilter, appointmentsByStatusQuery } = useAppointments();
    const { filterType, query: filterQuery, currentQueryKey } = useFilterAppointments();

    // Detector de cambios en props para forzar actualización
    useEffect(() => {
        console.log('🔄 AppointmentTable - Props recibidas:', {
            paginatedDataExiste: !!paginatedData,
            dataLength: data?.length || 0,
            paginatedLength: paginatedData?.appointments?.length || 0,
            statusFilter,
            currentQueryKey: JSON.stringify(currentQueryKey),
        });

        // Si recibimos nuevos datos paginados diferentes a los anteriores, marcar para forzar actualización
        if (paginatedData && (!renderedDataRef.current?.paginatedData ||
            renderedDataRef.current?.statusFilter !== statusFilter)) {

            console.log('🔍 AppointmentTable - Detectando cambio en datos paginados o filtro.',
                'Anterior:', renderedDataRef.current?.statusFilter || 'none',
                'Actual:', statusFilter);

            // Guardar referencia al estado actual
            renderedDataRef.current = {
                paginatedData: paginatedData,
                statusFilter: statusFilter,
                queryKey: currentQueryKey
            };

            // Marcar para forzar actualización solo si no estamos en el mismo filtro
            if (lastFilterRef.current !== statusFilter) {
                console.log('⚡ AppointmentTable - Marcando para forzar actualización del componente:', statusFilter);
                forceUpdateRef.current = true;
                lastFilterRef.current = statusFilter;
            }
        }
    }, [paginatedData, data, statusFilter, currentQueryKey]);

    // 3. Valores calculados con useMemo
    const isLoading = useMemo(() =>
        filterQuery.isLoading || filterQuery.isFetching || appointmentsByStatusQuery.isLoading || appointmentsByStatusQuery.isFetching,
        [filterQuery.isLoading, filterQuery.isFetching, appointmentsByStatusQuery.isLoading, appointmentsByStatusQuery.isFetching]);

    const displayData = useMemo(() => {
        console.log('🔍 AppointmentTable - INICIO DEBUG DE RENDERIZADO DE DATOS', {
            isLoading,
            statusFilter,
            currentQueryKey: JSON.stringify(currentQueryKey),
            'paginatedData?': paginatedData ? `✅ (${paginatedData.appointments?.length} citas)` : '❌ No hay datos',
            'filterQuery.data?': filterQuery.data ? `✅ (${filterQuery.data.appointments?.length} citas)` : '❌ No hay datos',
            'appointmentsByStatusQuery.data?': appointmentsByStatusQuery.data ? `✅ (${appointmentsByStatusQuery.data.appointments?.length} citas)` : '❌ No hay datos',
        });

        // Si estamos cargando y no tenemos datos, mostrar vacío
        if (isLoading && !paginatedData?.appointments?.length && !filterQuery.data?.appointments?.length && !appointmentsByStatusQuery.data?.appointments?.length) {
            console.log('⏳ AppointmentTable - Cargando datos, esperando...');
            return [];
        }

        // Verificar si estamos mostrando el filtro correcto
        const filtroDesincronizado = renderedDataRef.current &&
            renderedDataRef.current.filter !== statusFilter &&
            renderedDataRef.current.filter !== "all";

        if (filtroDesincronizado) {
            console.log('⚠️ AppointmentTable - ALERTA DE DESINCRONIZACIÓN - Mostrando datos con filtro',
                renderedDataRef.current?.filter, 'pero el filtro actual es', statusFilter);
        }

        // PRIORIDAD #1: Si estamos usando un filtro específico (distinto de "all"), priorizar datos de appointmentsByStatusQuery
        if (statusFilter !== "all" && appointmentsByStatusQuery.data?.appointments?.length) {
            console.log('📊 AppointmentTable - [FILTRADO] Usando', appointmentsByStatusQuery.data.appointments.length,
                'citas desde appointmentsByStatusQuery con estado', statusFilter, 'con IDs:',
                appointmentsByStatusQuery.data.appointments.slice(0, 3).map((a: Appointment) => a.id).join(', ') + '...');

            // Actualizar referencia
            if (renderedDataRef.current?.filter !== statusFilter) {
                renderedDataRef.current = {
                    ...renderedDataRef.current,
                    filter: statusFilter,
                    queryKey: currentQueryKey
                };
            }

            return appointmentsByStatusQuery.data.appointments;
        }

        // PRIORIDAD #2: Si tenemos datos paginados, usarlos 
        if (paginatedData?.appointments?.length) {
            console.log('📊 AppointmentTable - Mostrando', paginatedData.appointments.length, 'citas desde paginatedData con estado', statusFilter, 'con IDs:',
                paginatedData.appointments.slice(0, 3).map((a: Appointment) => a.id).join(', ') + '...');

            // Actualizar referencia
            if (renderedDataRef.current?.filter !== statusFilter) {
                renderedDataRef.current = {
                    ...renderedDataRef.current,
                    filter: statusFilter,
                    queryKey: currentQueryKey
                };
            }

            return paginatedData.appointments;
        }

        // PRIORIDAD #3: Si tenemos datos en filterQuery, priorizar esos datos
        if (filterQuery.data?.appointments?.length) {
            console.log('📊 AppointmentTable - Usando', filterQuery.data.appointments.length, 'citas desde filterQuery con estado', statusFilter, 'con IDs:',
                filterQuery.data.appointments.slice(0, 3).map((a: Appointment) => a.id).join(', ') + '...');

            // Actualizar referencia
            if (renderedDataRef.current?.filter !== statusFilter) {
                renderedDataRef.current = {
                    ...renderedDataRef.current,
                    filter: statusFilter,
                    queryKey: currentQueryKey
                };
            }

            return filterQuery.data.appointments;
        }

        // PRIORIDAD #4: Si tenemos datos en la caché para la queryKey actual
        const cachedData = queryClient.getQueryData<any>(currentQueryKey);
        if (cachedData?.appointments?.length) {
            console.log('📊 AppointmentTable - Usando', cachedData.appointments.length, 'citas desde caché para:', JSON.stringify(currentQueryKey), 'con IDs:',
                cachedData.appointments.slice(0, 3).map((a: Appointment) => a.id).join(', ') + '...');

            // Actualizar referencia
            if (renderedDataRef.current?.filter !== statusFilter) {
                renderedDataRef.current = {
                    ...renderedDataRef.current,
                    filter: statusFilter,
                    queryKey: currentQueryKey
                };
            }

            return cachedData.appointments;
        }

        // SOLUCIÓN DE EMERGENCIA: Si no tenemos datos para el filtro actual, intentar forzar una actualización
        if (statusFilter !== "all" && !isLoading) {
            console.log('🔥 AppointmentTable - EMERGENCIA: No tenemos datos para el filtro', statusFilter, '- Forzando actualización');

            // Solo forzar refetch si no estamos ya cargando datos
            if (!appointmentsByStatusQuery.isLoading && !appointmentsByStatusQuery.isFetching) {
                // No usar setState aquí para evitar ciclos infinitos
                // En su lugar, programar un refetch asíncrono
                setTimeout(() => {
                    console.log('⏱️ AppointmentTable - Ejecutando refetch programado para', statusFilter);
                    queryClient.refetchQueries({
                        queryKey: currentQueryKey,
                        exact: true,
                        refetchType: 'all'
                    });
                }, 100);
            }
        }

        // Logging de todas las queryKeys en caché para diagnóstico
        console.log('🔑 Todas las queryKeys en caché:', queryClient.getQueryCache().getAll().map(q => JSON.stringify(q.queryKey)));

        // Estrategia 5: Para búsquedas locales (sin paginación)
        if (searchQuery.trim() && data.length) {
            const filteredData = data.filter((appointment) => {
                if (!appointment.patient) return false;
                const patientName = `${appointment.patient.name || ''} ${appointment.patient.lastName || ''}`.toLowerCase();
                return patientName.includes(searchQuery.toLowerCase());
            });
            console.log('🔍 AppointmentTable - Búsqueda local resultó en', filteredData.length, 'citas');
            return filteredData;
        }

        // Estrategia final: Usar los datos sin paginar si están disponibles
        console.log('⚠️ AppointmentTable - Usando datos sin paginar:', data.length);
        return data;
    }, [
        paginatedData,
        filterQuery.data,
        appointmentsByStatusQuery.data,
        data,
        searchQuery,
        statusFilter,
        currentQueryKey,
        queryClient,
        isLoading,
        appointmentsByStatusQuery.isLoading,
        appointmentsByStatusQuery.isFetching
    ]);

    const totalCount = useMemo(() =>
        paginatedData?.total ||
        filterQuery.data?.total ||
        appointmentsByStatusQuery.data?.total ||
        displayData.length
        , [paginatedData, filterQuery.data, appointmentsByStatusQuery.data, displayData]);

    // 4. Funciones de manejo de eventos con useCallback
    const getFilterStatusMessage = useCallback(() => {
        if (isLoading) return "Cargando resultados...";
        if (statusFilter === "all") return "Mostrando todas las citas";
        return `Mostrando citas con estado: ${appointmentStatusConfig[statusFilter]?.name || statusFilter}`;
    }, [isLoading, statusFilter]);

    const handleTableChange = useCallback((_table: any, newState: TableState) => {
        if (onPaginationChange && paginatedData) {
            const { pagination } = newState;
            onPaginationChange(
                pagination.pageIndex + 1,
                pagination.pageSize
            );
        }
    }, [onPaginationChange, paginatedData]);

    const handleRowClick = useCallback((appointment: Appointment) => {
        setSelectedAppointmentId(appointment.id);
        setShowDetailsDialog(true);
    }, [setSelectedAppointmentId]);

    const handleCloseDetails = useCallback(() => {
        setShowDetailsDialog(false);
        setSelectedAppointmentId(null);
    }, [setSelectedAppointmentId]);

    // 5. Efectos con useEffect - siempre en el mismo orden
    // Forzar actualización si es necesario
    useEffect(() => {
        if (forceUpdateRef.current) {
            console.log('🔄 AppointmentTable - Forzando actualización por cambio de datos o filtro:', statusFilter);

            // Limpiar flag
            forceUpdateRef.current = false;

            // Importante: Verificar si tenemos datos y forzar actualización solo si es necesario
            if (!appointmentsByStatusQuery.data || !appointmentsByStatusQuery.data.appointments?.length) {
                console.log('⚡ AppointmentTable - Forzando refetch para obtener datos actualizados');
                queryClient.refetchQueries({
                    queryKey: currentQueryKey,
                    exact: true,
                    refetchType: 'all'
                });
            } else {
                console.log('✅ AppointmentTable - Ya tenemos',
                    appointmentsByStatusQuery.data.appointments.length,
                    'citas para el filtro', statusFilter);
            }
        }
    }, [statusFilter, forceUpdateRef, appointmentsByStatusQuery.data, queryClient, currentQueryKey]);

    // Sincroniza el estado con el filtro actual
    useEffect(() => {
        // Actualizar la referencia al último filtro para detectar cambios
        if (statusFilter !== lastFilterRef.current) {
            console.log('🔄 AppointmentTable - Filtro cambió de', lastFilterRef.current, 'a', statusFilter);
            lastFilterRef.current = statusFilter;

            // Forzar una actualización de los datos cuando cambia el filtro
            console.log('🔄 AppointmentTable - Forzando actualización para el filtro:', statusFilter);
            queryClient.refetchQueries({
                queryKey: currentQueryKey,
                exact: true,
                refetchType: 'all'
            });

            // Guardar la referencia al query key actual
            renderedDataRef.current = {
                queryKey: currentQueryKey,
                filter: statusFilter
            };
        }
    }, [statusFilter, currentQueryKey, queryClient]);

    // NUEVO: Monitor de cambios en statusFilter y datos
    useEffect(() => {
        console.log('👀 AppointmentTable - Monitor de cambios detectado. Estado actual:', {
            statusFilter,
            displayDataLength: displayData.length,
            renderedWith: renderedDataRef.current?.filter || 'none',
            currentQueryKey: JSON.stringify(currentQueryKey)
        });

        // Si el filtro ha cambiado pero displayData sigue mostrando datos antiguos...
        if (statusFilter !== renderedDataRef.current?.filter && displayData.length > 0) {
            console.log('⚠️ AppointmentTable - ALERTA: Posible desincronización. Mostrando datos con filtro',
                renderedDataRef.current?.filter, 'pero el filtro actual es', statusFilter);

            // Podríamos forzar una actualización de estado aquí si fuera necesario
            // Intentamos forzar un refresco para corregir
            queryClient.refetchQueries({
                queryKey: currentQueryKey,
                exact: true,
                refetchType: 'all'
            }).then(() => {
                console.log('🔄 AppointmentTable - Refresco forzado por desincronización completado');

                // Actualizar referencia al filtro actual
                renderedDataRef.current = {
                    queryKey: currentQueryKey,
                    filter: statusFilter
                };
            });
        }
    }, [statusFilter, displayData, currentQueryKey, queryClient]);

    // Debugging: Monitorear las fuentes de datos disponibles
    useEffect(() => {
        console.log('👀 AppointmentTable - Estado actual de datos:', {
            paginatedData: paginatedData ? `${paginatedData.appointments?.length || 0} citas` : 'No disponible',
            filterQueryData: filterQuery.data ? `${filterQuery.data.appointments?.length || 0} citas` : 'No disponible',
            statusQueryData: appointmentsByStatusQuery.data ? `${appointmentsByStatusQuery.data.appointments?.length || 0} citas` : 'No disponible',
            displayData: `${displayData.length} citas`,
            statusFilter,
            isLoading
        });
    }, [paginatedData, filterQuery.data, appointmentsByStatusQuery.data, displayData, statusFilter, isLoading]);

    // NUEVO: Detector de desincronización extrema - último recurso
    useEffect(() => {
        // No hacer nada en el primer render
        if (forceUpdateCounter === 0) return;

        // Verificar si hay una desincronización grave
        const desyncDetected =
            statusFilter !== renderedDataRef.current?.filter &&
            displayData.length > 0 &&
            !isLoading;

        if (desyncDetected && !desyncDetectedRef.current) {
            console.log('🚨 AppointmentTable - DESINCRONIZACIÓN GRAVE DETECTADA');
            console.log('Filtro actual:', statusFilter);
            console.log('Filtro de los datos mostrados:', renderedDataRef.current?.filter);
            console.log('Datos mostrados:', displayData.length, 'citas');

            // Marcar que ya detectamos la desincronización para no repetir
            desyncDetectedRef.current = true;

            // Esperar un poco y forzar una actualización
            setTimeout(() => {
                console.log('🚨 AppointmentTable - Intentando corregir desincronización grave');

                // 1. Forzar refetch de datos
                queryClient.refetchQueries({
                    queryKey: currentQueryKey,
                    exact: true,
                    refetchType: 'all'
                }).then(() => {
                    // 2. Actualizar la referencia para prevenir más desincronizaciones
                    renderedDataRef.current = {
                        filter: statusFilter,
                        queryKey: currentQueryKey,
                        timestamp: Date.now()
                    };

                    // 3. Resetear el flag de desincronización
                    desyncDetectedRef.current = false;

                    // 4. Forzar un nuevo renderizado si necesario
                    console.log('🔁 AppointmentTable - Forzando nuevo renderizado post-corrección');
                    forceUpdate();
                });
            }, 500);
        }
    }, [forceUpdateCounter, statusFilter, displayData, isLoading, currentQueryKey, queryClient, forceUpdate]);

    // Monitorear cambios en filtro para detectar potenciales desincronizaciones
    useEffect(() => {
        // Si el filtro cambia, programar una verificación de desincronización
        if (lastFilterRef.current !== statusFilter && lastFilterRef.current !== '') {
            console.log('👀 AppointmentTable - Filtro cambió, programando verificación de desincronización');

            // Limpiar cualquier estado de desincronización anterior
            desyncDetectedRef.current = false;

            // Programar una verificación después de que el componente se haya actualizado
            setTimeout(() => {
                // Verificar si los datos mostrados coinciden con el filtro actual
                const actualFilter = renderedDataRef.current?.filter;

                if (actualFilter !== statusFilter && !isLoading) {
                    console.log('⚠️ AppointmentTable - Posible desincronización después del cambio de filtro');
                    console.log('Esperaba:', statusFilter, 'Actual:', actualFilter);

                    // Forzar actualización para intentar corregir
                    forceUpdate();
                }
            }, 300);
        }

        // Actualizar la referencia
        lastFilterRef.current = statusFilter;
    }, [statusFilter, isLoading, forceUpdate]);

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                    {!paginatedData && (
                        <Input
                            placeholder="Buscar por nombre..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            className="max-w-sm"
                        />
                    )}
                    <p className="text-sm text-muted-foreground my-auto">
                        {getFilterStatusMessage()}
                    </p>
                </div>
            </div>

            <AppointmentDetailsDialog
                appointment={appointmentByIdQuery.data || null}
                loading={appointmentByIdQuery.isLoading}
                open={showDetailsDialog}
                onOpenChange={setShowDetailsDialog}
                onClose={handleCloseDetails}
            />

            {isLoading ? (
                <div className="flex items-center justify-center p-8 w-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg text-muted-foreground">
                        Cargando citas {statusFilter !== 'all' ? `con estado ${statusFilter}` : ''}...
                    </span>
                </div>
            ) : displayData && displayData.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={displayData}
                    placeholder="Buscar por fecha, paciente o estado..."
                    toolbarActions={(table) => <AppointmentTableToolbarActions table={table} />}
                    columnVisibilityConfig={{
                        id: false,
                        eventId: false,
                        staffId: false,
                        serviceId: false,
                        branchId: false,
                        patientId: false,
                        isActive: false,
                        rescheduledFromId: false,
                        cancellationReason: false,
                        createdAt: false,
                        updatedAt: false,
                    }}
                    onTableChange={handleTableChange}
                    totalCount={totalCount}
                    manualPagination={!!paginatedData}
                    onRowClick={handleRowClick}
                    key={`table-${statusFilter}`}
                />
            ) : (
                <div className="flex flex-col items-center justify-center p-8 w-full bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xl font-medium text-gray-600 mb-2">No hay citas disponibles</p>
                    <p className="text-sm text-gray-500">
                        {statusFilter === "all"
                            ? "No se encontraron citas médicas en el sistema."
                            : `No hay citas con estado "${appointmentStatusConfig[statusFilter]?.name || statusFilter}".`}
                    </p>
                </div>
            )}
        </div>
    );
}