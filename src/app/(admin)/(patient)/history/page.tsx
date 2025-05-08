"use client";

import { HistoryTable } from "./_components/HistoryTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useMedicalHistories } from "./_hooks/usehistory";
import LoadingCategories from "./loading";
import { METADATA } from "./_statics/metadata";

export default function PageBranches() {
  const { medicalHistoriesQuery: response } = useMedicalHistories();

  if (response.isLoading) {
    return <LoadingCategories />;
  }

  if (response.isError) {
    console.log(response);
    notFound();
  }

  if (!response.data) {
    notFound();
  }

  //console.log("Data in page received:", response.data);

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader
          title={METADATA.title}
          description={METADATA.description}
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <HistoryTable data={response.data} />
      </div>
    </>
  );
}