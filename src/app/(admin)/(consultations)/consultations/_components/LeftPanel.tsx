import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  BriefcaseMedical,
  Calendar,
  Hospital,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";
import { useServices } from "@/app/(admin)/services/_hooks/useServices";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { UseFormReturn } from "react-hook-form";
import { ConsultationSchema } from "../type";
import { FormDescription } from "@/components/ui/form";
import PatientSearchSelect from "./PatientSearchSelect";
import ClearableCombobox from "./ClearableCombobox";

interface LeftPanelProps {
  date: Date;
  time: string;
  onStaffChange: (staffId: string) => void;
  onBranchChange: (branchId: string) => void;
  onServiceChange: (serviceId: string) => void;
  onPatientChange: (patientId: string) => void;
  form?: UseFormReturn<ConsultationSchema>;
  notModifyDefaults?: boolean;
}

export default function LeftPanel({
  date,
  time,
  onStaffChange,
  onBranchChange,
  onServiceChange,
  onPatientChange,
  form,
  notModifyDefaults,
}: LeftPanelProps) {
  const isPrescriptionOrderAppointment = form && notModifyDefaults;
  const [selectedMedico, setSelectedMedico] = useState<string>(
    isPrescriptionOrderAppointment ? form?.getValues("staffId") || "" : ""
  );
  const [selectedServicio, setSelectedServicio] = useState<string>(
    isPrescriptionOrderAppointment ? form?.getValues("serviceId") || "" : ""
  );
  const [selectedSucursal, setSelectedSucursal] = useState<string>(
    isPrescriptionOrderAppointment ? form?.getValues("branchId") || "" : ""
  );
  const [selectedPaciente, setSelectedPaciente] = useState<string>(
    isPrescriptionOrderAppointment ? form?.getValues("patientId") || "" : ""
  );
  const { staff } = useStaff();
  const { services } = useServices();
  const { branches } = useBranches();

  const ListMedico =
    staff
      ?.filter((medico) => medico.cmp)
      .map((medico) => ({
        value: medico.id,
        label: medico.name,
      })) ?? [];

  console.log("LeftPanel:", ListMedico);

  const ListServicio =
    services?.map((servicio) => ({
      value: servicio.id,
      label: servicio.name,
    })) ?? [];

  const ListSucursal =
    branches?.map((sucursal) => ({
      value: sucursal.id,
      label: sucursal.name,
    })) ?? [];

  const handleStaffSelect = (value: string | null) => {
    console.group("👨‍⚕️ Staff Selection");
    console.log("Value:", value);
    const staffValue = value ?? "";
    setSelectedMedico(staffValue);
    onStaffChange(staffValue);
    console.groupEnd();
  };

  const handleServiceSelect = (value: string | null) => {
    const serviceValue = value ?? "";
    setSelectedServicio(serviceValue);
    onServiceChange(serviceValue);
    console.log("Cambiando servicio a:", serviceValue);
  };

  const handleBranchSelect = (value: string | null) => {
    const branchValue = value ?? "";
    setSelectedSucursal(branchValue);
    onBranchChange(branchValue);
  };

  const handlePatientSelect = (value: string) => {
    console.log("Valor seleccionado paciente:", value);
    const patientValue = value ?? "";
    setSelectedPaciente(patientValue);
    onPatientChange(patientValue);
  };

  const DefaultValueOrderDescription = () => {
    const message = "Valor obligatorio para la orden";
    return (
      <FormDescription className="text-primary/80">{message}</FormDescription>
    );
  };

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
          <Label htmlFor="medico" className="flex flex-row items-center mb-4">
            <BriefcaseMedical className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Médico
          </Label>
          <ClearableCombobox
            options={ListMedico}
            value={selectedMedico}
            onChange={handleStaffSelect}
            description="Seleccione un medico que realizará la consulta"
            placeholder="Selecciona un medico"
            clearOnClick={true}
          />
        </div>
        <div className="mt-6">
          <Label htmlFor="servicio" className="flex flex-row items-center mb-4">
            <Stethoscope className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Servicios
          </Label>
          <ClearableCombobox
            value={selectedServicio}
            disabled={notModifyDefaults}
            options={ListServicio}
            onChange={handleServiceSelect}
            description={
              !isPrescriptionOrderAppointment
                ? "Seleccione un servicio para la consulta"
                : undefined
            }
            placeholder="Selecciona un servicio"
            clearOnClick={true}
          />
          {isPrescriptionOrderAppointment && (
            <DefaultValueOrderDescription></DefaultValueOrderDescription>
          )}
        </div>
        <div className="mt-6">
          <Label htmlFor="sucursal" className="flex flex-row items-center mb-4">
            <Hospital className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Sucursal
          </Label>
          <ClearableCombobox
            options={ListSucursal}
            value={selectedSucursal}
            onChange={handleBranchSelect}
            description="Seleccione una sucursal"
            placeholder="Selecciona una sucursal"
            clearOnClick={true}
          />
        </div>
        <div className="mt-6">
          <Label htmlFor="paciente" className="flex flex-row items-center mb-4">
            <UsersRound className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Nrº de Documento del Paciente
          </Label>
          <PatientSearchSelect
            value={selectedPaciente}
            disabled={notModifyDefaults}
            onChange={handlePatientSelect}
            description={
              !isPrescriptionOrderAppointment
                ? "Seleccione un paciente para la consulta"
                : undefined
            }
            placeholder="DNI del paciente(mín. 5 dígitos)"
          />
          {isPrescriptionOrderAppointment && (
            <DefaultValueOrderDescription></DefaultValueOrderDescription>
          )}
        </div>
      </div>
      <Separator
        orientation="vertical"
        className="h-auto sm:visible invisible"
      />
    </div>
  );
}
