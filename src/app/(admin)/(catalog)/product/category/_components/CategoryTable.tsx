"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./CategoryTableColumns";
import { BranchesTableToolbarActions } from "./CategoryTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { Category } from "../_interfaces/category.interface";

interface CategoryTableProps {
  data: Category[];
}

export function CategoryTable({ data }: CategoryTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <BranchesTableToolbarActions table={table} />}
    />
  );
}
