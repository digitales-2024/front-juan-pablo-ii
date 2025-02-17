import React from 'react'
import { OutgoingMovement } from '../../_interfaces/outgoing.interface';
import { DataTable } from '@/components/data-table/DataTable';
import { columns } from './MovementTableColumns';
interface MovementsTableProps {
  data: OutgoingMovement[];
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
