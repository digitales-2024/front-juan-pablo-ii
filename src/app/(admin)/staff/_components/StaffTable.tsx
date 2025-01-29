"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { Staff } from "../_interfaces/staff.interface";
import { columns } from "./StaffTableColumns";
import { StaffTableToolbarActions } from "./StaffTableToolbarActions";

interface StaffTableProps {
  data: Staff[];
}

export function StaffTable({ data }: StaffTableProps) {
  console.log("🎯 Renderizando StaffTable con data:", data);
  
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre, apellido o DNI..."
      toolbarActions={(table) => <StaffTableToolbarActions table={table} />}
    />
  );
}
