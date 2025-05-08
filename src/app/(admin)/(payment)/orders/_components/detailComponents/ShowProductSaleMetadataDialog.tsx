"use client";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Boxes,
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
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { ProductSaleMetadata } from "../../_interfaces/order.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductMovementsMetadataTable } from "./ProductMovementMetadataCardTable";
import { TransactionDetailsMetadataCardTable } from "./TransactionDetailMetadataCardTable";
import { CommonDataMetadataMobile } from "./CommonDataMetadataMobile";
import { CommonDataMetadata } from "./CommonDataMetadata";

export function ShowProductSaleMetadataDetailsDialog({
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
      <Boxes className="text-primary !size-6" />
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
            <CommonDataMetadata
              patientData={data.patientDetails}
              branchData={branchQuery.data}
            ></CommonDataMetadata>
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
      <DrawerContent className="overflow-auto">
        <DialogHeader className="sm:flex-row justify-between">
          <div className="space-y-2">
            <DialogTitle className="w-full">
              {SHOW_SALE_METADATA_DETAILS_MESSAGES.title}
            </DialogTitle>
            <DialogDescription className="w-full text-balance">
              {SHOW_SALE_METADATA_DETAILS_MESSAGES.description}
            </DialogDescription>
          </div>
          <CommonDataMetadataMobile
            branchData={branchQuery.data}
            patientData={data.patientDetails}
          ></CommonDataMetadataMobile>
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
