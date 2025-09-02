"use client";

import React from "react";
import ComboboxSelect from "@/components/ui/combobox-select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  labelWithIcon?: React.ReactNode;
}

interface ClearableComboboxProps {
  value: string;
  onChange: (value: string | null) => void;
  options: Option[];
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  showClearButton?: boolean;
  clearOnClick?: boolean; // Nueva prop para activar/desactivar el comportamiento
}

export default function ClearableCombobox({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  description,
  disabled = false,
  className,
  showClearButton = true,
  clearOnClick = true, // Por defecto activado
}: ClearableComboboxProps) {
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleComboboxClick = () => {
    // Si hay un valor seleccionado y clearOnClick está activado, limpiar
    if (clearOnClick && value && value.trim() !== "" && !disabled) {
      onChange(null);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div onClick={handleComboboxClick}>
        <ComboboxSelect
          value={value}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          description={description}
          disabled={disabled}
        />
      </div>
      
      {/* Botón de limpiar */}
      {showClearButton && value && value.trim() !== "" && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-6 top-1 h-8 w-8 p-0 z-10 
                     hover:bg-red-50 flex items-center justify-center rounded-full"
          title="Limpiar selección"
        >
          <X className="h-4 w-4 text-red-500 hover:text-red-700" />
        </Button>
      )}
    </div>
  );
}
