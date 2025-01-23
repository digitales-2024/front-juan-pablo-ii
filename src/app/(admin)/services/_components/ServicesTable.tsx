"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { Service } from "../_interfaces/service.interface";
import { columns } from "./ServicesTableColumns";
import { ServicesTableToolbarActions } from "./ServicesTableToolbarActions";

interface ServicesTableProps {
  data: Service[];
}

export function ServicesTable({ data }: ServicesTableProps) {
  console.log("🎯 Renderizando ServicesTable con data:", data);
  
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre o descripción..."
       toolbarActions={(table) => <ServicesTableToolbarActions table={table} />}
    />
  );
} 