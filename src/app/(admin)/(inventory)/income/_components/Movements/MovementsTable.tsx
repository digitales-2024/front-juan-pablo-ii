import React from 'react'
import { IncomingMovement } from '../../_interfaces/income.interface';
import { DataTable } from '@/components/data-table/DataTable';
import { columns } from './MovementTableColumns';
interface MovementsTableProps {
  data: IncomingMovement[];
}
export function MovementsTable({ data }: MovementsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
    //   columnVisibilityConfig={{
    //     id: true,
    //     date: true,
    //     state: true,
    //     isActive: true,
    //     movementTypeId: true,
    //     quantity: true,
    //     Product: true,
    //   }}
    />
  );
}
