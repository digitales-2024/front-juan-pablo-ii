"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./ProductTableColumns";
import { ProductTableToolbarActions } from "./ProductTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { TypeStorage } from "../_interfaces/storageTypes.interface";

interface ProductTableProps {
  data: TypeStorage[];
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
    />
  );
}
