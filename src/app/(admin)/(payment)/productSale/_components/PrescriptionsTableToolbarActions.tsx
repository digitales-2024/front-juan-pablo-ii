import { Table } from "@tanstack/react-table";
// import { CreateOutgoingDialog } from "./CreateOutgoingDialog";
// import { DeactivateOutgoingDialog } from "./DeactivateOutgoingDialog";
// import { ReactivateOutgoingDialog } from "./ReactivateOutgoingDialog";
import { OutgoingProductStock } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { CreateProductSaleBillingProcessDialog } from "./ProductDetails/FormComponents/CreateProductSaleBillingOrderDialog";

export interface ProductSaleTableToolbarActionsProps {
  table?: Table<OutgoingProductStock>;
}

export function ProductSaleTableToolbarActions({
  table,
}: ProductSaleTableToolbarActionsProps) {
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
      <CreateProductSaleBillingProcessDialog />
    </div>
  );
}
