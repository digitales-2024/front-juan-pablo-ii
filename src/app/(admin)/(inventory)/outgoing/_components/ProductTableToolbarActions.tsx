import { Table } from "@tanstack/react-table";
import { DetailedProduct } from "../_interfaces/outgoing.interface";
import { CreateProductDialog } from "./CreateProductDialog";
import { DeactivateProductDialog } from "./DeactivateProductDialog";
import { ReactivateProductDialog } from "./ReactivateProductDialog";

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
