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
    // 1. Hooks básicos de React (useState, useRef)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const lastFilterRef = useRef<string>('');
    const renderedDataRef = useRef<any>(null);
    
    // 2. Hooks personalizados y de terceros
    const queryClient = useQueryClient();
    const { setSelectedAppointmentId, appointmentByIdQuery, statusFilter } = useAppointments();
    const { filterType, query: filterQuery, currentQueryKey } = useFilterAppointments();
    
    // 3. Valores calculados con useMemo
    const isLoading = useMemo(() => 
        filterQuery.isLoading || filterQuery.isFetching, 
    [filterQuery.isLoading, filterQuery.isFetching]);

    const displayData = useMemo(() => {
        if (paginatedData?.appointments?.length) {
            console.log('📊 AppointmentTable - Mostrando', paginatedData.appointments.length, 'citas con estado', statusFilter);
            return paginatedData.appointments;
        }
        
        if (searchQuery.trim() && data.length) {
            return data.filter((appointment) => {
                if (!appointment.patient) return false;
                const patientName = `${appointment.patient.name || ''} ${appointment.patient.lastName || ''}`.toLowerCase();
                return patientName.includes(searchQuery.toLowerCase());
            });
        }
        
        return data;
    }, [paginatedData, data, searchQuery, statusFilter]);

    const totalCount = useMemo(() => 
        paginatedData?.total || displayData.length
    , [paginatedData, displayData]);
    
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
    // Sincroniza el estado con el filtro actual
    useEffect(() => {
        // Actualizar la referencia al último filtro para detectar cambios
        if (statusFilter !== lastFilterRef.current) {
            console.log('🔄 AppointmentTable - Filtro cambió de', lastFilterRef.current, 'a', statusFilter);
            lastFilterRef.current = statusFilter;
            
            if (paginatedData && renderedDataRef.current?.queryKey !== currentQueryKey) {
                console.log('🔄 AppointmentTable - Forzando actualización para nuevo filtro');
                const cachedData = queryClient.getQueryData<any>(currentQueryKey);
                renderedDataRef.current = {
                    data: cachedData || paginatedData,
                    queryKey: currentQueryKey
                };
            }
        }
    }, [statusFilter, paginatedData, currentQueryKey, queryClient]);

    // Actualizar la referencia a los datos renderizados
    useEffect(() => {
        if (paginatedData) {
            console.log('📈 AppointmentTable - Recibiendo nuevos datos:', {
                appointments: paginatedData.appointments?.length || 0,
                total: paginatedData.total || 0,
                filter: statusFilter,
                queryKey: currentQueryKey
            });
            
            renderedDataRef.current = {
                data: paginatedData,
                queryKey: currentQueryKey
            };
        } else {
            console.log('⚠️ AppointmentTable - No hay datos para mostrar');
        }
    }, [paginatedData, statusFilter, currentQueryKey]);

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