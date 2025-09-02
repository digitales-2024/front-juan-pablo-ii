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
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth"; // Importar hook de autenticación
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EventFilterParams } from "../../../../_actions/event.actions";
import { format, endOfMonth } from "date-fns";

export interface EventFiltersProps {
  onFilterChange: (filters: EventFilterParams) => void;
  currentDate: Date;
}

export function EventFilters({
  onFilterChange,
  currentDate,
}: EventFiltersProps) {
  const queryClient = useQueryClient();
  const { branches } = useBranches();
  const { staff } = useStaff();
  
  // Hook de autenticación
  const { user } = useAuth();

  const [filter, setFilter] = useState<
    Omit<EventFilterParams, "type" | "status">
  >({
    startDate: format(currentDate, "yyyy-MM-01"),
    endDate: format(endOfMonth(currentDate), "yyyy-MM-dd"),
  });

  // Obtener datos de forma más robusta
  const { filteredSchedulesQuery, allStaffSchedulesQuery } = useStaffSchedules({
    staffId: filter.staffId,
    branchId: filter.branchId,
  });

  // Combinar queries como en useEvents
  const staffScheduleOptions = useMemo(() => {
    return filter.staffId || filter.branchId
      ? filteredSchedulesQuery.data ?? []
      : allStaffSchedulesQuery.data ?? [];
  }, [
    filteredSchedulesQuery.data,
    allStaffSchedulesQuery.data,
    filter.staffId,
    filter.branchId,
  ]);

  const allStaffOptions = (
    staff ??
    queryClient.getQueryData<Staff[]>(["staff"]) ??
    []
  ).filter((s) => s.isActive);

  // Filtrar solo personal con CMP
  const staffOptions = useMemo(() => {
    return allStaffOptions.filter(
      (staff) => staff.cmp && staff.cmp.trim() !== ""
    );
  }, [allStaffOptions]);

  const branchOptions = (
    branches ??
    queryClient.getQueryData<Branch[]>(["branches"]) ??
    []
  ).filter((b) => b.isActive);

  // Detectar si el usuario logueado es personal médico
  const loggedStaff = useMemo(() => {
    if (!user?.id || !staffOptions.length) return null;
    
    // Buscar por userId (relación correcta desde el backend)
    const staffByUserId = staffOptions.find(staff => staff.userId === user.id);
    
    if (staffByUserId) {
      return staffByUserId;
    }
    
    // Fallback: buscar por email como segunda opción
    const staffByEmail = staffOptions.find(staff => staff.email === user.email);
    
    if (staffByEmail) {
      console.warn("⚠️ [Staff] Usuario encontrado por email en lugar de userId. Considere revisar la relación en la base de datos.");
      return staffByEmail;
    }
    
    return null;
  }, [user?.id, user?.email, staffOptions]);

  const isMedicalStaff = Boolean(loggedStaff?.cmp);

  // Auto-seleccionar personal médico cuando se carga el componente
  useEffect(() => {
    if (isMedicalStaff && loggedStaff && !filter.staffId) {
      console.log("🏥 Personal médico auto-seleccionado:", loggedStaff.name);
      setFilter(prev => ({
        ...prev,
        staffId: loggedStaff.id
      }));
    }
  }, [isMedicalStaff, loggedStaff, filter.staffId, setFilter]);

  // Manejar estado cuando no hay horarios
  // const hasStaffSchedules = staffScheduleOptions && staffScheduleOptions.length > 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      void queryClient.invalidateQueries({
        queryKey: ["calendar-turns"],
        exact: false,
      });
      onFilterChange({
        ...filter,
        type: "TURNO" as const,
        status: "CONFIRMED" as const,
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [filter, queryClient, onFilterChange]);

  const handleFilterChange = (key: keyof EventFilterParams, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value === "todos" ? undefined : value,
    }));
  };

  // Eliminar el filtro de sucursales y usar todas las opciones

  // Patrón reusable para manejar opciones vacías
  const renderSelectContent = (
    options: {
      id: string;
      name?: string;
      lastName?: string;
      title?: string;
      staffScheduleId?: string;
      staff?: {
        name?: string;
        lastName?: string;
      };
    }[],
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
              `${(option.name ?? "").toUpperCase()} - ${(
                option.lastName ?? ""
              ).toUpperCase()}`}

            {/* Para sucursales: */}
            {option.title && (option.title ?? "").toUpperCase()}

            {/* Para horarios: */}
            {option.staffScheduleId &&
              `${option.title} - ${option.staff?.name?.toUpperCase() ?? ""} ${
                option.staff?.lastName?.toUpperCase() ?? ""
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
              Horario del personal Medico
             </Label>
            <Select
              value={filter.staffId ?? "todos"}
              onValueChange={(value) => {
                // Si es personal médico, no permitir cambios
                if (isMedicalStaff) return;
                handleFilterChange("staffId", value);
              }}
              disabled={isMedicalStaff}
            >
              <SelectTrigger className={`w-full bg-background border-input hover:bg-accent hover:text-accent-foreground ${isMedicalStaff ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <SelectValue placeholder={isMedicalStaff ? `${loggedStaff?.name?.toUpperCase()} ${loggedStaff?.lastName?.toUpperCase()}` : "Seleccione un personal"} />
              </SelectTrigger>
              {isMedicalStaff ? (
                <SelectContent>
                  <SelectItem value={loggedStaff?.id ?? "todos"}>
                    {loggedStaff?.name?.toUpperCase()} - {loggedStaff?.lastName?.toUpperCase()}
                  </SelectItem>
                </SelectContent>
              ) : (
                renderSelectContent(staffOptions, "profesionales", "/staff")
              )}
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="branchId"
              className="text-sm font-medium text-foreground"
            >
              Horarios por Sucursales
            </Label>
            <Select
              value={filter.branchId ?? "todos"}
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
              htmlFor="staffScheduleId"
              className={`text-sm font-medium text-foreground ${isMedicalStaff ? 'opacity-60' : ''}`}
            >
              Todos los horarios del personal
            </Label>
            <Select
              value={filter.staffScheduleId ?? "todos"}
              onValueChange={(value) => {
                // Si es personal médico, no permitir cambios
                if (isMedicalStaff) return;
                handleFilterChange("staffScheduleId", value);
              }}
              disabled={isMedicalStaff}
            >
              <SelectTrigger className={`w-full bg-background border-input hover:bg-accent hover:text-accent-foreground ${isMedicalStaff ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <SelectValue placeholder={isMedicalStaff ? "Solo sus horarios" : "Seleccione horario"} />
              </SelectTrigger>
              {isMedicalStaff ? (
                <SelectContent>
                  <div className="p-2 text-sm text-muted-foreground">
                    Solo puede ver sus propios horarios
                  </div>
                </SelectContent>
              ) : (
                renderSelectContent(
                  (staffScheduleOptions ?? []).map((schedule) => ({
                    id: schedule.id,
                    title: schedule.title,
                    staff: schedule.staff,
                  })),
                  "horarios",
                  "/staff-schedules"
                )
              )}
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
