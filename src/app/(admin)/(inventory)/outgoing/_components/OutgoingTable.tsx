"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./OutgoingTableColumns";
import { OutgoingTableToolbarActions } from "./ProductTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { DetailedOutgoing } from "../_interfaces/outgoing.interface";

interface OutgoingTableProps {
  data: DetailedOutgoing[];
}

export function OutgoingTable({ data }: OutgoingTableProps) {
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
        isActive:false
      }}
    />
  );
}
