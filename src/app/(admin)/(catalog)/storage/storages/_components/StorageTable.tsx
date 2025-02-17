"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./StorageTableColumns";
import { ProductTableToolbarActions } from "./ProductTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { DetailedStorage } from "../_interfaces/storage.interface";

interface StorageTableProps {
  data: DetailedStorage[];
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
