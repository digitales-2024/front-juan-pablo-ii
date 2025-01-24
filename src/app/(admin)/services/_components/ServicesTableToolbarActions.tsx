import { Table } from '@tanstack/react-table';
import { Service } from '../_interfaces/service.interface';
import { CreateServiceDialog } from './CreateServiceDialog';
import { CreateServiceTypeDialog } from './CreateServiceTypeDialog';
import { DeactivateServiceDialog } from './DeactivateServiceDialog';
import { ReactivateServiceDialog } from './ReactivateServiceDialog';

export interface ServicesTableToolbarActionsProps {
  table?: Table<Service>;
}

export function ServicesTableToolbarActions({
  table,
}: ServicesTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeactivateServiceDialog
            services={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateServiceDialog
            services={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreateServiceTypeDialog />
      <CreateServiceDialog />
    </div>
  );
}
