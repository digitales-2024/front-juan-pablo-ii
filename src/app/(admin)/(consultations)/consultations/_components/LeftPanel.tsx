import React, { useState } from "react";
import ComboboxSelect from "@/components/ui/combobox-select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, UserPlus } from "lucide-react";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";
import { useServices } from "@/app/(admin)/services/_hooks/useServices";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";

interface LeftPanelProps {
  date: Date;
  time: string;
}

export default function LeftPanel({ date, time }: LeftPanelProps) {
  const [selectedMedico, setSelectedMedico] = useState<string | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<string | null>(null);
  const [selectedSucursal, setSelectedSucursal] = useState<string | null>(null);
  const { staff } = useStaff();
  const { services } = useServices();
  const { branches } = useBranches();

  const ListMedico = staff?.filter(medico => medico.cmp)
    .map(medico => ({
      value: medico.id,
      label: medico.name,
    })) || [];

  const ListServicio = services?.map(servicio => ({
    value: servicio.id,
    label: servicio.name,
  })) || [];

  const ListSucursal = branches?.map(sucursal => ({
    value: sucursal.id,
    label: sucursal.name,
  })) || [];

  return (
    <div className="flex gap-4">
      <div className="gap-2 h-fit">
        <p className="text-gray-12 text-2xl font-bold">Crear una consulta</p>
        <div className="flex text-gray-12">
          <Calendar className="size-4 mr-2" />
          <div className="flex flex-col text-sm font-semibold">
            <p>
              {format(date, "PPP", { locale: es })} a las {time}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Label
            htmlFor="medico"
            className="flex flex-row items-center mb-4">
            <UserPlus className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Médico
          </Label>
          <ComboboxSelect
            options={ListMedico}
            value={selectedMedico ?? ""}
            onChange={(value) => setSelectedMedico(value)}
            description="Seleccione un medico que realizará la consulta"
            placeholder="Selecciona un medico"
          />
        </div>
        <div className="mt-6">
          <Label
            htmlFor="servicio"
            className="flex flex-row items-center mb-4">
            <UserPlus className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Servicios
          </Label>
          <ComboboxSelect
            options={ListServicio}
            value={selectedServicio ?? ""}
            onChange={(value) => setSelectedServicio(value)}
            description="Seleccione un servicio para la consulta"
            placeholder="Selecciona un servicio"
          />
        </div>
        <div className="mt-6">
          <Label
            htmlFor="sucursal"
            className="flex flex-row items-center mb-4">
            <UserPlus className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Sucursal
          </Label>
          <ComboboxSelect
            options={ListSucursal}
            value={selectedSucursal ?? ""}
            onChange={(value) => setSelectedSucursal(value)}
            description="Seleccione una sucursal"
            placeholder="Selecciona una sucursal"
          />
        </div>
      </div>
      <Separator
        orientation="vertical"
        className="h-auto sm:visible invisible"
      />
    </div>
  );
}