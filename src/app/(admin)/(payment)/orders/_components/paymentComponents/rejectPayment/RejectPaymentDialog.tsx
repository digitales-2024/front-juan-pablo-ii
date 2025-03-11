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
  RejectPaymentInput,
  rejectPaymentSchema,
} from "../../../_interfaces/order.interface";
import { usePayments } from "../../../_hooks/usePayment";
import { toast } from "sonner";
import { ConfirmOrderDialog } from "./ConfirmDialog";
import { RejectPaymentForm } from "./RejectPaymentForm";
import { DialogProps } from "@radix-ui/react-dialog";

interface RejectPaymentDialogProps extends DialogProps{
  order: Order;
  payment: Payment;
  showTrigger?: boolean;
}

export function RejectPaymentDialog({
  order,
  payment,
  showTrigger = true,
  ...props
}: RejectPaymentDialogProps) {
  const SUBJECT_ENTITYNAME = "pago";
  const REJECT_PAYMENT_MESSAGES = {
    button: `Rechazar ${SUBJECT_ENTITYNAME}`,
    title: `Rechazar ${SUBJECT_ENTITYNAME}`,
    description: `Rellena los campos para verificar el ${SUBJECT_ENTITYNAME} de "${
      orderTypeConfig[order.type].name
    }"`,
    success: `Pago procesado exitosamente`,
    submitButton: `Rechazar ${SUBJECT_ENTITYNAME}`,
    cancel: "Cancelar",
  } as const;
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { rejectPaymentMutation } = usePayments();

// export const rejectPaymentSchema = z.object({
//   rejectionReason: z.string(),
// }) satisfies z.ZodType<RejectPaymentDto>;

  const form = useForm<RejectPaymentInput>({
    resolver: zodResolver(rejectPaymentSchema),
    defaultValues: {
        rejectionReason: undefined,
    }
  });

  function handleSubmit(input: RejectPaymentInput) {
    if (rejectPaymentMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      rejectPaymentMutation.mutate(
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
        disabled={isCreatePending || rejectPaymentMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || rejectPaymentMutation.isPending) && (
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {REJECT_PAYMENT_MESSAGES.submitButton}
      </Button> */}
      <ConfirmOrderDialog
        onConfirm={async () => {
          await form.handleSubmit(handleSubmit)();
        }}
        trigger={
          <div>
            {(isCreatePending || rejectPaymentMutation.isPending) && (
              <RefreshCcw
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            <span>{REJECT_PAYMENT_MESSAGES.submitButton}</span>
          </div>
        }
        isLoading={isCreatePending || rejectPaymentMutation.isPending}
        confirmationText="Confirmar"
      ></ConfirmOrderDialog>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {REJECT_PAYMENT_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {REJECT_PAYMENT_MESSAGES.button}
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
            <DialogTitle>{REJECT_PAYMENT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {REJECT_PAYMENT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <RejectPaymentForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </RejectPaymentForm>
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
          <DrawerTitle>{REJECT_PAYMENT_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {REJECT_PAYMENT_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <RejectPaymentForm form={form} onSubmit={handleSubmit}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </RejectPaymentForm>
      </DrawerContent>
    </Drawer>
  );
}

function DevelopmentZodError({
  form,
}: {
  form: UseFormReturn<RejectPaymentInput>;
}) {
  console.log("Ingresando a DevelopmentZodError", process.env.NEXT_PUBLIC_ENV);
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<RejectPaymentInput>>({});
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
            {key}: {errors[key as keyof RejectPaymentInput]?.message}
          </p>
        ))}
      </div>
    </div>
  );
}
