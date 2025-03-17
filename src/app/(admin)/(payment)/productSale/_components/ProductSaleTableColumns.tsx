"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
// import { DetailedOutgoing } from "../_interfaces/outgoing.interface";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { UpdateOutgoingSheet } from "./UpdateOutgoingSheet";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
// import { ReactivateOutgoingDialog } from "./ReactivateOutgoingDialog";
// import { DeactivateOutgoingDialog } from "./DeactivateOutgoingDialog";
// import { ShowMovementsDialog } from "./Movements/ShowMovementsDialog";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { StorageMovementDetail } from "./Movements/StorageMovementDetail";
import { OutgoingProductStock } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { ProductStockDetailPopover } from "./ProductSalePopover";
// import Image from "next/image";

// const STATE_OPTIONS = {
//   true: "Concretado",
//   false: "En proceso",
// };

// const TRANSFERENCE_OPTIONS = {
//   true: "SI",
//   false: "NO",
// };

export const columns: ColumnDef<OutgoingProductStock>[] = [
  {
    id: "select",
    size: 10,
    header: ({ table }) => (
      <div className="px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    accessorKey: "name",
    meta: {
      title: "Producto",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "codigoProducto",
    meta: {
      title: "Codigo",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
    )
  },
  {
    accessorKey: "precio",
    meta: {
      title: "Precio venta",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio Venta" />
    ),
    cell: ({ row }) => (
      <span>{row.original.precio.toLocaleString(
        "es-PE",
        {
          style: "currency",
          currency: "PEN",
        }
      )}</span>
    ),
  },
  {
    accessorKey: "Stock",
    meta: {
      title: "Stock info.",
    },
    header: () => <div>Stock</div>,
    cell: ({ row }) => (
      <div>
        {row.original.Stock && <ProductStockDetailPopover productStock={row.original}></ProductStockDetailPopover>}
        {
          !row.original.Stock && <span>No disponible</span>
        }
      </div>
    ),
  },
  // {
  //   accessorKey: "",
  //   size: 10,
  //   meta: {
  //     title: "Procesar órden",
  //   },
  //   header: () => <div>Procesar órden</div>,
  //   cell: ({ row }) => (
  //     <div>
  //       {/* <ShowMovementsDialog
  //         data={row.original.prescriptionServices}
  //       ></ShowMovementsDialog> */}
  //       <CreatePrescriptionBillingProcessDialog
  //         prescription={row.original}
  //       ></CreatePrescriptionBillingProcessDialog>
  //     </div>
  //   ),
  // },
  {
    id: "Acciones",
    accessorKey: "actions",
    size: 10,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: function Cell({ row }) {
      // const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      // const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      // const [showEditSheet, setShowEditSheet] = useState(false);
      // const {} = useProductStockById(row.original.Movement)
      // const productExistent: OutgoingProducStockForm = 
      // const outgoing = row.original;
      // const { isActive } = outgoing;
      return (
        <div>
          {/* <div>
            {showEditSheet && (
              <UpdateOutgoingSheet
                outgoing={outgoing}
                open={showEditSheet}
                onOpenChange={setShowEditSheet}
                showTrigger={false}
              />
            )}
            {showDeleteDialog && (
              <DeactivateOutgoingDialog
                outgoing={outgoing}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                showTrigger={false}
              />
            )}
            {showReactivateDialog && (
              <ReactivateOutgoingDialog
                outgoing={outgoing}
                open={showReactivateDialog}
                onOpenChange={setShowReactivateDialog}
              />
            )}
          </div> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setShowEditSheet(true)}
                disabled={!isActive}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isSuperAdmin && (
                <DropdownMenuItem
                  onSelect={() => setShowReactivateDialog(true)}
                  disabled={isActive}
                >
                  Reactivar
                  <DropdownMenuShortcut>
                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                disabled={!isActive}
              >
                Eliminar
                <DropdownMenuShortcut>
                  <Trash className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent> */}
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
];
