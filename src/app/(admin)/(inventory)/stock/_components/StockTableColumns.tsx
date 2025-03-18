"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { type StockByStorage as Stock } from "../_interfaces/stock.interface";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Badge } from "@/components/ui/badge";
// import { UpdateProductSheet } from "./UpdateProductSheet";
import { Button } from "@/components/ui/button";
import { Ellipsis} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useEffect, useState } from "react";
// import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
// import { ReactivateProductDialog } from "./ReactivateProductDialog";
import { Checkbox } from "@/components/ui/checkbox";
// import { DeactivateProductDialog } from "./DeactivateProductDialog";
import { ShowProductStockDialog } from "./ProductStock/ShowProductStockDialog";
// import Image from "next/image";

// {
//   "idStorage": "61de3a1b-9538-48a0-8cdc-62edafcef760",
//   "name": "Almacen medicamentos",
//   "location": "JLBR",
//   "address": "Urb La rivera E-18, JLBR",
//   "staff": "Juan",
//   "description": "",
//   "stock": [
//     {
//       "idProduct": "397d68a1-cb47-4402-9546-0ab7b57ec93f",
//       "name": "escitalopram",
//       "unit": "blister",
//       "price": 150,
//       "stock": 7,
//       "totalPrice": 1050
//     }
//   ]
// }

export const columns: ColumnDef<Stock>[] = [
  {
    id: "select",
    meta: { title: "Selec." },
    size: 10,
    header: ({ table }) => (
      <div className="px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
    meta:{
      title: "Almacén"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Almacén" />
    ),
  },
  {
    accessorKey: "stock",
    meta:{
      title: "Stock",
    },
    header: ()=>(
      <div>Stock</div>
    ),
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Stock" />
    // ),
    cell: ({ row }) => {
      return <div>
        <ShowProductStockDialog 
          storageId={row.original.idStorage} 
          storageName={row.original.name??undefined}
        ></ShowProductStockDialog>
      </div>
    },
  },
  {
    accessorKey: "location",
    meta:{
      title: "Ubicación"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ubicación" />
    ),
  },
  {
    accessorKey: "address",
    meta:{
      title: "Dirección"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dirección" />
    )
  },
  {
    accessorKey: "staff",
    meta:{
      title: "Personal"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personal" />
    ),
  },
  // NO usamos por el momento
  // {
  //   accessorKey: "imagenUrl",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Imágen" />
  //   ),
  //   cell: ({ row }) => (
  //     // <Image
  //     //   src={row.original.imagenUrl}
  //     //   alt={row.original.name}
  //     //   width={24}
  //     //   height={24}
  //     //   className="w-6 h-6 rounded-md object-cover"
  //     // />
  //     <img src={row.original.imagenUrl}
  //         alt={row.original.name}
  //         className="w-6 h-6 rounded-md object-cover"
  //       />
  //   ),
  // },
  {
    accessorKey: "description",
    meta: {
      title: "Descripción"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
  },
    // {
    //   accessorKey: "movements",
    //   size: 10,
    //   meta: {
    //     title: "Movimientos"
    //   },
    //   header: () => (
    //     <div>Movimientos</div>
    //   ),
    //   cell: ({ row }) => (
    //     <div>
    //       <ShowMovementsDialog data={row.original.Movement} incomingName={row.original.name??row.original.id}></ShowMovementsDialog>
    //     </div>
    //   ),
    // },

  // {
  //   accessorKey: "isActive",
  //   id: "Estado",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Estado" />
  //   ),
  //   cell: ({ row }) => (
  //     <Badge variant={row.original.isActive ? "success" : "destructive"}>
  //       {row.original.isActive ? "Activo" : "Inactivo"}
  //     </Badge>
  //   ),
  // },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Fecha de creación" />
  //   ),
  //   cell: ({ row }) =>
  //     format(new Date(row.original.createdAt), "PPp", { locale: es }),
  // },
  // {
  //   accessorKey: "actions",
  //   id: "Acciones",
  //   size: 10,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Acciones" />
  //   ),
  //   cell: function Cell({ row }) {
  //     // const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  //     // const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  //     // const [showEditSheet, setShowEditSheet] = useState(false);
  //     // const product = row.original;
  //     // const { isActive } = product;
  //     //const isSuperAdmin = true;

  //     return (
  //       <div>
  //         <div>
  //           <UpdateProductSheet
  //             product={product}
  //             open={showEditSheet}
  //             onOpenChange={setShowEditSheet}
  //             showTrigger={false}
  //           />
  //           <DeactivateProductDialog
  //             product={product}
  //             open={showDeleteDialog}
  //             onOpenChange={setShowDeleteDialog}
  //             showTrigger={false}
  //           />
  //           <ReactivateProductDialog
  //             product={product}
  //             open={showReactivateDialog}
  //             onOpenChange={setShowReactivateDialog}
  //             showTrigger={false}
  //           />
  //         </div>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button
  //               aria-label="Open menu"
  //               variant="ghost"
  //               className="flex size-8 p-0 data-[state=open]:bg-muted"
  //             >
  //               <Ellipsis className="size-4" aria-hidden="true" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end" className="w-40">
  //             {/* <DropdownMenuItem 
  //               onSelect={() => setShowEditSheet(true)}
  //               disabled={!isActive}
  //             >
  //               Editar
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             {isSuperAdmin && (
  //               <DropdownMenuItem
  //                 onSelect={() => setShowReactivateDialog(true)}
  //                 disabled={isActive}
  //               >
  //                 Reactivar
  //                 <DropdownMenuShortcut>
  //                   <RefreshCcwDot className="size-4" aria-hidden="true" />
  //                 </DropdownMenuShortcut>
  //               </DropdownMenuItem>
  //             )}
  //             <DropdownMenuItem
  //               onSelect={() => setShowDeleteDialog(true)}
  //               disabled={!isActive}
  //             >
  //               Eliminar
  //               <DropdownMenuShortcut>
  //                 <Trash className="size-4" aria-hidden="true" />
  //               </DropdownMenuShortcut>
  //             </DropdownMenuItem> */}
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  //   enablePinning: true,
  // },
];
