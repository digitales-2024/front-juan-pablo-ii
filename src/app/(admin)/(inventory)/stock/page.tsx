"use client";

import { StockTable } from "./_components/StockTable";
import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import { notFound } from "next/navigation";
//import { useStock } from "./_hooks/useStock";
import Loading from "./loading";
import { METADATA } from "./_statics/metadata";
import { useFilteredStock, useFilterStockDispatch, updatedFilteredStock } from "./_hooks/useFilterStock";
import { useEffect, useState } from "react";
import { StockByStorage } from "./_interfaces/stock.interface";
import { UseQueryResult } from "@tanstack/react-query";

export default function PageBranches() {
  // const {stockAllStoragesQuery: response} = useStock();
  const data = useFilteredStock();
  const dispatch = useFilterStockDispatch();
  // const dataQuery = dispatch({ type: "ALL_STORAGES" });

  const [dataQuery, setDataQuery] = useState<UseQueryResult<StockByStorage[] | undefined>>();

  useEffect(() => {
    // Llamar dispatch en un Effect asegura que los Hooks no cambien de orden
    const result = dispatch({ type: "ALL_STORAGES" });
    setDataQuery(result);
  }, [dispatch]);

  // Mientras no tengamos dataQuery, se puede retornar un loader
  if (!dataQuery) {
    return <Loading />;
  }

  if (dataQuery.isLoading) {
    return <Loading />;
  }

  if (dataQuery.isError) {
    notFound();
  }

  if (!dataQuery.data) {
    notFound();
  }

  updatedFilteredStock(dataQuery.data);

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader
          title={METADATA.title}
          description={METADATA.description}
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <StockTable data={data} />
      </div>
    </>
  );
}
