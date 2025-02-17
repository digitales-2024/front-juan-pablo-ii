"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./HistoryTableColumns";
import { HistoryTableToolbarActions } from "./HistoryTableToolbarActions";
import { MedicalHistory } from "../_interfaces/history.interface";

interface HistoryTableProps {
  data: MedicalHistory[];
}

export function HistoryTable({ data }: HistoryTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <HistoryTableToolbarActions table={table} />}
      columnVisibilityConfig={{
        id: true,
        patientId: true,
        medicalHistory: false,
        description: true,
        isActive: true,
      }}
    />
  );
}