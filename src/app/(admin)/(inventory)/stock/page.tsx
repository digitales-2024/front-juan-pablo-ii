"use client";

import { StockTable } from "./_components/StockTable";
import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import { notFound } from "next/navigation";
//import { useStock } from "./_hooks/useStock";
import Loading from "./loading";
import { METADATA } from "./_statics/metadata";
import {
  useUnifiedStock,
} from "./_hooks/useFilterStock";
import { FilterStockDialog } from "./_components/FilterComponents/FilterByStorageNStockDialog";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

export default function PageBranches() {

  const {
    data,
    isLoading,
    query: dataQuery,
    setFilterAllStorages
  } = useUnifiedStock();

  const onSubmitAllStorages = useCallback(() => {
    setFilterAllStorages();
    if (dataQuery.isError) {
      toast.error("Error al filtrar stock");
    }
    if (dataQuery.data) {
      toast.success("Stock filtrado correctamente");
    }
  }
  , [setFilterAllStorages]);

  // Mientras no tengamos dataQuery, se puede retornar un loader
  if (!dataQuery) {
    return <Loading />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (dataQuery.isError) {
    throw dataQuery.error;
  }

  if (!data) {
    notFound();
  }
  
  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader title={METADATA.title} description={METADATA.description} />
      </div>
      <div className="p-1 flex space-x-3">
        <FilterStockDialog></FilterStockDialog>
        <Button onClick={onSubmitAllStorages} variant="outline" size="sm" className="flex items-center space-x-1" >
          <FilterX></FilterX>
          <span>Limpiar Filtros</span>
        </Button>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <StockTable data={data} />
      </div>
    </>
  );
}
