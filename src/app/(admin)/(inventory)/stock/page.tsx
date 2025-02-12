"use client";

import { StockTable } from "./_components/StockTable";
import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import { notFound } from "next/navigation";
//import { useStock } from "./_hooks/useStock";
import Loading from "./loading";
import { METADATA } from "./_statics/metadata";
import {
  useFilteredStock,
  useFilterStock,
  useUpdateFilteredStock,
} from "./_hooks/useFilterStock";
import { FilterStockDialog } from "./_components/FilterComponents/FilterByStorageNStockDialog";
// import { useEffect, useState } from "react";
// import { StockByStorage } from "./_interfaces/stock.interface";
// import { UseQueryResult } from "@tanstack/react-query";

export default function PageBranches() {
  const dataQuery = useFilterStock({
    type: "ALL_STORAGES",
  });
  const { data, isLoading, error, isError } = dataQuery;
  const filteredStockQuery = useFilteredStock();
  const updateFIlteredStock = useUpdateFilteredStock(); 
  //const updateFilteredStock = useUpdateFilteredStock();

  // const [dataQuery, setDataQuery] = useState<UseQueryResult<StockByStorage[] | undefined>>();

  // useEffect(() => {
  //   // Llamar dispatch en un Effect asegura que los Hooks no cambien de orden
  //   const result = dispatch({ type: "ALL_STORAGES" });
  //   setDataQuery(result);
  // }, [dispatch]);

  // Mientras no tengamos dataQuery, se puede retornar un loader
  if (!dataQuery) {
    return <Loading />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  if (data){
    updateFIlteredStock(data);
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader title={METADATA.title} description={METADATA.description} />
      </div>
      <div className="p-1">
        <FilterStockDialog></FilterStockDialog>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        {/* <Select onValueChange={
          (e)=>{
            // return table?.setGlobalFilter((rows, columnId, filterValue) => {
            //   return rows.filter(row => globalFilterFn(row, columnId, filterValue));
            // });
            return table?.setGlobalFilter(e.toLowerCase());
          }
        }>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtre por almacén"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Todos</SelectLabel>
              {
                responseStorages.data.map((storage) => (
                  <SelectItem key={storage.id} value={storage.name}>
                    {storage.name}
                  </SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select> */}

        {/* Campo de tipo de producto */}
        {/* <FormField
          control={form.control}
          name={FORMSTATICS.tipoProductoId.name}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{FORMSTATICS.tipoProductoId.label}</FormLabel>
              <FormControl>
                <AutoComplete
                  options={typeProductOptions}
                  placeholder={FORMSTATICS.tipoProductoId.placeholder}
                  emptyMessage={FORMSTATICS.tipoProductoId.emptyMessage!}
                  value={
                    typeProductOptions.find(
                      (option) => option.value === field.value
                    ) ?? undefined
                  }
                  onValueChange={(option) => {
                    field.onChange(option?.value || "");
                  }}
                />
              </FormControl>
              <CustomFormDescription
                required={FORMSTATICS.tipoProductoId.required}
              ></CustomFormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <StockTable data={data} />
      </div>
    </>
  );
}
