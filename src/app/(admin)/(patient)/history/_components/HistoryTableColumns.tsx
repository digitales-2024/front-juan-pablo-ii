"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { MedicalHistory } from "../_interfaces/history.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ellipsis, RefreshCcwDot, Trash, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { ReactivateHistoryDialog } from "./ReactivateHistoryDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DeactivateHistoryDialog } from "./DeactivateHistoryDialog";
//import { useMedicalHistories } from "../_hooks/usehistory";
//import { UpdateHistorySheet } from "../../update-history/_components/UpdateHistorySheet";

export const columns: ColumnDef<MedicalHistory>[] = [
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
  /* {
    id: "update",
    size: 10,
    header: () => <span>Actualizar</span>,
    cell: ({ row }) => {
      const [showEditSheet, setShowEditSheet] = useState(false);
      const history = row.original;
      const { completeMedicalHistoryQuery } = useMedicalHistories();
      const { data: completeHistory, refetch } = completeMedicalHistoryQuery(history.id);

      const handleUpdateClick = async () => {
        try {
          await refetch();
          setShowEditSheet(true);
        } catch (error) {
          console.error("Error fetching complete medical history:", error);
        }
      };

      return (
        <div>
          <UpdateHistorySheet
            history={completeHistory}
            open={showEditSheet}
            onOpenChange={setShowEditSheet}
            showTrigger={false}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={handleUpdateClick}
          >
            <RefreshCcw className="mr-2 size-4" aria-hidden="true" />
            Actualizar
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  }, */
  {
    accessorKey: "fullName",
    meta: {
      title: "Paciente",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paciente" />
    ),
  },
  {
    accessorKey: "description",
    meta: {
      title: "Descripción",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
  },
  {
    accessorKey: "isActive",
    meta: {
      title: "Estado",
    },
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
    accessorKey: "actions",
    meta: {
      title: "Acciones",
    },
    size: 10,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: function Cell({ row }) {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      const history = row.original;
      const { isActive } = history;
      const isSuperAdmin = true;

      return (
        <div>
          <DeactivateHistoryDialog
            history={history}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            showTrigger={false}
          />
          <ReactivateHistoryDialog
            history={history}
            open={showReactivateDialog}
            onOpenChange={setShowReactivateDialog}
            showTrigger={false}
          />
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