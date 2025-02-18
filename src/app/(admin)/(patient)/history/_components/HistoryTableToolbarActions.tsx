import { Table } from "@tanstack/react-table";
import { MedicalHistory } from "../_interfaces/history.interface";
import { DeactivateHistoryDialog } from "./DeactivateHistoryDialog";
import { ReactivateHistoryDialog } from "./ReactivateHistoryDialog";

export interface HistoryTableToolbarActionsProps {
  table?: Table<MedicalHistory>;
}

export function HistoryTableToolbarActions({
  table,
}: HistoryTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeactivateHistoryDialog
            histories={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateHistoryDialog
            histories={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
    </div>
  );
}