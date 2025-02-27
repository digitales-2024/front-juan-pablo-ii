"use client";

import { PageHeader } from "@/components/PageHeader";
import { StorageTable } from "./_components/OrderTable";
// import { getBranches } from "./_actions/branch.actions";
import Loading from "./loading";
import { METADATA } from "./_statics/metadata";
import { toast } from "sonner";
import { FilterOrderDialog } from "./_components/FilterComponents/FilterOrdersDialog";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useCallback } from "react";
import { PrescriptionsTable } from "./_components/OutgoingTable";
import { useUnifiedPrescriptions } from "./_hooks/useUnifiedPrescriptions";

export default function PageOrders() {
  const {
    query: response,
    setFilterAllPrescriptions,
    setFilterByDni,
  } = useUnifiedPrescriptions();

  const onSubmitAllStorages = useCallback(() => {
    setFilterAllOrders();
    if (response.isError) {
      toast.error("Error al filtrar stock");
    }
    if (response.data) {
      toast.success("Stock filtrado correctamente");
    }
  }, [setFilterAllOrders]);

  if (response.isLoading) {
    return <Loading />;
  }

  if (response.isError) {
    toast.error("Ocurrió un error al cargar los almacenes");
    throw response.error;
  }

  if (!response.data) {
    return <Loading></Loading>;
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader title={METADATA.title} description={METADATA.description} />
      </div>
      <div className="p-1 flex space-x-3">
        <FilterOrderDialog></FilterOrderDialog>
        <Button
          onClick={onSubmitAllStorages}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <FilterX></FilterX>
          <span>Limpiar Filtros</span>
        </Button>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <PrescriptionsTable data={response.data} />
      </div>
    </>
  );
}
