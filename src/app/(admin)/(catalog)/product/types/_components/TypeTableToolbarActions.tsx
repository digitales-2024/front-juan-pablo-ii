"use client";

import { type Table } from "@tanstack/react-table";
import { TypeProduct } from "../types";
import { CreateTypeDialog } from "./CreateTypeDialog";
import { DeleteTypeDialog } from "./DeleteTypeDialog";
import { ReactivateTypeDialog } from "./ReactivateTypeDialog";


export interface TypeTableToolbarActionsProps {
  table?: Table<TypeProduct>;

}

export function TypeTableToolbarActions({
  table,
}: TypeTableToolbarActionsProps) {
  return (
    <div className="flex w-fit flex-wrap items-center gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeleteTypeDialog
            types={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateTypeDialog
            types={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreateTypeDialog />
    </div>
  );
}
