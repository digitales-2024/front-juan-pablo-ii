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
  RefundPaymentInput,
  refundPaymentSchema,
} from "../../../_interfaces/order.interface";
import { usePayments } from "../../../_hooks/usePayment";
import { toast } from "sonner";
import { ConfirmOrderDialog } from "./ConfirmDialog";
import { RefundPaymentForm } from "./RefundPaymentForm";
import { DialogProps } from "@radix-ui/react-dialog";

interface ProcessPaymentDialogProps extends DialogProps {
  order: Order;
  payment: Payment;
  showTrigger?: boolean;
}

export function RefundPaymentDialog({
  order,
  payment,
  showTrigger = true,
  ...props
}: ProcessPaymentDialogProps) {
  const SUBJECT_ENTITYNAME = "pago";
  const REFUND_PAYMENT_MESSAGES = {
    button: `Reembolsar ${SUBJECT_ENTITYNAME}`,
    title: `Reembolsar ${SUBJECT_ENTITYNAME}`,
    description: `Rellena los campos para reembolsar el ${SUBJECT_ENTITYNAME} de "${
      orderTypeConfig[order.type].name
    }"`,
    success: `Reembolso procesado exitosamente`,
    submitButton: `Reembolsar ${SUBJECT_ENTITYNAME}`,
    cancel: "Cancelar",
  } as const;
  const [open, setOpen] = useState(props.open ?? false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { refundPaymentMutation } = usePayments();

  const form = useForm<RefundPaymentInput>({
    resolver: zodResolver(refundPaymentSchema),
    defaultValues: {
        amount: payment.amount,
        reason: undefined,
        refundMethod: 'BANK_TRANSFER',
        notes: undefined,
    },
  });

  function handleSubmit(input: RefundPaymentInput) {
    if (refundPaymentMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      refundPaymentMutation.mutate(
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
            {(isCreatePending || refundPaymentMutation.isPending) && (
              <RefreshCcw
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            <span>{REFUND_PAYMENT_MESSAGES.submitButton}</span>
          </div>
        }
        isLoading={isCreatePending || refundPaymentMutation.isPending}
        confirmationText="Confirmar"
      ></ConfirmOrderDialog>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {REFUND_PAYMENT_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {REFUND_PAYMENT_MESSAGES.button}
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
            <DialogTitle>{REFUND_PAYMENT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {REFUND_PAYMENT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <RefundPaymentForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </RefundPaymentForm>
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
          <DrawerTitle>{REFUND_PAYMENT_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {REFUND_PAYMENT_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <RefundPaymentForm form={form} onSubmit={handleSubmit}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </RefundPaymentForm>
      </DrawerContent>
    </Drawer>
  );
}

function DevelopmentZodError({
  form,
}: {
  form: UseFormReturn<RefundPaymentInput>;
}) {
  console.log("Ingresando a DevelopmentZodError", process.env.NEXT_PUBLIC_ENV);
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<RefundPaymentInput>>({});
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
            {key}: {errors[key as keyof RefundPaymentInput]?.message}
          </p>
        ))}
      </div>
    </div>
  );
}
