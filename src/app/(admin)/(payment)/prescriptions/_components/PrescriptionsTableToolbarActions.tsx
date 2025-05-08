import { Table } from "@tanstack/react-table";
// import { CreateOutgoingDialog } from "./CreateOutgoingDialog";
// import { DeactivateOutgoingDialog } from "./DeactivateOutgoingDialog";
// import { ReactivateOutgoingDialog } from "./ReactivateOutgoingDialog";
import { PrescriptionWithPatient } from "../_interfaces/prescription.interface";

export interface OutgoingTableToolbarActionsProps {
  table?: Table<PrescriptionWithPatient>;
}

export function OutgoingTableToolbarActions({
  table,
}: OutgoingTableToolbarActionsProps) {

  // if (responseStorages.isLoading) {
  //   return <ToolbarButtonsLoading />;
  // } else {
  //   if(responseStorages.isError){
  //     toast.error("Error al cargar los almacenes, "+responseStorages.error.message, {
  //       action: {
  //         label: "Recargar",
  //         onClick: async () => {
  //           await responseStorages.refetch();
  //         }
  //       }
  //     });
  //     return (
  //       <ToolbarButtonsLoading
  //       />
  //     )
  //   }
  //   if(!responseStorages.data){
  //     return (
  //       <ToolbarButtonsLoading
  //       />
  //     );
  //   }
  // }
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          {/* <DeactivateOutgoingDialog
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
          /> */}
        </>
      ) : null}
      {/* <Select onValueChange={
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
      </Select> */}
      {/* <CreateOutgoingDialog /> */}
    </div>
  );
}
