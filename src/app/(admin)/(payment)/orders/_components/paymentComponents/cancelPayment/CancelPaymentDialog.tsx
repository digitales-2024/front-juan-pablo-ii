"use client";
import { useEffect, useState, useTransition } from "react";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Order,
  orderTypeConfig,
  Payment,
  CancelPaymentInput,
  cancelPaymentSchema,
} from "../../../_interfaces/order.interface";
import { usePayments } from "../../../_hooks/usePayment";
import { toast } from "sonner";
import { ConfirmOrderDialog } from "./ConfirmDialog";
import { CancelPaymentForm } from "./CancelPaymentForm";

interface CancelPaymentDialogProps {
  order: Order;
  payment: Payment;
}

export function CancelPaymentDialog({
  order,
  payment,
}: CancelPaymentDialogProps) {
  const SUBJECT_ENTITYNAME = "órden";
  const CANCEL_PAYMENT_MESSAGES = {
    button: `Cancelar ${SUBJECT_ENTITYNAME}`,
    title: `Cancelar ${SUBJECT_ENTITYNAME}`,
    description: `Rellena los campos para cancelar la ${SUBJECT_ENTITYNAME} de "${
      orderTypeConfig[order.type].name
    }"`,
    success: `Orden cancelada exitosamente`,
    submitButton: `Cancelar ${SUBJECT_ENTITYNAME}`,
    cancel: "Salir",
  } as const;
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { cancelPaymentMutation } = usePayments();

// export const cancelPaymentSchema = z.object({
//   cancellationReason: z.string(),
// }) satisfies z.ZodType<CancelPaymentDto>;

  const form = useForm<CancelPaymentInput>({
    resolver: zodResolver(cancelPaymentSchema),
    defaultValues: {
        cancellationReason: undefined,
    }
  });

  function handleSubmit(input: CancelPaymentInput) {
    if (cancelPaymentMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      cancelPaymentMutation.mutate(
        {
          paymentId: payment.id,
          data: input,
        },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            toast.error(
              `Error al crear ${SUBJECT_ENTITYNAME}: ${error.message}`
            );
            if (error.message.includes("No autorizado")) {
              setTimeout(() => {
                form.reset();
              }, 1000);
            }
          },
        }
      );
    });
  }

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  //ACtivate only when form errors
  // useEffect(() => {
  //   if (form.formState.errors) {
  //     console.log("Errores en el formulario", form.formState.errors);
  //   }
  // }, [form.formState.errors]);

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      {/* <Button
        type="submit"
        disabled={isCreatePending || cancelPaymentMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || cancelPaymentMutation.isPending) && (
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {CANCEL_PAYMENT_MESSAGES.submitButton}
      </Button> */}
      <ConfirmOrderDialog
        onConfirm={async () => {
          await form.handleSubmit(handleSubmit)();
        }}
        trigger={
          <div>
            {(isCreatePending || cancelPaymentMutation.isPending) && (
              <RefreshCcw
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            <span>{CANCEL_PAYMENT_MESSAGES.submitButton}</span>
          </div>
        }
        isLoading={isCreatePending || cancelPaymentMutation.isPending}
        confirmationText="Confirmar"
      ></ConfirmOrderDialog>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CANCEL_PAYMENT_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {CANCEL_PAYMENT_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="max-w-xl max-h-[calc(100vh-4rem)]">
          <DialogHeader>
            <DialogTitle>{CANCEL_PAYMENT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CANCEL_PAYMENT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CancelPaymentForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CancelPaymentForm>
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
        <DrawerHeader>
          <DrawerTitle>{CANCEL_PAYMENT_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CANCEL_PAYMENT_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CancelPaymentForm form={form} onSubmit={handleSubmit}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CancelPaymentForm>
      </DrawerContent>
    </Drawer>
  );
}

function DevelopmentZodError({
  form,
}: {
  form: UseFormReturn<CancelPaymentInput>;
}) {
  console.log("Ingresando a DevelopmentZodError", process.env.NEXT_PUBLIC_ENV);
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<CancelPaymentInput>>({});
  useEffect(() => {
    if (form.formState.errors) {
      setErrors(form.formState.errors);
    }
  }, [form.formState.errors]);
  return (
    <div>
      <div>
        {Object.keys(errors).map((key) => (
          <p key={key}>
            {key}: {errors[key as keyof CancelPaymentInput]?.message}
          </p>
        ))}
      </div>
    </div>
  );
}
