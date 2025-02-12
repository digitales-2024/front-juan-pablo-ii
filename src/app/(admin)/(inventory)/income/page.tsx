"use client";

import { IncomingTable } from "./_components/IncomingTable";
import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import { notFound } from "next/navigation";
import { useIncoming } from "./_hooks/useIncoming";
import LoadingCategories from "./loading";
import { METADATA } from "./_statics/metadata";

export default function PageBranches() {
  const {detailedIncomingsQuery: response} = useIncoming();

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
          title={METADATA.title}
          description={METADATA.description}
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <IncomingTable data={response.data} />
      </div>
    </>
  );
}
