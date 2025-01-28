"use client";

import { CategoryTable } from "./_components/CategoryTable";
import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import { notFound } from "next/navigation";
import { useCategories } from "./_hooks/useCategory";
import LoadingCategories from "./loading";

export default function PageBranches() {
  const {categoriesQuery: response} = useCategories();

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
          title="Categorías"
          description="Administra las categorías del catálogo de productos"
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <CategoryTable data={response.data} />
      </div>
    </>
  );
}
