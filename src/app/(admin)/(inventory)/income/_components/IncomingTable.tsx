"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./IncomingTableColumns";
import { IncomingTableToolbarActions } from "./IncomingTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { DetailedIncoming } from "../_interfaces/income.interface";

interface IncomingTableProps {
  data: DetailedIncoming[];
}

export function IncomingTable({ data }: IncomingTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <IncomingTableToolbarActions table={table} />}
      columnVisibilityConfig={
        {
          description: false,
          state: false,
        }
      }
    />
  );
}
