"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { Appointment } from "../_interfaces/appointments.interface";
import { columns } from "./AppointmentTableColumns";
import { AppointmentTableToolbarActions } from "./AppointmentTableToolbarActions";

interface AppointmentTableProps {
    data: Appointment[];
}

export function AppointmentTable({ data }: AppointmentTableProps) {
    console.log("🎯 Renderizando AppointmentTable con data:", data);

    return (
        <DataTable
            columns={columns}
            data={data}
            placeholder="Buscar por fecha, paciente o estado..."
            toolbarActions={(table) => <AppointmentTableToolbarActions table={table} />}
        />
    );
} 