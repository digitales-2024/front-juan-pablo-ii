import React from 'react'
import { DataTable } from '@/components/data-table/DataTable';
import { columns } from './ProductStockTableColumns';
import { ProductStock } from '../../_interfaces/stock.interface';
interface ProductStockTableProps {
  data: ProductStock[];
}
export function ProductStockTable({ data }: ProductStockTableProps) {
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
