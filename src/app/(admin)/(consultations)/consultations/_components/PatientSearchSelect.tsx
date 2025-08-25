"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePatientSearch } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import { Badge } from "@/components/ui/badge";
import { IdCard, Loader2, Search, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Patient } from "@/app/(admin)/(patient)/patient/_interfaces/patient.interface";

interface PatientSearchSelectProps {
  value: string;
  onChange: (patientId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  description?: string;
  className?: string;
}

export default function PatientSearchSelect({
  onChange,
  placeholder = "Buscar por DNI (mín. 5 dígitos)",
  disabled = false,
  description,
  className,
}: PatientSearchSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { searchPatientsByDni } = usePatientSearch();

  // Query para buscar pacientes
  const {
    data: patients = [],
    isLoading,
    error,
    isFetched,
  } = searchPatientsByDni(searchTerm);

  // Efectos para manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función para manejar el cambio en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // Abrir dropdown si hay al menos 5 dígitos
    if (newValue.length >= 5) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Función para seleccionar un paciente
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.dni);
    onChange(patient.id);
    setIsOpen(false);
  };

  // Función para limpiar la selección
  const handleClear = () => {
    setSelectedPatient(null);
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
  };

  // Validar si el searchTerm son solo números
  const isValidDni = /^\d*$/.test(searchTerm);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-10 pr-10",
            selectedPatient && "border-green-500 bg-green-50",
            searchTerm.length > 0 && searchTerm.length < 5 && "border-yellow-400",
            searchTerm.length >= 5 && !isValidDni && "border-red-500",
          )}
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Descripción y validaciones */}
      <div className="mt-1 space-y-1">
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        
        {searchTerm.length > 0 && searchTerm.length < 5 && (
          <p className="text-sm text-yellow-600">
            Ingrese al menos 5 dígitos para buscar
          </p>
        )}
        
        {searchTerm.length >= 5 && !isValidDni && (
          <p className="text-sm text-red-600">
            El DNI debe contener solo números
          </p>
        )}

        {selectedPatient && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-700 border-green-300">
              <User className="h-3 w-3 mr-1" />
              {selectedPatient.name} {selectedPatient.lastName}
            </Badge>
          </div>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && searchTerm.length >= 5 && isValidDni && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 border shadow-lg">
          <CardContent className="p-0">
            <ScrollArea className="max-h-60">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-gray-600">Buscando pacientes...</span>
                </div>
              )}

              {error && (
                <div className="p-4 text-sm text-red-600 text-center">
                  Error al buscar pacientes: {error.message}
                </div>
              )}

              {isFetched && !isLoading && !error && (
                <>
                  {patients.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600 text-center">
                      No se encontraron pacientes con DNI: {searchTerm}
                    </div>
                  ) : (
                    <div className="py-1">
                      {patients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => handleSelectPatient(patient)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <IdCard className="h-4 w-4 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">
                                  {patient.dni}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {patient.name} {patient.lastName}
                                </Badge>
                              </div>
                              {patient.email && (
                                <p className="text-xs text-gray-500 truncate">
                                  {patient.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
