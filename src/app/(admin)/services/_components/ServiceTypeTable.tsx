"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { ServiceType } from "../_interfaces/service-type.interface";
import { columns } from "./ServiceTypeTableColumns";
import { ServiceTypeTableToolbarActions } from "./ServiceTypeTableToolbarActions";

interface ServiceTypeTableProps {
  data: ServiceType[];
}

export function ServiceTypeTable({ data }: ServiceTypeTableProps) {
  console.log("🎯 Renderizando ServiceTypeTable con data:", data);
  
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre..."
      toolbarActions={(table) => <ServiceTypeTableToolbarActions table={table} />}
    />
  );
} 