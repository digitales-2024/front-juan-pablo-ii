/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from "@tanstack/react-table";
import { StockByStorage as Stock } from "../_interfaces/stock.interface";

export interface StockTableToolbarActionsProps {
  table?: Table<Stock>;
}

export function StockTableToolbarActions({
  table,
}: StockTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {/* <CreateProductDialog /> */}
    </div>
  );
}
