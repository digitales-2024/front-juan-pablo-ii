"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Button } from "@/components/ui/button";
// import { Ellipsis, RefreshCcwDot, TableProperties, Trash } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useState } from "react";
// import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
// import { ReactivateIncomingDialog } from "./ReactivateIncomingDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowBigRightDash, Check, PackageOpen } from "lucide-react";
import {
  OutgoingProducStockForm,
  OutgoingProductStock,
} from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import Image from "next/image";

// [
//     {
//       "id": "string",
//       "name": "string",
//       "precio": 0,
//       "codigoProducto": "string",
//       "unidadMedida": "string",
//       "Stock": [
//         {
//           "stock": 0,
//           "isActive": true,
//           "Storage": {
//             "name": "string"
//           }
//         }
//       ]
//     }
//   ]
export const columns: ColumnDef<OutgoingProducStockForm>[] = [
  //   {
  //     accessorKey: "id",
  //     id: "Número de Movimiento",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Número de Movimiento" />
  //     ),
  //   },
  {
    id: "select",
    size: 10,
    header: ({ column }) => (
      <div className="px-2 flex space-x-2 items-center">
        {/* <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5 animate-pulse size-6"
            /> */}
        <DataTableColumnHeader column={column} title="Selec." />
        <Check className="size-4"></Check>
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5 animate-pulse size-6"
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
      title: "Nombre",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "codigoProducto",
    meta: {
      title: "Código",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
    ),
    cell: ({ row }) => <span>{row.original.codigoProducto ?? ""}</span>,
  },
  {
    accessorKey: "unidadMedida",
    meta: {
      title: "Medida",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medida" />
    ),
    cell: ({ row }) => <span>{row.original.unidadMedida ?? ""}</span>,
  },
  //Probablemente lo saquemos
  //   {
  //     accessorKey: "precio",
  //     meta: {
  //       title: "Precio",
  //     },
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Precio" />
  //     ),
  //     cell: ({ row }) => (
  //       <span>
  //         {row.original.precio.toLocaleString("es-PE", {
  //           style: "currency",
  //           currency: "PEN",
  //         })}
  //       </span>
  //     ),
  //   },
  // {
  //     accessorKey: "categoria.name",
  //     meta:{
  //         title: "Categoría"
  //     },
  //     header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Categoría" />
  //     ),
  //     cell: ({ row }) => (
  //     <span>
  //         {row.original.categoria.name}
  //         {/* {row.original.Producto.unidadMedida?? ""} */}
  //     </span>
  //     ),
  // },
  {
    accessorKey: "Stock.stock",
    meta: {
      title: "Stock Total",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock Total" />
    ),
    cell: ({ row }) => {
      const stock = row.original.Stock;
      const totalStock =
        stock.length === 0
          ? 0
          : stock.reduce((acc, stock) => acc + stock.stock, 0);
      return (
        <span>
          {totalStock}
          {/* {row.original.Producto.unidadMedida?? ""} */}
        </span>
      );
    },
  },
  // {
  //     accessorKey: "tipoProducto.name",
  //     meta:{
  //         title: "Subcategoría"
  //     },
  //     header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Subcategoría" />
  //     ),
  //     cell: ({ row }) => (
  //     <span>
  //         {row.original.tipoProducto.name}
  //         </span>
  //     ),
  // }
  {
    accessorKey: "storageId",
    meta: {
      title: "Almacénes",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Almacénes" />
    ),
    cell: ({ row }) => {
        
      return (
        <div>
          <Select
            onValueChange={(value) => {
              row;
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ver almacenes" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="max-h-40">
                {row.original.Stock.length === 0 ? (
                  <SelectGroup>
                    <SelectLabel>No existe stock en ningún almacén</SelectLabel>
                  </SelectGroup>
                ) : (
                  <SelectGroup>
                    <SelectLabel>Almacenes disponibles</SelectLabel>
                    {row.original.Stock.map((stock, idx) => (
                      <SelectItem key={idx} value={stock.Storage.name}>
                        <div className="grid grid-cols-2 gap-2">
                          <span>{stock.Storage.name}</span>
                          <span>{stock.stock}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </ScrollArea>
            </SelectContent>
          </Select>
          {/* <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="max-w-36 h-fit text-wrap">
                    <PackageOpen className="text-primary"></PackageOpen>
                    Ver almacenes
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Disponibilidad en almacenes
                    </h4>
                    {
                      row.original.Stock.length===0 && <p className="text-sm text-muted-foreground">
                        No existe stock en ningun almacén
                      </p>
                    }
                  </div>
                    <ScrollArea className="max-h-40 h-fit overflow-auto">
                        <div className="grid gap-2">
                            {row.original.Stock.map((stock, idx) => (
                            <div key={idx} className="grid grid-cols-3 gap-2">
                                <div className="w-full"><span className="w-full overflow-hidden text-wrap text-ellipsis">{stock.Storage.name}</span></div>
                                <div className="flex justify-center"><ArrowBigRightDash></ArrowBigRightDash></div>
                                <span>{stock.stock}</span>
                            </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
              </PopoverContent>
            </Popover> */}
        </div>
      );
    },
  },
];
