"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./StockTableColumns";
import { StockTableToolbarActions } from "./StockTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { type StockByStorage as Stock } from "../_interfaces/stock.interface";

interface StockTableProps {
  data: Stock[];
}

// name
// unidadMedida
// codigoProducto
// categoria
// tipoProducto
// precio
// descuento
// description
// observaciones
// condicionesAlmacenamiento
// usoProducto
// isActive
export function StockTable({ data }: StockTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <StockTableToolbarActions table={table} />}
      columnVisibilityConfig={{
        description: false,
        //address:false,
      }}
    />
  );
}
