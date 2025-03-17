import React from 'react'
import { DataTable } from '@/components/data-table/DataTable';
import { columns } from './SelectProductTableColumns';
import { OutgoingProductStock } from '@/app/(admin)/(inventory)/stock/_interfaces/stock.interface';
interface SelectProductsTableProps {
  data: OutgoingProductStock[];
}

export function SelectProductsTable({ data }: SelectProductsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      // columnVisibilityConfig={
      //   {
      //     precio:false,
      //   }
      // }
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
