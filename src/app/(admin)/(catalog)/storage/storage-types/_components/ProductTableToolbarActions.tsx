import { Table } from "@tanstack/react-table";
import { DetailedTypeStorage } from "../_interfaces/storageTypes.interface";
import { CreateTypeStorageDialog } from "./CreateStorageTypeDialog";
import { DeactivateTypeStorageDialog } from "./DeactivateStorageTypeDialog";
import { ReactivateStorageTypeDialog } from "./ReactivateStorageTypeDialog";

export interface TypeStorageTableToolbarActionsProps {
  table?: Table<DetailedTypeStorage>;
}

export function TypeStorageTableToolbarActions({
  table,
}: TypeStorageTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
        <DeactivateTypeStorageDialog
          typeStorages={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      <ReactivateStorageTypeDialog
      storageTypes={table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)}
      onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      </>
      ) : null}
      <CreateTypeStorageDialog />
    </div>
  );
}
