import { Table } from "@tanstack/react-table";
import { DetailedIncoming } from "../_interfaces/income.interface";
import { CreateIncomingDialog } from "./CreateIncomingDialog";
import { DeactivateIncomingDialog } from "./DeactivateIncomingDialog";
import { ReactivateIncomingDialog } from "./ReactivateIncomingDialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import { ToolbarButtonsLoading } from "./errorComponents/ToolbarLoading";
import { toast } from "sonner";

export interface ProductTableToolbarActionsProps {
  table?: Table<DetailedIncoming>;
}

export function IncomingTableToolbarActions({
  table,
}: ProductTableToolbarActionsProps) {
  // const globalFilterFn:FilterFn<DetailedIncoming> = (row, columnId, filterValue:string) => {
  //   const rowValue: string = row.getValue(columnId);
  //   return rowValue.toString().toLowerCase().includes(filterValue.toLowerCase());
  // };
  const { activeBranchesQuery:responseBranches } = useBranches();
  const { activeStoragesQuery:responseStorages } = useStorages();
  if (responseBranches.isLoading && responseStorages.isLoading) {
      return <ToolbarButtonsLoading />;
    } else {
      if (responseBranches.isError) {
        toast.error("Error al cargar las sucursales, "+responseBranches.error.message, {
          action: {
            label: "Recargar",
            onClick: async () => {
              await responseBranches.refetch();
            }
          }
        });
        return (
          <ToolbarButtonsLoading
          />
        );
      }
      if (!responseBranches.data) {
        return (
          <ToolbarButtonsLoading
          />
        );
      }
      if(responseStorages.isError){
        toast.error("Error al cargar los almacenes, "+responseStorages.error.message, {
          action: {
            label: "Recargar",
            onClick: async () => {
              await responseStorages.refetch();
            }
          }
        });
        return (
          <ToolbarButtonsLoading
          />
        )
      }
      if(!responseStorages.data){
        return (
          <ToolbarButtonsLoading
          />
        );
      }
    }
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
        <DeactivateIncomingDialog
          incomings={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      <ReactivateIncomingDialog
      incomings={table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)}
      onSuccess={() => table.toggleAllRowsSelected(false)}
      />
      </>
      ) : null}
      <Select onValueChange={
        (e)=>{
          // return table?.setGlobalFilter((rows, columnId, filterValue) => {
          //   return rows.filter(row => globalFilterFn(row, columnId, filterValue));
          // });
          return table?.setGlobalFilter(e.toLowerCase());
        }
      }>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtre por almacén"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Todos</SelectLabel>
            {
              responseStorages.data.map((storage) => (
                <SelectItem key={storage.id} value={storage.name}>
                  {storage.name}
                </SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select onValueChange={
        (e)=>{
          // return table?.setGlobalFilter((rows, columnId, filterValue) => {
          //   return rows.filter(row => globalFilterFn(row, columnId, filterValue));
          // });
          return table?.setGlobalFilter(e.toLowerCase());
        }
      }>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtre por sucursal"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Todos</SelectLabel>
            {
              responseBranches.data.map((branch) => (
                <SelectItem key={branch.id} value={branch.name}>
                  {branch.name}
                </SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
      <CreateIncomingDialog />
    </div>
  );
}
