"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface DateRangeFilterProps {
  startDate: string | null;
  endDate: string | null;
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onDateRangeChange,
  onClear,
  disabled = false,
}: DateRangeFilterProps) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const startDateObj = startDate ? new Date(startDate + 'T12:00:00-05:00') : undefined;
  const endDateObj = endDate ? new Date(endDate + 'T12:00:00-05:00') : undefined;

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      // Para zona horaria de Lima, Perú (UTC-5), usar directamente la fecha seleccionada
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      console.log(`📅 Fecha de inicio seleccionada: ${dateString} (fecha original: ${date.toISOString()})`);
      
      onDateRangeChange(dateString, endDate);
      setIsStartOpen(false);
      
      // Si la fecha de fin es anterior a la de inicio, limpiarla
      if (endDate && new Date(endDate + 'T12:00:00-05:00') < date) {
        console.log(`🔄 Limpiando fecha de fin porque es anterior a la nueva fecha de inicio`);
        onDateRangeChange(dateString, null);
      }
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      // Para zona horaria de Lima, Perú (UTC-5), usar directamente la fecha seleccionada
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      console.log(`📅 Fecha de fin seleccionada: ${dateString} (fecha original: ${date.toISOString()})`);
      
      onDateRangeChange(startDate, dateString);
      setIsEndOpen(false);
    }
  };

  const hasDateRange = startDate && endDate;
  const isValidRange = startDate && endDate && new Date(startDate + 'T12:00:00-05:00') <= new Date(endDate + 'T12:00:00-05:00');

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <div className="flex gap-2 items-center">
        {/* Selector de fecha de inicio */}
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[150px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(new Date(startDate + 'T12:00:00-05:00'), "dd/MM/yyyy", { locale: es })
              ) : (
                "Fecha inicio"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDateObj}
              onSelect={handleStartDateSelect}
              disabled={false} // Permitir todas las fechas
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>

        <span className="text-sm text-muted-foreground">a</span>

        {/* Selector de fecha de fin */}
        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[150px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled || !startDate}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(new Date(endDate + 'T12:00:00-05:00'), "dd/MM/yyyy", { locale: es })
              ) : (
                "Fecha fin"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDateObj}
              onSelect={handleEndDateSelect}
              disabled={(date) => {
                // Solo deshabilitar fechas anteriores a la fecha de inicio
                const startDateObj = startDate ? new Date(startDate + 'T12:00:00-05:00') : null;
                return !!(startDateObj && date < startDateObj);
              }}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>

        {/* Botón para limpiar filtro */}
        {hasDateRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={disabled}
            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Limpiar filtro de fechas</span>
          </Button>
        )}
      </div>

      {/* Badge que muestra el rango seleccionado */}
      {isValidRange && (
        <Badge variant="secondary" className="text-xs">
          📅 {format(new Date(startDate + 'T12:00:00-05:00'), "dd/MM", { locale: es })} - {format(new Date(endDate + 'T12:00:00-05:00'), "dd/MM", { locale: es })}
        </Badge>
      )}

      {/* Mensaje informativo si no hay fechas seleccionadas */}
      {!startDate && !endDate && (
        <Badge variant="outline" className="text-xs">
          💡 Selecciona fechas de inicio y fin para filtrar citas
        </Badge>
      )}

      {/* Mensaje si solo hay fecha de inicio */}
      {startDate && !endDate && (
        <Badge variant="outline" className="text-xs">
          ⏳ Selecciona la fecha de fin para completar el filtro
        </Badge>
      )}

      {/* Mensaje de error si el rango no es válido */}
      {hasDateRange && !isValidRange && (
        <Badge variant="destructive" className="text-xs">
          Rango de fechas inválido
        </Badge>
      )}
    </div>
  );
}
