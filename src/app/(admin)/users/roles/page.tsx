"use client";
import { useRol } from "@/hooks/use-rol";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { RolesTable } from "@/components/user/roles/RolesTable";

export default function PageRoles() {
  const { dataRoles, isLoadingRoles } = useRol();

  if (isLoadingRoles) {
    return (
      <Shell>
        <HeaderPage
          title="Roles"
          description="Aquí puedes ver la lista de roles registrados en la aplicación."
        />
        <DataTableSkeleton columnCount={5} searchableColumnCount={1} />
      </Shell>
    );
  }

  if (!dataRoles) {
    return (
      <Shell>
        <HeaderPage
          title="Roles"
          description="Aquí puedes ver la lista de roles registrados en la aplicación."
        />
        <ErrorPage />
      </Shell>
    );
  }

  return (
    <Shell>
      <HeaderPage
        title="Roles"
        description="Aquí puedes ver la lista de roles registrados en la aplicación."
      />
      <RolesTable data={dataRoles} />
    </Shell>
  );
}
