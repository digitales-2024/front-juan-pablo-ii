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
import { EventFilterParams } from "../../../../_actions/event.actions";
import { getEventQueryKey } from "../../../../_hooks/useEventQueryKey";
import { format, endOfMonth } from "date-fns";

export interface EventFiltersProps {
  onFilterChange: (filters: EventFilterParams) => void;
  currentDate: Date;
}

export function EventFilters({ onFilterChange, currentDate }: EventFiltersProps) {
  const queryClient = useQueryClient();
  const { branches } = useBranches();
  const { staff } = useStaff();

  const [filter, setFilter] = useState<Omit<EventFilterParams, 'type' | 'status'>>({
    startDate: format(currentDate, "yyyy-MM-01"),
    endDate: format(endOfMonth(currentDate), "yyyy-MM-dd")
  });

  // Obtener datos de forma más robusta
  const {
    filteredSchedulesQuery,
    allStaffSchedulesQuery
  } = useStaffSchedules({
    staffId: filter.staffId,
    branchId: filter.branchId
  });

  // Combinar queries como en useEvents
  const staffScheduleOptions = useMemo(() => {
    return (filter.staffId || filter.branchId)
      ? filteredSchedulesQuery.data || []
      : allStaffSchedulesQuery.data || [];
  }, [filteredSchedulesQuery.data, allStaffSchedulesQuery.data, filter.staffId, filter.branchId]);

  const staffOptions = (staff || queryClient.getQueryData<Staff[]>(["staff"]) || []).filter(s => s.isActive);
  const branchOptions = (branches || queryClient.getQueryData<Branch[]>(["branches"]) || []).filter(b => b.isActive);

  // Manejar estado cuando no hay horarios
  // const hasStaffSchedules = staffScheduleOptions && staffScheduleOptions.length > 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ['calendar-turns'],
        exact: false
      });
      onFilterChange({
        ...filter,
        type: 'TURNO' as const,
        status: 'CONFIRMED' as const
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [filter, queryClient]);

  const handleFilterChange = (key: keyof EventFilterParams, value: string) => {
    console.log('🔎 [Filtros] Cambio detectado:', { key, value });
    setFilter(prev => ({
      ...prev,
      [key]: value === 'todos' ? undefined : value
    }));
  };

  // Eliminar el filtro de sucursales y usar todas las opciones
  const filteredBranchOptions = branchOptions;

  // Patrón reusable para manejar opciones vacías
  const renderSelectContent = (options: any[], resourceName: string, createPath: string) => {
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
            {option.name && `${(option.name || '').toUpperCase()} - ${(option.lastName || '').toUpperCase()}`}

            {/* Para sucursales: */}
            {option.title && (option.title || '').toUpperCase()}

            {/* Para horarios: */}
            {option.staffScheduleId &&
              `${option.title} - ${option.staff?.name?.toUpperCase() || ''} ${option.staff?.lastName?.toUpperCase() || ''}`
            }
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
            <Label htmlFor="staffId" className="text-sm font-medium text-foreground">
              Personal
            </Label>
            <Select value={filter.staffId || "todos"} onValueChange={(value) => handleFilterChange("staffId", value)}>
              <SelectTrigger className="w-full bg-background border-input hover:bg-accent hover:text-accent-foreground">
                <SelectValue placeholder="Seleccione un personal" />
              </SelectTrigger>
              {renderSelectContent(staffOptions, "profesionales", "/staff")}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchId" className="text-sm font-medium text-foreground">
              Sucursal
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
            <Label htmlFor="staffScheduleId" className="text-sm font-medium text-foreground">
              Horarios
            </Label>
            <Select
              value={filter.staffScheduleId || "todos"}
              onValueChange={(value) => handleFilterChange("staffScheduleId", value)}
            >
              <SelectTrigger className="w-full bg-background border-input hover:bg-accent hover:text-accent-foreground">
                <SelectValue placeholder="Seleccione horario" />
              </SelectTrigger>
              {renderSelectContent(
                (staffScheduleOptions || []).map((schedule) => ({
                  id: schedule.id,
                  title: schedule.title,
                  staff: schedule.staff,
                })),
                "horarios",
                "/staff-schedules",
              )}
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}