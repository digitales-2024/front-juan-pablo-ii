import { Table } from "@tanstack/react-table";
import { DetailedIncoming } from "../_interfaces/income.interface";
import { CreateIncomingDialog } from "./CreateIncomingDialog";
import { DeactivateProductDialog } from "./DeactivateIncomingDialog";
import { ReactivateProductDialog } from "./ReactivateIncomingDialog";

export interface ProductTableToolbarActionsProps {
  table?: Table<DetailedIncoming>;
}

export function IncomingTableToolbarActions({
  table,
}: ProductTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {/* {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
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
      ) : null} */}
      <CreateIncomingDialog />
    </div>
  );
}
