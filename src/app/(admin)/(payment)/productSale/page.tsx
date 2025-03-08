"use client";

import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import Loading from "./loading";
import { METADATA } from "./_statics/metadata";
import { toast } from "sonner";
//import { FilterOrderDialog } from "./_components/FilterComponents/FilterOrdersDialog";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { ProductStockTable } from "./_components/ProductSaleTable";
import { useUnifiedProductsStock } from "./_hooks/useUnifiedProductStock";
import { useCallback } from "react";
import { useBranches } from "../../branches/_hooks/useBranches";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PageOrders() {
  const {
    activeBranchesQuery,
  } = useBranches();
  const {
    query: response,
    setFilterAllForSaleProductsStock,
    setFilterForSaleProductsStockByBranch,
  } = useUnifiedProductsStock();

  const onSubmitBranch = useCallback(
    (value: string) => {
      if (value === "ALL") {
        setFilterAllForSaleProductsStock();
      }
      setFilterForSaleProductsStockByBranch(value);
      if (response.isError) {
        toast.error("Error al filtrar stock de productos");
      }
      if (response.data) {
        toast.success("Stock de productos filtrado correctamente");
      }
    },
    [setFilterForSaleProductsStockByBranch]
  );

  const onSubmitAllForSaleProducts = useCallback(() => {
    setFilterAllForSaleProductsStock();
    if (response.isError) {
      toast.error("Error al filtrar recetas");
    }
    if (response.data) {
      toast.success("Recetas filtrado correctamente");
    }
  }, [setFilterAllForSaleProductsStock]);

    if (response.isLoading || activeBranchesQuery.isLoading) {
      return <Loading />;
    }
  
    if (response.isError) {
      toast.error("Ocurrió un error al cargar los almacenes");
      throw response.error;
    }

    if(activeBranchesQuery.isError){
      toast.error("Ocurrió un error al cargar las sucursales");
      throw activeBranchesQuery.error;
    }
  
    if (!response.data) {
      return <Loading></Loading>;
    }

    if (!activeBranchesQuery.data) {
      return <Loading></Loading>;
    }

  const SelectFormItem = () => {
    return (
      <div className="flex flex-col space-y-2 mb-4">
        <div className="w-full">
          {/* <Label className="text-sm font-medium">Buscar por DNI de paciente</Label> */}
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex-grow">
              <Select onValueChange={onSubmitBranch} defaultValue="">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {activeBranchesQuery.data.map((branch) => (
                    <SelectItem className="capitalize" key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={"ALL"}>
                      Todas las sucursales
                    </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Solo visualizará sucursales activas
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader title={METADATA.title} description={METADATA.description} />
      </div>
      <div className="p-1 flex space-x-3">
        {/* <FilterOrderDialog></FilterOrderDialog> */}
        <SelectFormItem />
        <Button
          onClick={onSubmitAllForSaleProducts}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <FilterX></FilterX>
          <span>Limpiar Filtros</span>
        </Button>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ProductStockTable data={response.data} />
      </div>
    </>
  );
}
