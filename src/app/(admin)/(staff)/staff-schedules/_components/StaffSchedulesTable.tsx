"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { StaffSchedule } from "../_interfaces/staff-schedules.interface";
import { StaffSchedulesTableToolbarActions } from "./StaffSchedulesTableToolbarActions";
import { columns } from "./StaffSchedulesTableColumns";
import { useStaffSchedules } from "../_hooks/useStaffSchedules";

interface StaffSchedulesTableProps {
  data: StaffSchedule[];
}

export function StaffSchedulesTable({ data }: StaffSchedulesTableProps) {
  useStaffSchedules({});

  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre del personal..."
      toolbarActions={(table) => <StaffSchedulesTableToolbarActions table={table} />}
    />
  );
}