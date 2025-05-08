/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from "@tanstack/react-table";
import { DetailedOrder } from "../_interfaces/order.interface";

export interface ProductTableToolbarActionsProps {
  table?: Table<DetailedOrder>;
}

export function ProductTableToolbarActions({
  table,
}: ProductTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
    </div>
  );
}
