"use client";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CalendarCheck2, Hospital, Notebook, PillBottle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PrescriptionMedicamentsCardTable } from "./PrescriptionMedicamentsCardTable";
import { PrescriptionWithPatient } from "../../_interfaces/prescription.interface";
import { PrescriptionServicesCardTable } from "./OrderPatientDetailsMetadataCardTable";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductSaleMetadata } from "../../_interfaces/order.interface";

export function ShowSaleMetadataDetailsDialog({
  data,
}: {
  data: ProductSaleMetadata //MedicalPrescriptionMetadata //MedicalAppointmentMetadata;
}) {
  const SHOW_PRESCRIPTION_DETAILS_MESSAGES = {
    button: "Mostrar Detalles",
    title: "Detalles de receta",
    description: `Aquí puedes ver el detalle de la receta.`,
    cancel: "Cerrar",
  } as const;
  const [open, setOpen] = useState(false);
  //   const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  // const { oneBranchQuery } = useBranches();
  // const branchQuery = oneBranchQuery(data.);



  const handleClose = () => {
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {SHOW_PRESCRIPTION_DETAILS_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      variant="ghost"
      size="sm"
      aria-label="Open menu"
      className="flex p-2 data-[state=open]:bg-muted text-sm bg-primary/10 hover:scale-105 hover:transition-all"
    >
      <PillBottle className="text-primary !size-6" />
      {SHOW_PRESCRIPTION_DETAILS_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)]">
          <DialogHeader className="sm:flex-row justify-between">
            <div className="space-y-2">
              <DialogTitle className="w-full">
                {SHOW_PRESCRIPTION_DETAILS_MESSAGES.title}
              </DialogTitle>
              <DialogDescription className="w-full text-balance">
                {SHOW_PRESCRIPTION_DETAILS_MESSAGES.description}
              </DialogDescription>
            </div>
            <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-center">
              <div className="flex space-x-2">
                <CalendarCheck2 className="text-primary"></CalendarCheck2>
                <div className="flex flex-col gap-1 justify-center items-start">
                  <Label className="text-sm font-medium">Fecha creación</Label>
                  <span className="text-sm text-muted-foreground">
                    {format(data.registrationDate, "PP", { locale: es })}
                  </span>
                </div>
              </div>
              <Separator orientation="vertical"></Separator>
              <div className="flex space-x-2">
                <Hospital className="text-primary"></Hospital>
                <div className="flex flex-col gap-1 justify-center items-start">
                  <Label className="text-sm font-medium">Sucursal</Label>
                  <span className="text-sm text-muted-foreground">
                    {branchQuery.isLoading && "Cargando..."}
                    {branchQuery.isError && "Error al cargar la sucursal"}
                    {branchQuery.isSuccess &&
                      (branchQuery.data.name ?? "Sin nombre")}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
          <div className="overflow-auto max-h-full space-y-3">
            {/* <MovementsTable data={data}></MovementsTable> */}
            <PrescriptionServicesCardTable
              data={data.prescriptionServices}
            ></PrescriptionServicesCardTable>
            <PrescriptionMedicamentsCardTable
              data={data.prescriptionMedicaments}
            ></PrescriptionMedicamentsCardTable>
            {data.description && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-primary flex space-x-2 items-center">
                    <Notebook></Notebook>
                    <span>Notas adicionales</span>
                  </CardTitle>
                  <CardDescription>
                    Información adicional ingresada por el médico
                  </CardDescription>
                </CardHeader>
                <CardContent className="w-full px-5 rounded-md">
                  <div className="bg-primary/10 py-4 px-4 overflow-x-auto text-start text-pretty w-full rounded-md">
                    {data.description}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <DialogFooterContent />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent>
        <DialogHeader className="sm:flex-row justify-between">
          <div className="space-y-2">
            <DialogTitle className="w-full">
              {SHOW_PRESCRIPTION_DETAILS_MESSAGES.title}
            </DialogTitle>
            <DialogDescription className="w-full text-balance">
              {SHOW_PRESCRIPTION_DETAILS_MESSAGES.description}
            </DialogDescription>
          </div>
          <div className="flex rounded-sm bg-primary/10 p-4 w-full space-x-4 items-center justify-center">
            <div className="flex space-x-2">
              <CalendarCheck2 className="text-primary"></CalendarCheck2>
              <div className="flex flex-col gap-1 justify-center items-start">
                <Label className="text-sm font-medium">Fecha creación</Label>
                <span className="text-sm text-muted-foreground">
                  {format(data.registrationDate, "PP", { locale: es })}
                </span>
              </div>
            </div>
            <Separator orientation="vertical"></Separator>
            <div className="flex space-x-2">
              <Hospital className="text-primary"></Hospital>
              <div className="flex flex-col gap-1 justify-center items-start">
                <Label className="text-sm font-medium">Sucursal</Label>
                <span className="text-sm text-muted-foreground">
                  {branchQuery.isLoading && "Cargando..."}
                  {branchQuery.isError && "Error al cargar la sucursal"}
                  {branchQuery.isSuccess &&
                    (branchQuery.data.name ?? "Sin nombre")}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(100dvh-12rem)] space-y-3">
          {/* <MovementsTable data={data}></MovementsTable> */}
          <PrescriptionServicesCardTable
            data={data.prescriptionServices}
          ></PrescriptionServicesCardTable>
          <PrescriptionMedicamentsCardTable
            data={data.prescriptionMedicaments}
          ></PrescriptionMedicamentsCardTable>
          {data.description && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-primary flex space-x-2 items-center">
                  <Notebook></Notebook>
                    <span>Notas adicionales</span>
                  </CardTitle>
                  <CardDescription>
                    Información adicional ingresada por el médico
                  </CardDescription>
                </CardHeader>
                <CardContent className="w-full px-5 rounded-md">
                  <div className="bg-primary/10 py-4 px-4 overflow-x-auto text-start text-pretty w-full rounded-md">
                    {data.description}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
