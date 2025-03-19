"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./AppointmentTableColumns";
import { AppointmentTableToolbarActions } from "./AppointmentTableToolbarActions";
import { Appointment, PaginatedAppointmentsResponse, appointmentStatusConfig } from "../_interfaces/appointments.interface";
import { useState, useMemo, useEffect, useCallback } from "react";
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
    console.log("🎯 Renderizando AppointmentTable");

    const { setSelectedAppointmentId, appointmentByIdQuery, statusFilter } = useAppointments();
    const { filterType, query: filterQuery } = useFilterAppointments();
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleTableChange = useCallback((_table: any, newState: TableState) => {
        if (onPaginationChange && paginatedData) {
            const { pagination } = newState;
            console.log("🔄 Cambiando paginación en la tabla:", pagination);
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

    const filteredData = useMemo(() => {
        if (paginatedData || !searchQuery.trim()) return data;

        return data.filter((appointment) => {
            if (!appointment.patient) return false;

            const patientName = `${appointment.patient.name || ''} ${appointment.patient.lastName || ''}`.toLowerCase();
            return patientName.includes(searchQuery.toLowerCase());
        });
    }, [data, searchQuery, paginatedData]);

    const displayData = useMemo(() => {
        if (paginatedData) {
            return paginatedData.appointments || [];
        }
        return searchQuery.trim() ? filteredData : data;
    }, [paginatedData, searchQuery, filteredData, data]);

    const totalCount = useMemo(() => 
        paginatedData?.total || displayData.length
    , [paginatedData, displayData]);

    const isLoading = filterQuery.isLoading;

    const getFilterStatusMessage = useCallback(() => {
        if (isLoading) return "Cargando resultados...";
        if (statusFilter === "all") return "Mostrando todas las citas";
        return `Mostrando citas con estado: ${appointmentStatusConfig[statusFilter]?.name || statusFilter}`;
    }, [isLoading, statusFilter]);

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
                    <span className="ml-2 text-lg text-muted-foreground">Cargando resultados...</span>
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