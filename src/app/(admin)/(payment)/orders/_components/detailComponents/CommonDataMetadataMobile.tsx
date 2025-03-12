import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Hospital,
  MapPinHouse,
  SquareUserRound,
} from "lucide-react";
import React from "react";
import { PatientDetailsMetadata } from "../../_interfaces/order.interface";
import { Branch } from "@/app/(admin)/branches/_interfaces/branch.interface";

interface CommonDataMetadataPropsMobile {
  patientData: PatientDetailsMetadata;
  branchData?: Branch;
}
function CommonDataMetadataMobile({
  branchData,
  patientData,
}: CommonDataMetadataPropsMobile) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-x-2 justify-center items-center w-full">
        <Hospital className="text-primary"></Hospital>
        <div className="flex flex-col gap-1 justify-center items-start w-fit">
          <Label className="text-sm font-medium text-center w-full">Sucursal creación</Label>
          <span className="text-sm text-muted-foreground block text-center w-full">
            {branchData?.name ?? "Sin nombre"}
          </span>
        </div>
      </div>
      <div className="flex rounded-sm bg-primary/10 p-4 w-full space-x-4 items-center justify-center">
        <div className="flex space-x-2">
          <div className="flex flex-col gap-1 justify-center items-start">
            <div className="flex justify-center w-full">
              <SquareUserRound className="text-primary"></SquareUserRound>
            </div>
            <Label className="text-sm font-medium text-center w-full">
              Paciente
            </Label>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground block text-center">
                {patientData.fullName}
              </span>
              <span className="text-sm text-muted-foreground block text-center">
                {patientData.dni ?? "No hay DNI"}
              </span>
            </div>
          </div>
        </div>
        <Separator orientation="vertical"></Separator>
        <div className="flex space-x-2">
          <div className="flex flex-col gap-1 justify-center items-start">
            <div className="flex justify-center w-full">
              <MapPinHouse className="text-primary"></MapPinHouse>
            </div>
            <div className="flex flex-col gap-1 justify-center items-start">
              <Label className="text-sm font-mediumn text-center w-full">Contacto</Label>
              <span className="text-sm text-muted-foreground text-center block w-full">
                {patientData.address ?? "Sin dirección"}
              </span>
              <span className="text-sm text-muted-foreground text-center block w-full">
                {patientData.phone ?? "Sin teléfono"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CommonDataMetadataMobile };
