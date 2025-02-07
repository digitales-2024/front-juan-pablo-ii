"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Category } from "../_interfaces/category.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { UpdateCategorySheet } from "./UpdateCategorySheet";
import { Button } from "@/components/ui/button";
import { Ellipsis, RefreshCcwDot, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { ReactivateCategoryDialog } from "./ReactivateCategoryDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DeactivateCategoryDialog } from "./DeactivateCategoryDialog";

export const columns: ColumnDef<Category>[] = [
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
    meta: { title: "Nombre" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "description",
    meta: { title: "Descripción" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
  },
  {
    accessorKey: "isActive",
    meta: { title: "Estado" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "success" : "destructive"}>
        {row.original.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { title: "Fecha de creación" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "PPp", { locale: es }),
  },
  {
    id: "Acciones",
    accessorKey: "actions",
    size: 10,
    meta: { title: "Acciones" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: function Cell({ row }) {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      const [showEditSheet, setShowEditSheet] = useState(false);
      const category = row.original;
      const { isActive } = category;
      const isSuperAdmin = true;

      return (
        <div>
          <div>
            <UpdateCategorySheet
              category={category}
              open={showEditSheet}
              onOpenChange={setShowEditSheet}
              showTrigger={false}
            />
            <DeactivateCategoryDialog
              category={category}
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              showTrigger={false}
            />
            <ReactivateCategoryDialog
              category={category}
              open={showReactivateDialog}
              onOpenChange={setShowReactivateDialog}
              showTrigger={false}
            />
          </div>
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
            <DropdownMenuContent align="end" className="w-40">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
];
