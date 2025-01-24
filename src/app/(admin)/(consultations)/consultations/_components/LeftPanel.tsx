import React, { useState } from "react";
import ComboboxSelect from "@/components/ui/combobox-select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, UserPlus } from "lucide-react";

interface LeftPanelProps {
  date: Date;
  time: string;
}

const ListMedico = [
  {
    value: "1",
    label: "Medico 1",
  },
  {
    value: "4",
    label: "Medico 2",
  },
  {
    value: "5",
    label: "Medico 3",
  },
];

export default function LeftPanel({ date, time }: LeftPanelProps) {
  const [selectedMedico, setSelectedMedico] = useState<string | null>(null);

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
            htmlFor="service"
            className="flex flex-row items-center mb-4">
            <UserPlus className="h-4 w-4 mr-2" strokeWidth={1.5}/>
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
      </div>
      <Separator
        orientation="vertical"
        className="h-auto sm:visible invisible"
      />
    </div>
  );
}