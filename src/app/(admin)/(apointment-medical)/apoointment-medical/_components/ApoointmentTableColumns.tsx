"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { AppointmentResponse } from "../_interfaces/apoointments-medical.inteface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ClipboardPlus, X } from "lucide-react";
/* import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppointment } from "../_hooks/useApointmentMedical";
import { toast } from "sonner";

interface UserRole {
  isSuperAdmin: boolean;
  isDoctor: boolean;
  isReceptionist: boolean;
}

export const getAppointmentColumns = (
  userRole: UserRole,
  userId?: string,
  onRefresh?: () => void
): ColumnDef<AppointmentResponse>[] => {
  const { updateStatusMutation } = useAppointment();

  const baseColumns: ColumnDef<AppointmentResponse>[] = [
    {
      accessorKey: "patient",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paciente" />
      ),
    },
    {
      accessorKey: "service",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Servicio" />
      ),
    },
    {
      accessorKey: "start",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inicio" />
      ),
      cell: ({ row }) => (
        <span>
          {format(new Date(row.original.start), "PPp", { locale: es })}
        </span>
      ),
    },
    {
      accessorKey: "end",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fin" />
      ),
      cell: ({ row }) => (
        <span>{format(new Date(row.original.end), "PPp", { locale: es })}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "success" | "destructive" | "outline" =
          "default";

        switch (status) {
          case "CONFIRMED":
            variant = "outline";
            break;
          case "COMPLETED":
            variant = "success";
            break;
          case "NO_SHOW":
            variant = "destructive";
            break;
        }

        return (
          <Badge variant={variant}>
            {status === "CONFIRMED" && "Confirmada"}
            {status === "COMPLETED" && "Completada"}
            {status === "NO_SHOW" && "No asistió"}
          </Badge>
        );
      },
    },
  ];

  // Mostrar botón de historia médica (para todos los roles)
  const viewHistoryColumn: ColumnDef<AppointmentResponse> = {
    id: "viewHistory",
    meta: { title: "Historia" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Historia" />
    ),
    cell: ({ row }) => {
      const router = useRouter();
      const medicalHistoryId = row.original.medicalHistoryId;
      const _isConfirmed = row.original.status === "CONFIRMED";

      return (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              console.log(`Navigating to /update-history/${medicalHistoryId}`);
              router.push(`/update-history/${medicalHistoryId}`);
            }}
            className="flex items-center gap-2"
            variant="outline"
            disabled={!medicalHistoryId}
          >
            <ClipboardPlus className="h-4 w-4" />
            Visualizar
          </Button>
        </div>
      );
    },
  };

  // Columna de acciones para cambiar estado (solo para médicos y administrativos)
  const actionColumn: ColumnDef<AppointmentResponse> = {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: ({ row }) => {
      const [showStatusButtons, setShowStatusButtons] = useState(false);
      const [isUpdating, setIsUpdating] = useState(false);
      const appointmentId = row.original.id;
      const isConfirmed = row.original.status === "CONFIRMED";

      const handleStatusChange = async (status: "COMPLETED" | "NO_SHOW") => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
          await updateStatusMutation.mutateAsync(
            {
              id: appointmentId,
              data: { status },
            },
            {
              onSuccess: () => {
                toast.success(
                  `Cita marcada como ${
                    status === "COMPLETED" ? "completada" : "no asistida"
                  }`
                );
                // Refrescar los datos
                if (onRefresh) onRefresh();
              },
            }
          );
        } catch (error) {
          toast.error("Error al actualizar el estado de la cita");
          console.error(error);
        } finally {
          setIsUpdating(false);
        }
      };

      // No mostrar acciones si la cita ya no está confirmada
      if (!isConfirmed) {
        return (
          <div className="text-center text-sm text-muted-foreground">
            Finalizada
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id={`show-buttons-${appointmentId}`}
              checked={showStatusButtons}
              onCheckedChange={setShowStatusButtons}
            />
            <Label
              htmlFor={`show-buttons-${appointmentId}`}
              className="text-xs"
            >
              Actualizar estado
            </Label>
          </div>

          {showStatusButtons && (
            <div className="flex gap-2 mt-1">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={isUpdating}
                className="h-8 px-2"
              >
                <Check className="h-4 w-4 mr-1" />
                Completada
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusChange("NO_SHOW")}
                disabled={isUpdating}
                className="h-8 px-2"
              >
                <X className="h-4 w-4 mr-1" />
                No asistió
              </Button>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  };

  // Columnas adicionales para administrativos y super admin
  const additionalColumns: ColumnDef<AppointmentResponse>[] = [
    {
      accessorKey: "staff",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Médico" />
      ),
    },
    {
      accessorKey: "branch",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sucursal" />
      ),
    },
  ];

  // Construir las columnas según el rol
  let columns = [...baseColumns];

  // Agregar columnas adicionales para administrativos y super admin
  if (userRole.isSuperAdmin || userRole.isReceptionist) {
    columns = [...columns, ...additionalColumns];
  }

  // Agregar columna de historia médica para todos
  columns.push(viewHistoryColumn);

  // Agregar columna de acciones solo si es médico o personal de mesón
  if (userRole.isDoctor || userRole.isReceptionist || userRole.isSuperAdmin) {
    columns.push(actionColumn);
  }

  return columns;
};
