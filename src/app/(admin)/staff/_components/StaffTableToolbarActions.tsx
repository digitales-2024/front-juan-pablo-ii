import { Table } from '@tanstack/react-table';
import { Staff } from '../_interfaces/staff.interface';
import { DeactivateStaffDialog } from './DeactivateStaffDialog';
import { ReactivateStaffDialog } from './ReactivateStaffDialog';
import { CreateStaffTypeDialog } from './CreateStaffTypeDialog';
import { CreateStaffDialog } from './CreateStaffDialog';

export interface StaffTableToolbarActionsProps {
  table?: Table<Staff>;
}

export function StaffTableToolbarActions({
  table,
}: StaffTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeactivateStaffDialog
            staffs={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateStaffDialog
            staffs={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreateStaffTypeDialog />
      <CreateStaffDialog />
    </div>
  );
} 