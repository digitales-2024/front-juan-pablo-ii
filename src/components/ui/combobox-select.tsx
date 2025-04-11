"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@/components/ui/combobox/";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Option {
  value: string;
  label: string;
  labelWithIcon?: ReactNode; // Nueva propiedad opcional para etiquetas con iconos
}

interface ComboboxSelectProps {
  options: Option[];
  value: string;
  onChange?: (value: string | null) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export default function ComboboxSelect({
  options,
  value,
  onChange,
  label,
  description,
  placeholder = "Seleccionar opción",
  className,
  error,
  disabled,
}: ComboboxSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Combobox value={value} onValueChange={onChange}>
        <ComboboxInput placeholder={placeholder} disabled={disabled} />
        <ComboboxContent>
          {options.map((option) => (
            <ComboboxItem
              key={option.value}
              value={option.value}
              label={option.label}
            >
              {/* Usar labelWithIcon si existe, o label si no */}
              {option.labelWithIcon || option.label}
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </Combobox>
      {description && (
        <p className="text-[0.8rem] text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-[0.8rem] text-destructive">{error}</p>}
    </div>
  );
}

export type { Option, ComboboxSelectProps };
