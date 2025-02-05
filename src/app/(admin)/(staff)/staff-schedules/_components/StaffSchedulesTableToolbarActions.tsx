// src/app/(admin)/(staff)/staff-schedules/_components/StaffSchedulesTableToolbarActions.tsx
import { Table } from '@tanstack/react-table';
import { StaffSchedule } from '../_interfaces/staff-schedules.interface';
import { CreateStaffScheduleDialog } from './CreateStaffScheduleDialog';
import { DeactivateStaffScheduleDialog } from './DeactivateStaffScheduleDialog';
import { ReactivateStaffScheduleDialog } from './ReactivateStaffScheduleDialog';

export interface StaffSchedulesTableToolbarActionsProps {
  table?: Table<StaffSchedule>;
}

export function StaffSchedulesTableToolbarActions({
  table,
}: StaffSchedulesTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeactivateStaffScheduleDialog
            schedules={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateStaffScheduleDialog
            schedules={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreateStaffScheduleDialog />
    </div>
  );
}