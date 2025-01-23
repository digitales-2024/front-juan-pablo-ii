"use client";

import { TypeTable } from "./_components/TypeTable";

import { useTypeProducts } from "./hook/useType";

export default function TypeProductsPage() {
  const { data: response,  } = useTypeProducts();



  return (
    <>
      {/* Encabezado */}
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Tipos de Productos
          </h2>
          <p className="text-muted-foreground">
            Lista de tipos de productos registrados en el sistema.
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <TypeTable data={response} />
      </div>
    </>
  );
}
