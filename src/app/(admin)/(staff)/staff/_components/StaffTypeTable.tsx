import { DataTable } from "@/components/data-table/DataTable";
import { StaffType } from "../_interfaces/staff-type.interface";
import { columns } from "./StaffTypeTableColumns";
import { StaffTypeTableToolbarActions } from "./StaffTypeTableToolbarActions";

interface StaffTypeTableProps {
  data: StaffType[];
}

export function StaffTypeTable({ data }: StaffTypeTableProps) {
  console.log("🎯 Renderizando StaffTypeTable con data:", data);
  
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre..."
      toolbarActions={(table) => <StaffTypeTableToolbarActions table={table} />}
    />
  );
} 