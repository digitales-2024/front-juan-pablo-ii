import { Table } from "@tanstack/react-table";
import {
  DetailedOutgoing,
} from "../_interfaces/outgoing.interface";
import { CreateOutgoingDialog } from "./CreateOutgoingDialog";
import { DeactivateOutgoingDialog } from "./DeactivateOutgoingDialog";
import { ReactivateOutgoingDialog } from "./ReactivateProductDialog";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface OutgoingTableToolbarActionsProps {
  table?: Table<DetailedOutgoing>;
}

export function OutgoingTableToolbarActions({
  table,
}: OutgoingTableToolbarActionsProps) {
  const { activeBranchesQuery: responseBranches } = useBranches();
  const { activeStoragesQuery: responseStorages } = useStorages();

  if (responseBranches.isLoading && responseStorages.isLoading) {
    return <LoadingDialogForm />;
  } else {
    if (responseBranches.isError) {
      return (
        <GeneralErrorMessage
          error={responseBranches.error}
          reset={responseBranches.refetch}
        />
      );
    }
    if (!responseBranches.data) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron sucursales")}
          reset={responseBranches.refetch}
        />
      );
    }
    if (responseStorages.isError) {
      return (
        <GeneralErrorMessage
          error={responseStorages.error}
          reset={responseStorages.refetch}
        />
      );
    }
    if (!responseStorages.data) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron almacenes")}
          reset={responseStorages.refetch}
        />
      );
    }
  }
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeactivateOutgoingDialog
            outcomes={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateOutgoingDialog
            outcomes={table
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
      <CreateOutgoingDialog />
    </div>
  );
}
