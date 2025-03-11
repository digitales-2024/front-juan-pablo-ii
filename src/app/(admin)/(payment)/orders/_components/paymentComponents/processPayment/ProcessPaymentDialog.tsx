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
  ProcessPaymentInput,
  processPaymentSchema,
} from "../../../_interfaces/order.interface";
import { usePayments } from "../../../_hooks/usePayment";
import { toast } from "sonner";
import { ProcessPaymentForm } from "./ProcessPaymentForm";
import { ConfirmOrderDialog } from "./ConfirmDialog";
import { DialogProps } from "@radix-ui/react-dialog";

interface ProcessPaymentDialogProps extends DialogProps {
  order: Order;
  payment: Payment;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ProcessPaymentDialog({
  order,
  payment,
  showTrigger = true,
  onSuccess,
  ...props
}: ProcessPaymentDialogProps) {
  const SUBJECT_ENTITYNAME = "pago";
  const PROCESS_PAYMENT_MESSAGES = {
    button: `Procesar ${SUBJECT_ENTITYNAME}`,
    title: `Procesar ${SUBJECT_ENTITYNAME}`,
    description: `Rellena los campos para procesar el ${SUBJECT_ENTITYNAME} de "${
      orderTypeConfig[order.type].name
    }"`,
    success: `Pago procesado exitosamente`,
    submitButton: `Procesar ${SUBJECT_ENTITYNAME}`,
    cancel: "Cancelar",
  } as const;
  const [open, setOpen] = useState(props.open ?? false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { processPaymentMutation } = usePayments();

  // export const processPaymentSchema = z.object({
  //   paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "YAPE"]),
  //   amount: z.number(),
  //   voucherNumber: z.string().optional(),
  //   date: z.string(),
  //   description: z.string().optional(),
  // }) satisfies z.ZodType<ProcessPaymentDto>;

  const form = useForm<ProcessPaymentInput>({
    resolver: zodResolver(processPaymentSchema),
    defaultValues: {
      paymentMethod: payment.paymentMethod,
      amount: payment.amount,
      voucherNumber: undefined,
      date: undefined,
      description: undefined,
    },
  });

  function handleSubmit(input: ProcessPaymentInput) {
    if (processPaymentMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      processPaymentMutation.mutate(
        {
          paymentId: payment.id,
          data: input,
        },
        {
          onSuccess: () => {
            onSuccess?.();
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
      {/* <Button
        type="submit"
        disabled={isCreatePending || processPaymentMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || processPaymentMutation.isPending) && (
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {PROCESS_PAYMENT_MESSAGES.submitButton}
      </Button> */}
      <ConfirmOrderDialog
        onConfirm={async () => {
          await form.handleSubmit(handleSubmit)();
        }}
        trigger={
          <div>
            {(isCreatePending || processPaymentMutation.isPending) && (
              <RefreshCcw
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            <span>{PROCESS_PAYMENT_MESSAGES.submitButton}</span>
          </div>
        }
        isLoading={isCreatePending || processPaymentMutation.isPending}
        confirmationText="Confirmar"
      ></ConfirmOrderDialog>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {PROCESS_PAYMENT_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {PROCESS_PAYMENT_MESSAGES.button}
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
            <DialogTitle>{PROCESS_PAYMENT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {PROCESS_PAYMENT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <ProcessPaymentForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </ProcessPaymentForm>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props} open={open} onOpenChange={()=>{
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
          <DrawerTitle>{PROCESS_PAYMENT_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {PROCESS_PAYMENT_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <ProcessPaymentForm form={form} onSubmit={handleSubmit}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </ProcessPaymentForm>
      </DrawerContent>
    </Drawer>
  );
}

function DevelopmentZodError({
  form,
}: {
  form: UseFormReturn<ProcessPaymentInput>;
}) {
  console.log("Ingresando a DevelopmentZodError", process.env.NEXT_PUBLIC_ENV);
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<ProcessPaymentInput>>({});
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
            {key}: {errors[key as keyof ProcessPaymentInput]?.message}
          </p>
        ))}
      </div>
    </div>
  );
}
