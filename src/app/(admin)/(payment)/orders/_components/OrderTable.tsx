"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./OrderTableColumns";
import { ProductTableToolbarActions } from "./OrderTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { DetailedOrder } from "../_interfaces/order.interface";

interface StorageTableProps {
  data: DetailedOrder[];
}

export function OrderTable({ data }: StorageTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <ProductTableToolbarActions table={table} />}
      columnVisibilityConfig={
        {
          subtotal: false,
          tax: false,
        }
      }
    />
  );
}
