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
import { EventFilterParams } from "../../../../_hooks/useEvents";
import { Staff } from "@/app/(admin)/(staff)/staff/_interfaces/staff.interface";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { useStaffSchedules } from "@/app/(admin)/(staff)/staff-schedules/_hooks/useStaffSchedules";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";


export interface EventFiltersProps {
  onFilterChange: (filters: EventFilterParams) => void;
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const queryClient = useQueryClient();
  const { branches } = useBranches();
  const { staff } = useStaff();
  
  const [filters, setFilters] = useState<EventFilterParams>({
      // Valores fijos
      type: "TURNO",
      status: "CONFIRMED"
    });
    
    // Obtener datos de forma más robusta
    const { 
      filteredSchedulesQuery,
      allStaffSchedulesQuery
    } = useStaffSchedules({
      staffId: filters.staffId,
      branchId: filters.branchId
    });
  
  // Combinar queries como en useEvents
  const staffScheduleOptions = useMemo(() => {
    return (filters.staffId || filters.branchId) 
      ? filteredSchedulesQuery.data || []
      : allStaffSchedulesQuery.data || [];
  }, [filteredSchedulesQuery.data, allStaffSchedulesQuery.data, filters.staffId, filters.branchId]);

  const staffOptions = (staff || queryClient.getQueryData<Staff[]>(["staff"]) || []).filter(s => s.isActive);
  const branchOptions = (branches || queryClient.getQueryData<Branch[]>(["branches"]) || []).filter(b => b.isActive);

  // Manejar estado cuando no hay horarios
  // const hasStaffSchedules = staffScheduleOptions && staffScheduleOptions.length > 0;

  useEffect(() => {
    console.log("📢 Filtros actualizados:", filters);
    onFilterChange(filters);
  },[filters]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      staffScheduleId: undefined
    }));
  }, [filters.staffId]);

  // Manejo de cambios similar a useEvents
  const handleFilterChange = (key: keyof EventFilterParams, value: any) => {
    const newValue = value === "todos" ? undefined : value;
    setFilters(prev => ({
      ...prev,
      [key]: newValue
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
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">
          Personal
        </label>
        <Select
          value={filters.staffId || "todos"}
          onValueChange={(value) => handleFilterChange("staffId", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccione un personal" />
          </SelectTrigger>
          {renderSelectContent(staffOptions, "profesionales", "/staff")}
        </Select>
      </div>

      <div>
        <label htmlFor="branchId" className="block text-sm font-medium text-gray-700">
          Sucursal
        </label>
        <Select
          value={filters.branchId || "todos"}
          onValueChange={(value) => handleFilterChange("branchId", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccione una sucursal" />
          </SelectTrigger>
          {renderSelectContent(filteredBranchOptions, "sucursales", "/branches")}
        </Select>
      </div>

      <div>
        <label htmlFor="staffScheduleId" className="block text-sm font-medium text-gray-700">
          Horarios
        </label>
        <Select
          value={filters.staffScheduleId || "todos"}
          onValueChange={(value) => handleFilterChange("staffScheduleId", value)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Seleccione horario" />
          </SelectTrigger>
          {renderSelectContent(
            (staffScheduleOptions || []).map(schedule => ({
              id: schedule.id,
              title: schedule.title,
              staff: schedule.staff
            })), 
            "horarios", 
            "/staff-schedules"
          )}
        </Select>
      </div>
    </div>
  );
}