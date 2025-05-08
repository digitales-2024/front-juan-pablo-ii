import { Table } from '@tanstack/react-table';
import { ServiceType } from '../_interfaces/service-type.interface';
import { CreateServiceTypeDialog } from './CreateServiceTypeDialog';
import { DeactivateServiceTypeDialog } from './DeactivateServiceTypeDialog';
import { ReactivateServiceTypeDialog } from './ReactivateServiceTypeDialog';

export interface ServiceTypeTableToolbarActionsProps {
  table?: Table<ServiceType>;
}

export function ServiceTypeTableToolbarActions({
  table,
}: ServiceTypeTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeactivateServiceTypeDialog
            serviceTypes={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateServiceTypeDialog
            serviceTypes={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreateServiceTypeDialog />
    </div>
  );
} 