"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./StorageTableColumns";
import { ProductTableToolbarActions } from "./ProductTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { Order } from "../_interfaces/order.interface";

interface StorageTableProps {
  data: Order[];
}

export function StorageTable({ data }: StorageTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <ProductTableToolbarActions table={table} />}
    />
  );
}
