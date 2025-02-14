import { Table } from "@tanstack/react-table";
import { StockByStorage as Stock } from "../_interfaces/stock.interface";
// import { CreateProductDialog } from "./CreateProductDialog";
// import { DeactivateProductDialog } from "./DeactivateProductDialog";
// import { ReactivateProductDialog } from "./ReactivateProductDialog";

export interface StockTableToolbarActionsProps {
  table?: Table<Stock>;
}

export function StockTableToolbarActions({
  table,
}: StockTableToolbarActionsProps) {
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
      {/* <CreateProductDialog /> */}
    </div>
  );
}
