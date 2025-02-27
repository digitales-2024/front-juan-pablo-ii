"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./OutgoingTableColumns";
import { OutgoingTableToolbarActions } from "./PrescriptionsTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { PrescriptionWithPatient } from "../_interfaces/prescription.interface";

interface PrescriptionTableProps {
  data: PrescriptionWithPatient[];
}

export function PrescriptionsTable({ data }: PrescriptionTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <OutgoingTableToolbarActions table={table} />}
      columnVisibilityConfig={{
        description:false,
        state:false,
        // isTransference:false,
      }}
    />
  );
}
