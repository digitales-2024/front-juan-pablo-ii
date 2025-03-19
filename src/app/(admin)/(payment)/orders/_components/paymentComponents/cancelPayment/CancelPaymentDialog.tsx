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
import { DialogProps } from "@radix-ui/react-dialog";

interface CancelPaymentDialogProps extends DialogProps {
  order: Order;
  payment: Payment;
  showTrigger?: boolean;
}

export function CancelPaymentDialog({
  order,
  payment,
  showTrigger = true,
  ...props
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
  const [open, setOpen] = useState(props.open ?? false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { cancelPaymentMutation } = usePayments();

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
            props.onOpenChange?.(false)
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
    props.onOpenChange?.(false)
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
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
      <Dialog {...props} open={props.open ?? open} onOpenChange={()=>{
        props.onOpenChange?.(!open)
        setOpen(!open)
      }}>
        {showTrigger && (
          <DialogTrigger asChild>
            <TriggerButton />
          </DialogTrigger>
        )}
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
    <Drawer {...props} open={props.open ?? open} onOpenChange={()=>{
      props.onOpenChange?.(!open)
      setOpen(!open)
    }}>
      {showTrigger && (
        <DrawerTrigger asChild>
          <TriggerButton />
        </DrawerTrigger>
      )}
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
