"use client";

import { PatientTable } from "./_components/ApoointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { usePatients } from "./_hooks/usePatient";
import LoadingCategories from "./loading";
import { METADATA } from "./_statics/metadata";

export default function PageBranches() {
  const { patientsQuery: response } = usePatients();

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

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader title={METADATA.title} description={METADATA.description} />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <PatientTable data={response.data} />
      </div>
    </>
  );
}
