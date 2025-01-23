"use client";

import React, { useState } from 'react';
import { RegistroPacienteModal } from './_components/RegistroPacienteModal';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PacientesTable } from './_components/pacientes-table';


export default function PatientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (

    <div className="space-y-4">
      <div className="flex justify-between items-center">
      <div>
              <h2 className="text-2xl font-bold tracking-tight">
              Pacientes
              </h2>
              <p className="text-muted-foreground">
                Lista de pacientes registrados en el sistema.
              </p>
            </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Registrar Paciente
        </Button>
      </div>
      <PacientesTable />
      <RegistroPacienteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}