import { Table } from "@tanstack/react-table";
import { Category } from "../_interfaces/category.interface";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { DeactivateCategoryDialog } from "./DeactivateCategoryDialog";
import { ReactivateCategoryDialog } from "./ReactivateCategoryDialog";

export interface BranchesTableToolbarActionsProps {
  table?: Table<Category>;
}

export function BranchesTableToolbarActions({
  table,
}: BranchesTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
        <DeactivateCategoryDialog
          categories={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      <ReactivateCategoryDialog
      categories={table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)}
      onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      </>
      ) : null}
      <CreateCategoryDialog />
    </div>
  );
}
