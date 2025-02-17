import { Table } from '@tanstack/react-table';
import { StaffType } from '../_interfaces/staff-type.interface';
import { CreateStaffTypeDialog } from './CreateStaffTypeDialog';
import { DeleteStaffTypeDialog } from './DeactivateStaffTypeDialog';
import { ReactivateStaffTypeDialog } from './ReactivateStaffTypeDialog';

export interface StaffTypeTableToolbarActionsProps {
  table?: Table<StaffType>;
}

export function StaffTypeTableToolbarActions({
  table,
}: StaffTypeTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeleteStaffTypeDialog
            staffTypes={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateStaffTypeDialog
            staffTypes={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreateStaffTypeDialog />
    </div>
  );
} 