// src/app/(admin)/(staff)/staff-schedules/_components/StaffSchedulesTableColumns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { StaffSchedule } from "../_interfaces/staff-schedules.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { PencilIcon, BanIcon, ActivityIcon } from "lucide-react";
import { UpdateStaffScheduleSheet } from "./UpdateStaffScheduleSheet";
import { DeleteStaffScheduleDialog } from "./DeactivateStaffScheduleDialog";
import { ReactivateStaffScheduleDialog } from "./ReactivateStaffScheduleDialog";

export const columns: ColumnDef<StaffSchedule>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
  },
  {
    accessorKey: "staff.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personal" />
    ),
    cell: ({ row }) => `${row.original.staff?.name} ${row.original.staff?.lastName}`,
  },
  {
    accessorKey: "daysOfWeek",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Días" />
    ),
    cell: ({ row }) => row.original.daysOfWeek
      .map(day => {
        const daysMap = {
          MONDAY: "Lun",
          TUESDAY: "Mar",
          WEDNESDAY: "Mié",
          THURSDAY: "Jue",
          FRIDAY: "Vie",
          SATURDAY: "Sáb",
          SUNDAY: "Dom"
        };
        return daysMap[day] || day;
      }).join(", "),
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inicio" />
    ),
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fin" />
    ),
  },
  {
    accessorKey: "recurrence",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recurrencia" />
    ),
    cell: ({ row }) => {
      const recurrence = row.original.recurrence;
      const frequencyMap = {
        DAILY: "Diaria",
        WEEKLY: "Semanal",
        MONTHLY: "Mensual",
        YEARLY: "Anual"
      };
      const frequency = recurrence.frequency as "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
      const intervalText = {
        DAILY: { singular: "día", plural: "días" },
        WEEKLY: { singular: "semana", plural: "semanas" },
        MONTHLY: { singular: "mes", plural: "meses" },
        YEARLY: { singular: "año", plural: "años" }
      }[frequency];
      return `${frequencyMap[frequency]} cada ${recurrence.interval} ${recurrence.interval === 1 ? intervalText.singular : intervalText.plural}`;
    },
  },
  {
    accessorKey: "recurrence.until",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Válido hasta" />
    ),
    cell: ({ row }) => format(new Date(row.original.recurrence.until), "PP", { locale: es }),
  },
  {
    accessorKey: "isActive",
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPp", { locale: es }),
  },
  {
    accessorKey: "exceptions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Excepciones" />
    ),
    cell: ({ row }) => row.original.exceptions
      .map(date => format(new Date(date), "dd/MM/yyyy", { locale: es }))
      .join(", ") || "Sin excepciones",
  },
  {
    id: "Acciones",
    size: 10,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: function Cell({ row }) {
      const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
      const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      const [showEditSheet, setShowEditSheet] = useState(false);
      const schedule = row.original;
      const isActive = schedule.isActive;

      return (
        <div>
          <UpdateStaffScheduleSheet
            schedule={schedule}
            open={showEditSheet}
            onOpenChange={setShowEditSheet}
            showTrigger={false}
          />
          {isActive ? (
            <DeleteStaffScheduleDialog
              schedule={schedule}
              open={showDeactivateDialog}
              onOpenChange={setShowDeactivateDialog}
              showTrigger={false}
            />
          ) : (
            <ReactivateStaffScheduleDialog
              schedule={schedule}
              open={showReactivateDialog}
              onOpenChange={setShowReactivateDialog}
              showTrigger={false}
            />
          )}
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
                <DropdownMenuShortcut>
                  <PencilIcon className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isActive ? (
                <DropdownMenuItem
                  onSelect={() => setShowDeactivateDialog(true)}
                  className="text-destructive"
                >
                  Eliminar
                  <DropdownMenuShortcut>
                    <BanIcon className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={() => setShowReactivateDialog(true)}
                  className="text-green-600"
                >
                  Reactivar
                  <DropdownMenuShortcut>
                    <ActivityIcon className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
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