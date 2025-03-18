"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./AppointmentTableColumns";
import { AppointmentTableToolbarActions } from "./AppointmentTableToolbarActions";
import { Appointment, PaginatedAppointmentsResponse } from "../_interfaces/appointments.interface";
import { useState, useMemo } from "react";
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
    console.log("🎯 Datos paginados:", paginatedData);

    const { setSelectedAppointmentId, appointmentByIdQuery } = useAppointments();
    const { filterType, query: filterQuery } = useFilterAppointments();
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleTableChange = (_table: any, newState: TableState) => {
        if (onPaginationChange && paginatedData) {
            const { pagination } = newState;
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
    const totalCount = paginatedData?.total || tableData.length;

    // Verificar si está cargando datos filtrados
    const isLoading = filterType === AppointmentsFilterType.BY_STATUS && filterQuery.isLoading;

    // Usar los datos filtrados o los originales
    const displayData = searchQuery.trim() ? filteredData : tableData;

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
            ) : (
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
            )}
        </div>
    );
}