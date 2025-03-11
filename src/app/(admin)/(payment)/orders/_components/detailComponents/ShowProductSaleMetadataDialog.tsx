"use client";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Building2,
  CalendarCheck2,
  Hospital,
  MapPinHouse,
  Notebook,
  PillBottle,
  SquareUserRound,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ProductMovementsMetadataTable } from "./ProductMovementMetadtaCardTable";
import { TransactionDetailsMetadataCardTable } from "./TransactionDetailMetadataCardTable";

export function ShowSaleMetadataDetailsDialog({
  data,
  orderId,
}: {
  data: ProductSaleMetadata; //MedicalPrescriptionMetadata //MedicalAppointmentMetadata;
  orderId: string;
}) {
  const SHOW_SALE_METADATA_DETAILS_MESSAGES = {
    button: "Mostrar Detalles",
    title: "Detalles de venta de productos",
    description: `Aquí puedes ver el detalle de la venta de productos.`,
    cancel: "Cerrar",
  } as const;
  const [open, setOpen] = useState(false);
  //   const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { oneBranchQuery } = useBranches();
  const branchQuery = oneBranchQuery(data.orderDetails.branchId);

  if (branchQuery.isLoading) {
    return (
      <Button type="button" disabled className="w-full flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </Button>
    );
  }

  if (branchQuery.isError) {
    return (
      <Button type="button" disabled className="w-full flex items-center gap-2">
        Error
      </Button>
    );
  }

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
        {SHOW_SALE_METADATA_DETAILS_MESSAGES.cancel}
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
      {SHOW_SALE_METADATA_DETAILS_MESSAGES.button}
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
                {SHOW_SALE_METADATA_DETAILS_MESSAGES.title}
              </DialogTitle>
              <DialogDescription className="w-full text-balance">
                {SHOW_SALE_METADATA_DETAILS_MESSAGES.description}
              </DialogDescription>
            </div>
            <div>
              <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-center">
                <div className="flex space-x-2">
                  <Building2 className="text-primary"></Building2>
                  <div className="flex flex-col gap-1 justify-center items-start">
                    <Label className="text-sm font-medium">
                      Sucursal creación
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {branchQuery.data?.name ?? "Sin nombre"}
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
                      {data.patientDetails.fullName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {data.patientDetails.dni ?? "No hay DNI"}
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
                    {data.patientDetails.address ?? "Sin dirección"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {data.patientDetails.phone ?? "Sin teléfono"}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
          <div className="overflow-auto max-h-full space-y-3">
            {/* <MovementsTable data={data}></MovementsTable> */}
            <ProductMovementsMetadataTable
              orderId={orderId}
              data={data.orderDetails.products}
            ></ProductMovementsMetadataTable>
            <TransactionDetailsMetadataCardTable
              data={data.orderDetails.transactionDetails}
            ></TransactionDetailsMetadataCardTable>
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
              {SHOW_SALE_METADATA_DETAILS_MESSAGES.title}
            </DialogTitle>
            <DialogDescription className="w-full text-balance">
              {SHOW_SALE_METADATA_DETAILS_MESSAGES.description}
            </DialogDescription>
          </div>
          <div className="flex flex-col">
            <div className="flex space-x-2">
              <Building2 className="text-primary"></Building2>
              <div className="flex flex-col gap-1 justify-center items-start">
                <Label className="text-sm font-medium">Sucursal creación</Label>
                <span className="text-sm text-muted-foreground">
                  {branchData?.name ?? "Sin nombre"}
                </span>
              </div>
            </div>
            <div className="flex rounded-sm bg-primary/10 p-4 w-full space-x-4 items-center justify-center">
              <div className="flex space-x-2">
                <SquareUserRound className="text-primary"></SquareUserRound>
                <div className="flex flex-col gap-1 justify-center items-start">
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
                <Hospital className="text-primary"></Hospital>
                <div className="flex flex-col gap-1 justify-center items-start">
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
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(100dvh-12rem)] space-y-3">
          {/* <MovementsTable data={data}></MovementsTable> */}
          <ProductMovementsMetadataTable
              orderId={orderId}
              data={data.orderDetails.products}
            ></ProductMovementsMetadataTable>
            <TransactionDetailsMetadataCardTable
              data={data.orderDetails.transactionDetails}
            ></TransactionDetailsMetadataCardTable>
        </div>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
