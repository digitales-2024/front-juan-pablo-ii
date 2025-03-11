"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import {
  AppointmentResponse,
  AppointmentStatus,
  orderTypeConfig,
} from "../_interfaces/apoointments-medical.inteface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  ClipboardCheck,
  X,
  UserRound,
  Stethoscope,
  CalendarDays,
  Calendar,
  FileText,
  ClipboardPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

// Estilos comunes para celdas con fondo de color - Intercambiamos los colores de paciente y servicio
const cellBgStyles = {
  patient: "bg-emerald-50 text-emerald-800 rounded-md px-2 py-1",  // Verde (antes en servicio)
  service: "bg-purple-50 text-purple-800 rounded-md px-2 py-1",    // Morado (antes en paciente)
  start: "bg-blue-50 text-blue-800 rounded-md px-2 py-1",
  end: "bg-cyan-50 text-cyan-800 rounded-md px-2 py-1",
  staff: "bg-amber-50 text-amber-800 rounded-md px-2 py-1",
  branch: "bg-orange-50 text-orange-800 rounded-md px-2 py-1",
};

// Estilo común para los contenedores de celda
const cellContainerClass = "flex justify-center w-full items-center";

// Estilo común para iconos en las celdas
const cellIconClass = "h-4 w-4 mr-2";

// Función para crear títulos con íconos (soluciona el problema de tipos)
const _createColumnTitle = (icon: React.ReactNode, text: string) => {
  // Devolvemos el título como string para evitar el error de tipo
  return text;
};

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
        <DataTableColumnHeader
          column={column}
          title="Paciente"
          className="text-center justify-center flex items-center"
        >
          <div className="flex items-center justify-center w-full">
            <UserRound className="h-4 w-4 mr-1 text-emerald-600" /> {/* Cambiado a emerald */}
            <span>Paciente</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className={cellContainerClass}>
          <div className={cellBgStyles.patient}>
            <div className="flex items-center">
              <UserRound className={cn(cellIconClass, "text-emerald-600")} /> {/* Cambiado a emerald */}
              <span>{row.original.patient}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "service",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Servicio"
          className="text-center justify-center flex items-center"
        >
          <div className="flex items-center justify-center w-full">
            <Stethoscope className="h-4 w-4 mr-1 text-purple-600" /> {/* Cambiado a purple */}
            <span>Servicio</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className={cellContainerClass}>
          <div className={cellBgStyles.service}>
            <div className="flex items-center">
              <Stethoscope className={cn(cellIconClass, "text-purple-600")} /> {/* Cambiado a purple */}
              <span>{row.original.service}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "start",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Inicio"
          className="text-center justify-center flex items-center"
        >
          <div className="flex items-center justify-center w-full">
            <CalendarDays className="h-4 w-4 mr-1 text-blue-600" />
            <span>Inicio</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className={cellContainerClass}>
          <div className={cellBgStyles.start}>
            <div className="flex items-center">
              <CalendarDays className={cn(cellIconClass, "text-blue-600")} />
              <span>
                {format(new Date(row.original.start), "PPp", { locale: es })}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "end",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Fin"
          className="text-center justify-center flex items-center"
        >
          <div className="flex items-center justify-center w-full">
            <Calendar className="h-4 w-4 mr-1 text-cyan-600" />
            <span>Fin</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className={cellContainerClass}>
          <div className={cellBgStyles.end}>
            <div className="flex items-center">
              <Calendar className={cn(cellIconClass, "text-cyan-600")} />
              <span>
                {format(new Date(row.original.end), "PPp", { locale: es })}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Estado"
          className="text-center justify-center flex items-center"
        >
          <div className="flex items-center justify-center w-full">
            <span>Estado</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => {
        // Asegurar que status sea del tipo correcto
        const status = row.original.status as AppointmentStatus;

        // Obtener la configuración para este estado
        const config = orderTypeConfig[status] || orderTypeConfig.CONFIRMED;
        const Icon = config.icon;

        // Estado para mostrar al usuario
        const statusDisplay =
          {
            CONFIRMED: "Confirmada",
            COMPLETED: "Completada",
            NO_SHOW: "No asistió",
          }[status] || "Desconocido";

        return (
          <div className="flex justify-center w-full">
            <Badge
              className={cn(
                config.backgroundColor,
                config.textColor,
                config.hoverBgColor,
                "flex items-center justify-center gap-1 px-2 py-1"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{statusDisplay}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "branch",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Sucursal"
          className="text-center justify-center flex items-center"
        >
          <div className="flex items-center justify-center w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>Sucursal</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className={cellContainerClass}>
          <div className={cellBgStyles.branch}>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn(cellIconClass, "text-orange-600")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>{row.original.branch}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Columnas adicionales para administrativos y super admin
  const additionalColumns: ColumnDef<AppointmentResponse>[] = [
    {
      accessorKey: "staff",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Médico"
          className="text-center justify-center flex items-center"
        >
          <div className="flex items-center justify-center w-full">
            <UserRound className="h-4 w-4 mr-1 text-amber-600" />
            <span>Médico</span>
          </div>
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className={cellContainerClass}>
          <div className={cellBgStyles.staff}>
            <div className="flex items-center">
              <UserRound className={cn(cellIconClass, "text-amber-600")} />
              <span>{row.original.staff}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Mostrar botón de historia médica (para todos los roles)
  const viewHistoryColumn: ColumnDef<AppointmentResponse> = {
    id: "viewHistory",
    meta: { title: "Historia" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Historia"
        className="text-center justify-center flex items-center"
      >
        <div className="flex items-center justify-center w-full">
          <FileText className="h-4 w-4 mr-1 text-sky-600" />
          <span>Historia</span>
        </div>
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => {
      const router = useRouter();
      const medicalHistoryId = row.original.medicalHistoryId;
  
      return (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              router.push(`/update-history/${medicalHistoryId}`);
            }}
            className="flex items-center gap-2 shadow-md bg-sky-500 text-white hover:bg-sky-600 border-0 py-2 px-3 transition-all relative"
            disabled={!medicalHistoryId}
            size="default" // Cambiado de "sm" a "default" para hacerlo más grande
          >
            <ClipboardPlus className="h-5 w-5" /> {/* Icono más grande */}
            <span className="hidden sm:inline font-medium">Historia</span>
            <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
              </svg>
            </span>
          </Button>
        </div>
      );
    },
  };

  // Columna de acciones para cambiar estado (solo para médicos y administrativos)
  const actionColumn: ColumnDef<AppointmentResponse> = {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Acciones"
        className="text-center justify-center flex items-center"
      >
        <div className="flex items-center justify-center w-full">
          <Check className="h-4 w-4 mr-1" />
          <span>Acciones</span>
        </div>
      </DataTableColumnHeader>
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
          <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
            <Badge variant="outline">Finalizada</Badge>
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
              {showStatusButtons ? "Ocultar" : "Actualizar"}
            </Label>
          </div>

          {showStatusButtons && (
            <div className="flex gap-2 mt-1">
              <Button
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={isUpdating}
                className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 hover:text-white"
                size="sm"
                variant="outline"
              >
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Atendido</span>
              </Button>
              <Button
                onClick={() => handleStatusChange("NO_SHOW")}
                disabled={isUpdating}
                className="h-8 px-2 bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1 hover:text-white"
                size="sm"
                variant="outline"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">No asistió</span>
              </Button>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  };

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
