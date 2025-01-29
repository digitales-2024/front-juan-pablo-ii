"use client";

import { ProductTable } from "./_components/ProductTable";
import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import { notFound } from "next/navigation";
import { useProducts } from "./_hooks/useProduct";
import LoadingCategories from "./loading";

export default function PageBranches() {
  const {detailedProductsQuery: response} = useProducts();

  if (response.isLoading) {
    return <LoadingCategories />;
  }

  if (response.isError) {
    notFound();
  }

  if (!response.data) {
    notFound();
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader
          title="Productos"
          description="Administra todos los productos de tu catálogo"
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ProductTable data={response.data} />
      </div>
    </>
  );
}
