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
import { Check, PackageOpen } from "lucide-react";
import {
  OutgoingProducStockForm,
} from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    size: 5,
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
      title: "Stock por almacén",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock por almacén" />
    ),
    cell: ({ row }) => {
        // const { updateProductStock } =  useUpdateProductStock();
      return (
        <div>
          {/* <Select
            onValueChange={(value) => {
              updateProductStock({
                productId: row.original.id,
                storageId: value,
              })
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar almacén" />
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
                      <SelectItem key={idx} value={stock.Storage.id}>
                        <div className="grid grid-cols-2 gap-2">
                          <span>{stock.Storage.name+` (${stock.stock})`}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </ScrollArea>
            </SelectContent>
          </Select> */}
          <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="max-w-36 h-fit text-wrap">
                    <PackageOpen className="text-primary"></PackageOpen>
                    Ver stock actual
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
                        <div className="rounded-md border">
                          <Table>
                          <TableHeader>
                            <TableRow>
                            <TableHead>Almacén</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {row.original.Stock.map((stock, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">
                              {stock.Storage.name}
                              </TableCell>
                              <TableCell className="text-right text-primary font-bold">
                              {stock.stock}
                              </TableCell>
                            </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </div>
                    </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
        </div>
      );
    },
  },
  {
    accessorKey: "Stock.stock",
    meta: {
      title: "Stock General",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Suma Total de Stock" />
    ),
    cell: ({ row }) => {
      const stock = row.original.Stock;
      const totalStock =
        stock.length === 0
          ? 0
          : stock.reduce((acc, stock) => acc + stock.stock, 0);
      return (
        <span className="block text-center w-full">
          {totalStock}
          {/* {row.original.Producto.unidadMedida?? ""} */}
        </span>
      );
    },
  },
];
