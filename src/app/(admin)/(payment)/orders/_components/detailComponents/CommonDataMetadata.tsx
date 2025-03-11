import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPinHouse, SquareUserRound } from "lucide-react";
import React from "react";
import { PatientDetailsMetadata } from "../../_interfaces/order.interface";
import { Branch } from "@/app/(admin)/branches/_interfaces/branch.interface";

interface CommonDataMetadataPropsDesktop {
    patientData: PatientDetailsMetadata
    branchData?: Branch
}
function CommonDataMetadata({ branchData, patientData} : CommonDataMetadataPropsDesktop) {
  return (
    <>
      <div>
        <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-center">
          <div className="flex space-x-2">
            <Building2 className="text-primary"></Building2>
            <div className="flex flex-col gap-1 justify-center items-start">
              <Label className="text-sm font-medium">Sucursal creación</Label>
              <span className="text-sm text-muted-foreground">
                {branchData?.name ?? "Sin nombre"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-center">
        <div className="flex space-x-2">
          <SquareUserRound className="text-primary"></SquareUserRound>
          <div className="flex flex-col gap-2 justify-center items-start">
            <Label className="text-sm font-medium">Paciente</Label>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                {patientData.fullName}
              </span>
              <span className="text-sm text-muted-foreground">
                {patientData.dni ?? "No hay DNI"}
              </span>
            </div>
          </div>
        </div>
        <Separator orientation="vertical"></Separator>
        <div className="flex space-x-2">
          <MapPinHouse className="text-primary"></MapPinHouse>
          <div className="flex flex-col gap-1 justify-center items-start">
            <Label className="text-sm font-medium">Contacto</Label>
            <span className="text-sm text-muted-foreground">
              {patientData.address ?? "Sin dirección"}
            </span>
            <span className="text-sm text-muted-foreground">
              {patientData.phone ?? "Sin teléfono"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommonDataMetadata;
