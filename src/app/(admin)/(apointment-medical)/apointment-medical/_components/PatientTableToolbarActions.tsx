import { Table } from "@tanstack/react-table";
import { Patient } from "../_interfaces/patient.interface";
import { DeactivatePatientDialog } from "./DeactivatePatientDialog";
import { ReactivatePatientDialog } from "./ReactivatePatientDialog";
import { CreatePatientDialog } from "./CreatePatientDialog";

export interface PatientTableToolbarActionsProps {
  table?: Table<Patient>;
}

export function PatientTableToolbarActions({
  table,
}: PatientTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeactivatePatientDialog
            patients={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivatePatientDialog
            patients={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreatePatientDialog />
    </div>
  );
}