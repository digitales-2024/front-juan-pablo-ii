"use client";

import { ProductTable } from "./_components/StorageTypeTable";
import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import { notFound } from "next/navigation";
import { useTypeStorages } from "./_hooks/useStorageTypes";
import Loading from "./loading";
import { METADATA } from "./_statics/metadata";
import { toast } from "sonner";

export default function PageBranches() {
  const {typeStoragesQuery: response} = useTypeStorages();

  if (response.isLoading) {
    return <Loading />;
  }

  if (response.isError) {
    toast.error("Ocurrió un error al cargar los tipos de almacén");
    notFound();
  }

  if (!response.data) {
    return <Loading />;
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader
          title={METADATA.title}
          description={METADATA.description}
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ProductTable data={response.data} />
      </div>
    </>
  );
}
