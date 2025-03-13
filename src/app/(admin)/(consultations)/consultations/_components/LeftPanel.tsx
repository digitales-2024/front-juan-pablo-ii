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
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import { UseFormReturn } from "react-hook-form";
import { ConsultationSchema } from "../type";
import { FormDescription } from "@/components/ui/form";

interface LeftPanelProps {
  date: Date;
  time: string;
  onStaffChange: (staffId: string) => void;
  onBranchChange: (branchId: string) => void;
  onServiceChange: (serviceId: string) => void;
  onPatientChange: (patientId: string) => void;
  form?: UseFormReturn<ConsultationSchema>;
  notModifyDefaults?: boolean
}

export default function LeftPanel({ date, time, onStaffChange, onBranchChange, onServiceChange, onPatientChange, form, notModifyDefaults }: LeftPanelProps) {
  const isPrescriptionOrderAppointment = form && notModifyDefaults
  const [selectedMedico, setSelectedMedico] = useState<string | null>(
     null
  );
  const [selectedServicio, setSelectedServicio] = useState<string | null>(
    isPrescriptionOrderAppointment ? form.getValues('serviceId') : null
  );
  const [selectedSucursal, setSelectedSucursal] = useState<string | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<string | null>(
    isPrescriptionOrderAppointment ? form.getValues('patientId') : null
  );
  const { staff } = useStaff();
  const { services } = useServices();
  const { branches } = useBranches();
  const { patients } = usePatients();
  // const form = useForm();

  const ListMedico = staff?.filter(medico => medico.cmp)
    .map(medico => ({
      value: medico.id,
      label: medico.name,
    })) ?? [];

  console.log("LeftPanel:", ListMedico);

  const ListServicio = services?.map(servicio => ({
    value: servicio.id,
    label: servicio.name,
  })) ?? [];

  const ListSucursal = branches?.map(sucursal => ({
    value: sucursal.id,
    label: sucursal.name,
  })) ?? [];

  const ListPaciente = patients?.map(paciente => ({
    value: paciente.id,
    label: paciente.name,
  })) ?? [];

  const handleStaffSelect = (value: string | null) => {
    console.group('👨‍⚕️ Staff Selection');
    console.log('Value:', value);
    setSelectedMedico(value);
    if (value) {
        console.log('Updating staff ID');
        onStaffChange(value);
    }
    console.groupEnd();
  };

  const DefaultValueOrderDescription = ()=>{
    const message = "Valor obligatorio para la orden"
    return <FormDescription className="text-primary/80">
      {message}
    </FormDescription>
  }

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
            onChange={handleStaffSelect}
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
            value={selectedServicio ?? ""}
            disabled= {notModifyDefaults}
            options={ListServicio}
            onChange={(value) => {
              setSelectedServicio(value);
              if (value) {
                console.log("Cambiando servicio a:", value);
                onServiceChange(value);
              }
            }}
            description={!isPrescriptionOrderAppointment?"Seleccione un servicio para la consulta": undefined}
            placeholder="Selecciona un servicio"
          />
          {isPrescriptionOrderAppointment && <DefaultValueOrderDescription></DefaultValueOrderDescription>}
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
            onChange={(value) => {
              setSelectedSucursal(value);
              if (value) {
                onBranchChange(value);
              }
            }}
            description="Seleccione una sucursal"
            placeholder="Selecciona una sucursal"
          />
        </div>
        <div className="mt-6">
          <Label
            htmlFor="paciente"
            className="flex flex-row items-center mb-4">
            <UserPlus className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Paciente
          </Label>
          <ComboboxSelect
            value={selectedPaciente ?? ""}
            disabled= {notModifyDefaults}
            options={ListPaciente}
            onChange={(value) => {
              console.log("Valor seleccionado paciente:", value);
              setSelectedPaciente(value);
              if (value) {
                onPatientChange(value);
              }
            }}
            description={!isPrescriptionOrderAppointment?"Seleccione un paciente para la consulta": undefined}
            placeholder="Selecciona un paciente"
          />
          {isPrescriptionOrderAppointment && <DefaultValueOrderDescription></DefaultValueOrderDescription>}
        </div>
      </div>
      <Separator
        orientation="vertical"
        className="h-auto sm:visible invisible"
      />
    </div>
  );
}