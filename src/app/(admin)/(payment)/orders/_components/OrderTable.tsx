"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./OrderTableColumns";
import { ProductTableToolbarActions } from "./OrderTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { Order } from "../_interfaces/order.interface";

interface StorageTableProps {
  data: Order[];
}

export function OrderTable({ data }: StorageTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <ProductTableToolbarActions table={table} />}
    />
  );
}
