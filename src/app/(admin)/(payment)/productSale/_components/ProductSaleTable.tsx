"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./ProductSaleTableColumns";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { OutgoingProductStock } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { ProductSaleTableToolbarActions } from "./PrescriptionsTableToolbarActions";

interface ProductStockTableProps {
  data: OutgoingProductStock[];
}

export function ProductStockTable({ data }: ProductStockTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar ..."
      toolbarActions={(table) => <ProductSaleTableToolbarActions table={table} />}
      // columnVisibilityConfig={{
      //   description:false,
      //   // isTransference:false,
      // }}
    />
  );
}
