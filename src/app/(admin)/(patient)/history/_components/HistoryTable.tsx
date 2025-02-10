"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./HistoryTableColumns";
import { ProductTableToolbarActions } from "./HistoryTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { DetailedProduct } from "../_interfaces/history.interface";

interface ProductTableProps {
  data: DetailedProduct[];
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
export function ProductTable({ data }: ProductTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <ProductTableToolbarActions table={table} />}
      columnVisibilityConfig={{
        name: true,
        unidadMedida: false,
        codigoProducto: true,
        categoria: true,
        tipoProducto: false,
        precio: true,
        descuento: false,
        description: true,
        observaciones: false,
        condicionesAlmacenamiento: false,
        usoProducto: true,
        isActive: true,
      }}
    />
  );
}
