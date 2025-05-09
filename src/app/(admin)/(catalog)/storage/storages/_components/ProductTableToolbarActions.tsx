import { Table } from "@tanstack/react-table";
import { DetailedStorage } from "../_interfaces/storage.interface";
import { CreateStorageDialog } from "./CreateStorageDialog";
import { DeactivateStorageDialog } from "./DeactivateStorageDialog";
import { ReactivateStorageDialog } from "./ReactivateProductDialog";

export interface ProductTableToolbarActionsProps {
  table?: Table<DetailedStorage>;
}

export function ProductTableToolbarActions({
  table,
}: ProductTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
        <DeactivateStorageDialog
          storages={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      <ReactivateStorageDialog
      storages={table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)}
      onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      </>
      ) : null}
      <CreateStorageDialog />
    </div>
  );
}
