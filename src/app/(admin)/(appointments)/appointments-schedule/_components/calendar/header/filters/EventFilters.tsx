"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Branch } from "@/app/(admin)/branches/_interfaces/branch.interface";
import { Staff } from "@/app/(admin)/(staff)/staff/_interfaces/staff.interface";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { useStaffSchedules } from "@/app/(admin)/(staff)/staff-schedules/_hooks/useStaffSchedules";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format, endOfMonth } from "date-fns";
import { EventFilterParams } from "@/app/(admin)/(staff)/schedules/_actions/event.actions";
import { appointmentStatusEnumOptions } from "@/app/(admin)/(appointments)/appointments/_interfaces/appointments.interface";

interface EventFiltersProps {
  appliedFilters: EventFilterParams;
  onFilterChange: (newFilters: Partial<EventFilterParams>) => void;
  currentDate: Date;
}

export function EventFilters({
  appliedFilters,
  onFilterChange,
  currentDate,
}: EventFiltersProps) {
  const queryClient = useQueryClient();
  const { branches } = useBranches();
  const { staff } = useStaff();

  const [filter, setFilter] = useState<Omit<EventFilterParams, "type">>({
    startDate: format(currentDate, "yyyy-MM-01"),
    endDate: format(endOfMonth(currentDate), "yyyy-MM-dd"),
    staffScheduleId: undefined,
    status: appliedFilters.status,
  });

  // Filtrar para obtener solo personal con CMP
  const staffOptions = useMemo(() => {
    const allActiveStaff = (
      staff ||
      queryClient.getQueryData<Staff[]>(["staff"]) ||
      []
    ).filter((s) => s.isActive);

    // Filtrar solo los que tienen valor en CMP
    return allActiveStaff.filter(
      (staff) => staff.cmp && staff.cmp.trim() !== ""
    );
  }, [staff, queryClient]);

  const branchOptions = (
    branches ||
    queryClient.getQueryData<Branch[]>(["branches"]) ||
    []
  ).filter((b) => b.isActive);

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        ...filter,
        type: "CITA" as const,
      } as EventFilterParams);
    }, 300);

    return () => clearTimeout(handler);
  }, [filter, onFilterChange]);

  const handleFilterChange = (key: keyof EventFilterParams, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value === "todos" ? undefined : value,
    }));
  };

  // Patrón reusable para manejar opciones vacías
  const renderSelectContent = (
    options: any[],
    resourceName: string,
    createPath: string
  ) => {
    if (options.length === 0) {
      return (
        <SelectContent>
          <div className="p-2 text-sm text-muted-foreground">
            No hay {resourceName}.{" "}
            <a href={createPath} className="text-primary underline">
              Crear {resourceName}
            </a>
          </div>
        </SelectContent>
      );
    }

    return (
      <SelectContent>
        <SelectItem value="todos">Todos los {resourceName}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {/* Para personal: */}
            {option.name &&
              `${(option.name || "").toUpperCase()} - ${(
                option.lastName || ""
              ).toUpperCase()}`}

            {/* Para sucursales: */}
            {option.title && (option.title || "").toUpperCase()}

            {/* Para horarios: */}
            {option.staffScheduleId &&
              `${option.title} - ${option.staff?.name?.toUpperCase() || ""} ${
                option.staff?.lastName?.toUpperCase() || ""
              }`}
          </SelectItem>
        ))}
      </SelectContent>
    );
  };

  return (
    <Card className="w-full bg-background shadow-md">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="staffId"
              className="text-sm font-medium text-foreground"
            >
              Citas asignadas a el personal medico
            </Label>
            <Select
              value={filter.staffId || "todos"}
              onValueChange={(value) => handleFilterChange("staffId", value)}
            >
              <SelectTrigger className="w-full bg-background border-input hover:bg-accent hover:text-accent-foreground">
                <SelectValue placeholder="Seleccione un personal" />
              </SelectTrigger>
              {renderSelectContent(staffOptions, "profesionales", "/staff")}
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="branchId"
              className="text-sm font-medium text-foreground"
            >
              Citas registradas por Sucursal
            </Label>
            <Select
              value={filter.branchId || "todos"}
              onValueChange={(value) => handleFilterChange("branchId", value)}
            >
              <SelectTrigger className="w-full bg-background border-input hover:bg-accent hover:text-accent-foreground">
                <SelectValue placeholder="Seleccione una sucursal" />
              </SelectTrigger>
              {renderSelectContent(branchOptions, "sucursales", "/branches")}
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="status"
              className="text-sm font-medium text-foreground"
            >
              Estado de cita
            </Label>
            <Select
              value={filter.status || "todos"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full bg-background border-input hover:bg-accent hover:text-accent-foreground">
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                <SelectItem value="NO_SHOW">No asistió</SelectItem>
                <SelectItem value="RESCHEDULED">Reprogramada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
