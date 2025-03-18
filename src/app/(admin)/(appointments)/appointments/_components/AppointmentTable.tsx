"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./AppointmentTableColumns";
import { AppointmentTableToolbarActions } from "./AppointmentTableToolbarActions";
import { Appointment, PaginatedAppointmentsResponse } from "../_interfaces/appointments.interface";
import { useEffect, useState } from "react";
import { TableState } from "@tanstack/react-table";
import { useAppointments } from "../_hooks/useAppointments";
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog";
import { Info } from "lucide-react";

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
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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

    // Determinar qué datos mostrar
    const tableData = paginatedData?.appointments || data;
    const totalCount = paginatedData?.total || tableData.length;

    return (
        <>

            <AppointmentDetailsDialog
                appointment={appointmentByIdQuery.data || null}
                loading={appointmentByIdQuery.isLoading}
                open={showDetailsDialog}
                onOpenChange={setShowDetailsDialog}
                onClose={handleCloseDetails}
            />
            <DataTable
                columns={columns}
                data={tableData}
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
        </>
    );
}