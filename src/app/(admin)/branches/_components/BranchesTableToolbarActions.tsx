import { Table } from "@tanstack/react-table";
import { Branch } from "../_interfaces/branch.interface";
import { CreateBranchDialog } from "./CreateBranchDialog";
import { DeleteBranchDialog } from "./DeleteBranchDialog";

export interface BranchesTableToolbarActionsProps {
  table?: Table<Branch>;
}

export function BranchesTableToolbarActions({
  table,
}: BranchesTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteBranchDialog
          branches={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateBranchDialog />
    </div>
  );
}
