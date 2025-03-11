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
  VerifyPaymentInput,
  verifyPaymentSchema,
} from "../../../_interfaces/order.interface";
import { usePayments } from "../../../_hooks/usePayment";
import { toast } from "sonner";
import { ConfirmOrderDialog } from "./ConfirmDialog";
import { VerifyPaymentForm } from "./VerifyPaymentForm";
import { DialogProps } from "@radix-ui/react-dialog";

interface VerifyPaymentDialogProps extends DialogProps{
  order: Order;
  payment: Payment;
  showTrigger?: boolean;
}

export function VerifyPaymentDialog({
  order,
  payment,
  showTrigger = true,
  ...props
}: VerifyPaymentDialogProps) {
  const SUBJECT_ENTITYNAME = "pago";
  const VERIFY_PAYMENT_MESSAGES = {
    button: `Verificar ${SUBJECT_ENTITYNAME}`,
    title: `Verificar ${SUBJECT_ENTITYNAME}`,
    description: `Rellena los campos para verificar el ${SUBJECT_ENTITYNAME} de "${
      orderTypeConfig[order.type].name
    }"`,
    success: `Pago procesado exitosamente`,
    submitButton: `Verificar ${SUBJECT_ENTITYNAME}`,
    cancel: "Cancelar",
  } as const;
  const [open, setOpen] = useState(props.open ?? false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { verifyPaymentMutation } = usePayments();

// export const verifyPaymentSchema = z.object({
//   verificationNotes: z.string().optional(),
//   verifiedAt: z.string().optional(),
// }) satisfies z.ZodType<VerifyPaymentDto>;

  const form = useForm<VerifyPaymentInput>({
    resolver: zodResolver(verifyPaymentSchema),
    defaultValues: {
      verificationNotes: undefined,
      verifiedAt: undefined,
    },
  });

  function handleSubmit(input: VerifyPaymentInput) {
    if (verifyPaymentMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      verifyPaymentMutation.mutate(
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
        disabled={isCreatePending || verifyPaymentMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || verifyPaymentMutation.isPending) && (
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {VERIFY_PAYMENT_MESSAGES.submitButton}
      </Button> */}
      <ConfirmOrderDialog
        onConfirm={async () => {
          await form.handleSubmit(handleSubmit)();
        }}
        trigger={
          <div>
            {(isCreatePending || verifyPaymentMutation.isPending) && (
              <RefreshCcw
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            <span>{VERIFY_PAYMENT_MESSAGES.submitButton}</span>
          </div>
        }
        isLoading={isCreatePending || verifyPaymentMutation.isPending}
        confirmationText="Confirmar"
      ></ConfirmOrderDialog>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {VERIFY_PAYMENT_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {VERIFY_PAYMENT_MESSAGES.button}
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
            <DialogTitle>{VERIFY_PAYMENT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {VERIFY_PAYMENT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <VerifyPaymentForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </VerifyPaymentForm>
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
          <DrawerTitle>{VERIFY_PAYMENT_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {VERIFY_PAYMENT_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <VerifyPaymentForm form={form} onSubmit={handleSubmit}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </VerifyPaymentForm>
      </DrawerContent>
    </Drawer>
  );
}

function DevelopmentZodError({
  form,
}: {
  form: UseFormReturn<VerifyPaymentInput>;
}) {
  console.log("Ingresando a DevelopmentZodError", process.env.NEXT_PUBLIC_ENV);
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<VerifyPaymentInput>>({});
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
            {key}: {errors[key as keyof VerifyPaymentInput]?.message}
          </p>
        ))}
      </div>
    </div>
  );
}
