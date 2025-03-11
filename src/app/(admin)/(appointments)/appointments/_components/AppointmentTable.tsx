"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./AppointmentTableColumns";
import { AppointmentTableToolbarActions } from "./AppointmentTableToolbarActions";
import { Appointment, PaginatedAppointmentsResponse } from "../_interfaces/appointments.interface";
import { useEffect } from "react";
import { TableState } from "@tanstack/react-table";

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

    const handleTableChange = (_table: any, newState: TableState) => {
        if (onPaginationChange && paginatedData) {
            const { pagination } = newState;
            onPaginationChange(
                pagination.pageIndex + 1,
                pagination.pageSize
            );
        }
    };

    // Determinar qué datos mostrar
    const tableData = paginatedData?.appointments || data;
    const totalCount = paginatedData?.total || tableData.length;

    return (
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
            }}
            onTableChange={handleTableChange}
            totalCount={totalCount}
            manualPagination={!!paginatedData}
        />
    );
}