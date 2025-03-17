"use client";

import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import Loading from "./loading";
import { METADATA } from "./_statics/metadata";
import { toast } from "sonner";
//import { FilterOrderDialog } from "./_components/FilterComponents/FilterOrdersDialog";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useCallback } from "react";
import { PrescriptionsTable } from "./_components/PrescriptionTable";
import { useUnifiedPrescriptions } from "./_hooks/useUnifiedPrescriptions";
import SearchPatientCombobox from "./_components/FilterComponents/SearchPatientCombobox";

export default function PageOrders() {
  const {
    query: response,
    setFilterAllPrescriptions,
    setFilterByDni,
  } = useUnifiedPrescriptions();

  const onSubmitPatient = useCallback(
    (value: string) => {
      setFilterByDni(value);
      if (response.isError) {
        toast.error("Error al filtrar stock");
      }
      // if (response.data) {
      //   toast.success("Stock filtrado correctamente");
      // }
    },
    [setFilterByDni]
  );

  const SelectFormItem = () => {
    return (
      <div className="flex flex-col space-y-2 mb-4">
        <div className="w-full">
          {/* <Label className="text-sm font-medium">Buscar por DNI de paciente</Label> */}
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex-grow">
              <SearchPatientCombobox
                onValueChange={(val) => {
                  onSubmitPatient(val);
                }}
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Solo visualizará pacientes registrados
          </div>
        </div>
      </div>
    );
  };
  // <FormField
  //   control={filterByStorageAndProductForm.control}
  //   name="productId"
  //   render={({ field }) => (
  //     <FormItem className="w-full">
  //       <FormLabel>Seleccionar producto</FormLabel>
  //       <SearchProductCombobox
  //         onValueChange={(val) => {
  //           field.onChange(val);
  //         }}
  //       />
  //       <FormMessage />
  //       <FormDescription>Solo visualizará productos activos</FormDescription>
  //     </FormItem>
  //   )}
  // ></FormField>;

  const onSubmitAllPrescriptions = useCallback(() => {
    setFilterAllPrescriptions();
    if (response.isError) {
      toast.error("Error al filtrar recetas");
    }
    if (response.data) {
      toast.success("Recetas filtrado correctamente");
    }
  }, [setFilterAllPrescriptions]);

  if (response.isLoading) {
    return <Loading />;
  }

  if (response.isError) {
    toast.error("Ocurrió un error al cargar las recetas");
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
        {/* <FilterOrderDialog></FilterOrderDialog> */}
        <SelectFormItem />
        <Button
          onClick={onSubmitAllPrescriptions}
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
