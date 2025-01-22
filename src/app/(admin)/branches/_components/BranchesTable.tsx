"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./BranchesTableColumns";
import { Branch } from "../_interfaces/branch.interface";
import { BranchesTableToolbarActions } from "./BranchesTableToolbarActions";

interface BranchesTableProps {
  data: Branch[];
}

export function BranchesTable({ data }: BranchesTableProps) {
  console.log("🎯 Renderizando BranchesTable con data:", data);
  
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre o dirección..."
      toolbarActions={<BranchesTableToolbarActions />}
    />
  );
}
