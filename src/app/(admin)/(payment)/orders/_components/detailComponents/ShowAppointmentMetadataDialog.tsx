"use client";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Boxes, User } from "lucide-react";
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
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { MedicalAppointmentMetadata } from "../../_interfaces/order.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionDetailsMetadataCardTable } from "./TransactionDetailMetadataCardTable";
import { CommonDataMetadataMobile } from "./CommonDataMetadataMobile";
import { CommonDataMetadata } from "./CommonDataMetadata";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { UseQueryResult } from "@tanstack/react-query";
import { Staff } from "@/app/(admin)/(staff)/staff/_interfaces/staff.interface";
import MedicalAppointmentDetails from "./MedicalAppointementDetails";

export function ShowAppointmentMetadataDialog({
  data,
}: {
  data: MedicalAppointmentMetadata; //MedicalPrescriptionMetadata //MedicalAppointmentMetadata;
  orderId: string;
}) {
  const SHOW_PRESCRIPTION_METADATA_DETAILS_MESSAGES = {
    button: "Mostrar Detalles",
    title: "Detalles de venta por receta médica",
    description: `Aquí puedes ver el detalle de la venta por receta médica.`,
    cancel: "Cerrar",
  } as const;
  const [open, setOpen] = useState(false);
  //   const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { oneBranchQuery } = useBranches();
  const branchQuery = oneBranchQuery(data.orderDetails.branchId);
  const { oneStaffQuery } = useStaff();
  let staffData: UseQueryResult<Staff, Error> | undefined = undefined;
  if (data.orderDetails.staffId) {
    staffData = oneStaffQuery(data.orderDetails.staffId);
  }

  if (branchQuery.isLoading || staffData?.isLoading) {
    return (
      <Button type="button" disabled className="w-full flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </Button>
    );
  }

  if (branchQuery.isError) {
    toast.error("Error al cargar la sucursal", {
      action: {
        label: "Recargar",
        onClick: async () => {
          await branchQuery.refetch();
        },
      },
    });
    return (
      <Button type="button" disabled className="w-full flex items-center gap-2">
        Error
      </Button>
    );
  }

  if (staffData?.isError) {
    toast.error("Error al cargar el personal", {
      action: {
        label: "Recargar",
        onClick: async () => {
          await branchQuery.refetch();
        },
      },
    });
    return (
      <Button type="button" disabled className="w-full flex items-center gap-2">
        Error
      </Button>
    );
  }

  if (!staffData?.data) {
    return (
      <Button type="button" disabled className="w-full flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </Button>
    );
  }

  if (!branchQuery.data) {
    return (
      <Button type="button" disabled className="w-full flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
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
        {SHOW_PRESCRIPTION_METADATA_DETAILS_MESSAGES.cancel}
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
      <Boxes className="text-primary !size-6" />
      {SHOW_PRESCRIPTION_METADATA_DETAILS_MESSAGES.button}
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
                {SHOW_PRESCRIPTION_METADATA_DETAILS_MESSAGES.title}
              </DialogTitle>
              <DialogDescription className="w-full text-balance">
                {SHOW_PRESCRIPTION_METADATA_DETAILS_MESSAGES.description}
              </DialogDescription>
              {staffData?.data && (
                <div className="flex flex-col space-y-1 !mt-4">
                  <div className="flex space-x-2">
                    <User className="text-primary"></User>
                    <div className="flex flex-col space-y-1">
                      <Label>Personal que generó la órden</Label>
                      <div className="space-y-1">
                        <span className="capitalize block font-bold">{`${
                          staffData.data.name ?? "NN"
                        } ${staffData.data.lastName ?? "NN"}`}</span>
                        <span className="capitalize block text-muted-foreground text-sm">
                          {staffData.data.email ?? "No email"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <CommonDataMetadata
              patientData={data.patientDetails}
              branchData={branchQuery.data}
            ></CommonDataMetadata>
          </DialogHeader>
          <div className="overflow-auto max-h-full space-y-3">
            {/* <MovementsTable data={data}></MovementsTable> */}
            {data.orderDetails && (
              <MedicalAppointmentDetails
                details={data.orderDetails}
              ></MedicalAppointmentDetails>
            )}
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
      <DrawerContent className="overflow-auto">
        <DialogHeader className="sm:flex-row justify-between">
          <div className="space-y-2">
            <DialogTitle className="w-full">
              {SHOW_PRESCRIPTION_METADATA_DETAILS_MESSAGES.title}
            </DialogTitle>
            <DialogDescription className="w-full text-balance">
              {SHOW_PRESCRIPTION_METADATA_DETAILS_MESSAGES.description}
            </DialogDescription>
            {staffData.data && (
              <div className="flex flex-col space-y-1">
                <div className="flex space-x-2">
                  <User className="text-primary"></User>
                  <Label>Personal que generò la órden</Label>
                </div>
                <div className="space-y-1">
                  <span className="capitalize block">{`${
                    staffData.data.name ?? "NN"
                  } ${staffData.data.lastName ?? "NN"}`}</span>
                  <span className="capitalize block text-muted-foreground">
                    {staffData.data.email ?? "No email"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <CommonDataMetadataMobile
            branchData={branchQuery.data}
            patientData={data.patientDetails}
          ></CommonDataMetadataMobile>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(100dvh-12rem)] space-y-3">
          {/* <MovementsTable data={data}></MovementsTable> */}
          {data.orderDetails && (
            <MedicalAppointmentDetails
              details={data.orderDetails}
            ></MedicalAppointmentDetails>
          )}
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
