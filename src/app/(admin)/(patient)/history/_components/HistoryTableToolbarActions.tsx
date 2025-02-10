import { Table } from "@tanstack/react-table";
import { DetailedProduct } from "../_interfaces/history.interface";
import { CreateProductDialog } from "./CreateHistoryDialog";
import { DeactivateProductDialog } from "./DeactivateHistoryDialog";
import { ReactivateProductDialog } from "./ReactivateHistoryDialog";

export interface ProductTableToolbarActionsProps {
  table?: Table<DetailedProduct>;
}

export function ProductTableToolbarActions({
  table,
}: ProductTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
        <DeactivateProductDialog
          products={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      <ReactivateProductDialog
      products={table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)}
      onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      </>
      ) : null}
      <CreateProductDialog />
    </div>
  );
}
