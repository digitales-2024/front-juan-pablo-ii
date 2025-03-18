"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./AppointmentTableColumns";
import { AppointmentTableToolbarActions } from "./AppointmentTableToolbarActions";
import { Appointment, PaginatedAppointmentsResponse, appointmentStatusConfig } from "../_interfaces/appointments.interface";
import { useState, useMemo, useEffect } from "react";
import { TableState } from "@tanstack/react-table";
import { useAppointments } from "../_hooks/useAppointments";
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog";
import { Input } from "@/components/ui/input";
import { useFilterAppointments } from "../_hooks/useFilterAppointments";
import { AppointmentsFilterType } from "../_interfaces/filter.interface";
import { Loader2 } from "lucide-react";

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
    console.log("🎯 Renderizando AppointmentTable con data:", data);
    console.log("🎯 Datos paginados recibidos:", paginatedData);
    console.log("🎯 Datos paginados - appointments:", paginatedData?.appointments);
    console.log("🎯 Datos paginados - total:", paginatedData?.total);

    const { setSelectedAppointmentId, appointmentByIdQuery, statusFilter } = useAppointments();
    const { filterType, query: filterQuery } = useFilterAppointments();
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Log cada vez que cambian los datos paginados
    useEffect(() => {
        console.log("⚡ [useEffect] paginatedData cambió:", paginatedData);
        console.log("⚡ [useEffect] StatusFilter actual:", statusFilter);
        console.log("⚡ [useEffect] FilterType actual:", filterType);
    }, [paginatedData, statusFilter, filterType]);

    const handleTableChange = (_table: any, newState: TableState) => {
        if (onPaginationChange && paginatedData) {
            const { pagination } = newState;
            console.log("🔄 Cambiando paginación en la tabla:", pagination);
            onPaginationChange(
                pagination.pageIndex + 1,
                pagination.pageSize
            );
        }
    };

    const handleRowClick = (appointment: Appointment) => {
        setSelectedAppointmentId(appointment.id);
        setShowDetailsDialog(true);
    };

    const handleCloseDetails = () => {
        setShowDetailsDialog(false);
        setSelectedAppointmentId(null);
    };

    // Filtrar datos por nombre del paciente
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return data;

        return data.filter((appointment) => {
            // Verificar si patient existe antes de acceder a sus propiedades
            if (!appointment.patient) return false;

            const patientName = `${appointment.patient.name || ''} ${appointment.patient.lastName || ''}`.toLowerCase();
            return patientName.includes(searchQuery.toLowerCase());
        });
    }, [data, searchQuery]);

    // Determinar qué datos mostrar según el filtro activo
    const tableData = paginatedData?.appointments || data;
    console.log("📊 TableData a mostrar:", tableData);
    const totalCount = paginatedData?.total || tableData.length;

    // Verificar si está cargando datos filtrados
    const isLoading = filterQuery.isLoading;
    console.log("⏳ IsLoading:", isLoading);
    console.log("🔍 FilterQuery estado:", {
        isLoading: filterQuery.isLoading,
        isError: filterQuery.isError,
        data: filterQuery.data
    });

    // Usar los datos filtrados o los originales
    const displayData = searchQuery.trim() ? filteredData : tableData;
    console.log("👁️ DisplayData final:", displayData);
    console.log("👁️ Cantidad de registros a mostrar:", displayData?.length || 0);

    // Mensaje que muestra el estado del filtro actual
    const getFilterStatusMessage = () => {
        if (isLoading) return "Cargando resultados...";
        if (statusFilter === "all") return "Mostrando todas las citas";
        return `Mostrando citas con estado: ${statusFilter}`;
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                    <Input
                        placeholder="Buscar por nombre..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        className="max-w-sm"
                    />
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
                    <span className="ml-2 text-lg text-muted-foreground">Cargando resultados filtrados...</span>
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
                        // La columna patientDni estará visible por defecto al no incluirla aquí
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