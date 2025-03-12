"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  useForm,
  // FieldErrors,
  // UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Receipt, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePrescriptionOrderForm } from "./CreatePrescriptionBillingOrderForm";
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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useBilling } from "@/app/(admin)/(payment)/orders/_hooks/useBilling";
import {
  // CreatePrescriptionBillingInput,
  // createPrescriptionBillingSchema,
  createPrescriptionBillingLocalSchema,
  CreatePrescriptionBillingLocalInput
} from "@/app/(admin)/(payment)/orders/_interfaces/order.interface";
import { PrescriptionWithPatient } from "../../../_interfaces/prescription.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveStoragesByBranch } from "@/app/(admin)/(catalog)/storage/storages/_actions/storages.actions";
import { toast } from "sonner";
import { useManyProductsStock } from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
import { useServices } from "@/app/(admin)/services/_hooks/useServices";
import { ConfirmOrderDialog } from "./ConfirmOrderDialog";

const CREATE_OUTGOING_MESSAGES = {
  button: "Generar venta",
  title: "Registrar venta por receta",
  description: "Rellena los campos para completar la venta de medicamentos según receta. Debes seleccionar los items para poder editar sus campos.",
  success: "Venta por receta registrada exitosamente",
  submitButton: "Procesar venta",
  cancel: "Cancelar",
} as const;

export function CreatePrescriptionBillingProcessDialog({
  prescription,
}: {
  prescription: PrescriptionWithPatient;
}) {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const [isFetchingError, setIsFetchingError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log('prescriptionMedicaments', prescription.prescriptionMedicaments)
  const existentMedicamentsIds = prescription.prescriptionMedicaments.filter(product => product.id != undefined).map((product) => product.id!);
  console.log('Prescription Medicaments Ids', existentMedicamentsIds)
  const manyProductsStock = useManyProductsStock()
  const { productStockQuery } = manyProductsStock(existentMedicamentsIds, prescription.id)
  const { servicesQuery } = useServices();

  // 5. Form y Field Array
  const form = useForm<CreatePrescriptionBillingLocalInput>({
    resolver: zodResolver(
      createPrescriptionBillingLocalSchema
    ),
    defaultValues: async () => {
      setIsLoading(true);
      const result = await getActiveStoragesByBranch(prescription.branchId);
      if ("error" in result) {
        setIsFetchingError(true);
        return {
          patientId: prescription.patientId, //required
          branchId: prescription.branchId, //required
          currency: "PEN", //required
          paymentMethod: "CASH", //required
          storageLocation: undefined,
          batchNumber: undefined,
          referenceId: undefined,
          notes: undefined,
          metadata: undefined,
          products: [],
          services: prescription.prescriptionServices.length > 0 ? prescription.prescriptionServices.map((service) => ({
            serviceId: service.id!,
            quantity: service.quantity ?? 1,
          }))
          : [],
        };
      }
      setIsFetchingError(false);
      setIsLoading(false);
      return {
        patientId: prescription.patientId, //required
        branchId: prescription.branchId, //required
        currency: "PEN", //required
        paymentMethod: "CASH", //required
        storageLocation: undefined,
        batchNumber: undefined,
        referenceId: undefined,
        notes: undefined,
        metadata: undefined,
        services: prescription.prescriptionServices.length > 0 ? prescription.prescriptionServices.map((service) => ({
          serviceId: service.id!,
          quantity: service.quantity ?? 1,
        }))
        : [],
        // products:
        products:
          prescription.prescriptionMedicaments.length > 0
            ? prescription.prescriptionMedicaments.map((product) => ({
                productId: product.id!,
                quantity: product.quantity ?? 1,
                storageId: result[0].id ?? undefined,
              }))
            : [],
      };
    },
  });

  // const productFieldArray = useFieldArray({
  //   control: form.control,
  //   name: "products",
  // });

  // const serviceFieldArray = useFieldArray({
  //   control: form.control,
  //   name: "services",
  // });

  // 3. Contextos (useContext)
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createPrescriptionOrderMutation } = useBilling();
  // const { useStorageByBranchQuery } = useStorages();

  // // 4. Queries y datos externos
  // const [isPending, startTransition] = useTransition();
  // const [defaultStorages, setDefaultStorages] = useState<DetailedStorage[]>([]);

  // useEffect(() => {
  //   startTransition(async () => {
  //     const result = await getActiveStoragesByBranch(prescription.branchId);
  //     if (!("error" in result)) {
  //       setDefaultStorages(result);
  //     }
  //   });
  // }, [prescription.branchId]);

  // if (isPending) {
  //   return (
  //     <div className="flex items-center space-x-2">
  //       <Skeleton className="h-9 w-24 animate-pulse rounded-md bg-secondary"></Skeleton>
  //     </div>
  //   );
  // }

  // if (defaultStorages.length === 0) {
  //   return <div>No hay almacenes disponibles para esta sucursal</div>;
  // }

  // 6. Callbacks (useCallback)
  // const handleClearProductList = useCallback(() => {
  //   productFieldArray.remove();
  // }, [productFieldArray]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen((prev) => (prev === newOpen ? prev : newOpen));
  }, []);

  const handleClose = useCallback(() => {
    // handleClearProductList();
    form.reset();
    setOpen(false);
  }, [form]);

  const onSubmit = useCallback(
    (input: CreatePrescriptionBillingLocalInput) => {
      startCreateTransition(() => {
        createPrescriptionOrderMutation.mutate(input, {
          onSuccess: () => {
            form.reset();
            setOpen(false);
          },
          onError: (error) => {
            if (error.message.includes("No autorizado")) {
              setTimeout(() => form.reset(), 1000);
            }
          },
        });
      });
    },
    [createPrescriptionOrderMutation, form, startCreateTransition]
  );

  useEffect(() => {
    if (isFetchingError) {
      toast.error("Error al obtener los almacenes de la sucursal");
    }
  }, []);
  

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      {/* <Button
        type="submit"
        disabled={isCreatePending || createSaleOrderMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || createSaleOrderMutation.isPending) && (
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {CREATE_OUTGOING_MESSAGES.submitButton}
      </Button> */}

      <ConfirmOrderDialog
        onConfirm={async ()=>{ await form.handleSubmit(onSubmit)()}}
        trigger={
          <div>
            {(isCreatePending || createPrescriptionOrderMutation.isPending) && (
              <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            <span>
              {CREATE_OUTGOING_MESSAGES.submitButton}
            </span>
          </div>
        }
        isLoading={isCreatePending || createPrescriptionOrderMutation.isPending}
        confirmationText="Confirmar"
      >
      </ConfirmOrderDialog>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_OUTGOING_MESSAGES.cancel}
      </Button>
    </div>
  );

  const LoadingButton = () => {
    return (
      <Skeleton className="h-9 w-24 animate-pulse rounded-md bg-secondary"></Skeleton>
  );}

  const ErrorButtonSkeleton = () => {
    return (
      <Skeleton className="h-9 w-24 animate-pulse rounded-md bg-secondary text-center">Error</Skeleton>
  );}

  const TriggerButton = () => {
    // if (isLoading || productStockQuery.isLoading || servicesQuery.isLoading) {
    //   return (
    //       <LoadingButton />
    //   );
    // }

    return (
    <Button
      disabled={isFetchingError || productStockQuery.isError}
      onClick={() => setOpen(true)}
      variant="ghost"
      size="sm"
      aria-label="Open menu"
      className="flex p-2 data-[state=open]:bg-muted text-sm bg-primary/10 hover:scale-105 hover:transition-all"
    >
      <Receipt className="text-primary !size-6" />
      {CREATE_OUTGOING_MESSAGES.button}
    </Button>
    );
  };

  if (productStockQuery.isError || isFetchingError || servicesQuery.isError) {
    toast.error("Error al obtener el stock de productos");
    return <ErrorButtonSkeleton />;
  }

  if (productStockQuery.isLoading || isLoading || servicesQuery.isLoading) {
    return <LoadingButton
    />;
  }

  if (!productStockQuery.data || !servicesQuery.data) {
    return <ErrorButtonSkeleton />;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent
          key={open ? "open" : "closed"}
          className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{CREATE_OUTGOING_MESSAGES.title}</DialogTitle>
            <DialogDescription className="text-balance">
              {CREATE_OUTGOING_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreatePrescriptionOrderForm
            form={form}
            onSubmit={onSubmit}
            // controlledProductFieldArray={productFieldArray}
            // controlledServiceFieldArray={serviceFieldArray}
            prescription={prescription}
            stockDataQuery={productStockQuery}
            serviceDataQuery={servicesQuery}
          >
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreatePrescriptionOrderForm>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent key={open ? "open" : "closed"} className="overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>{CREATE_OUTGOING_MESSAGES.title}</DrawerTitle>
          <DrawerDescription className="text-balance">
            {CREATE_OUTGOING_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreatePrescriptionOrderForm
          form={form}
          onSubmit={onSubmit}
          // controlledProductFieldArray={productFieldArray}
          // controlledServiceFieldArray={serviceFieldArray}
          prescription={prescription}
          stockDataQuery={productStockQuery}
          serviceDataQuery={servicesQuery}
        >
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreatePrescriptionOrderForm>
      </DrawerContent>
    </Drawer>
  );
}
