import React from 'react'
import { DataTable } from '@/components/data-table/DataTable';
import { ActiveProduct } from '@/app/(admin)/(catalog)/product/products/_interfaces/products.interface';
import { columns } from './SelectProductTableColumns';
interface SelectProductsTableProps {
  data: ActiveProduct[];
  onSelection: (selected: ActiveProduct[]) => void;
}

export function SelectProductsTable({ data }: SelectProductsTableProps) {
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
