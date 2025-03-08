"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  useFieldArray,
  useForm,
  // FieldErrors,
  // UseFormReturn,
} from "react-hook-form";
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
import { useBilling } from "@/app/(admin)/(payment)/orders/_hooks/useBilling";
import { useSelectProductDispatch } from "../../../_hooks/useSelectProducts";
import {
  CreateProductSaleBillingDto,
  CreateProductSaleBillingInput,
  createProductSaleBillingSchema,
} from "@/app/(admin)/(payment)/orders/_interfaces/order.interface";
import {
  CreateProductSaleBillingOrderForm
} from "./CreateProductSaleBillingOrderForm";
import { toast } from "sonner";

const CREATE_OUTGOING_MESSAGES = {
  button: "Nueva venta",
  title: "Registrar nueva venta de productos",
  description: "Rellena los campos para registrar una venta de productos",
  success: "Venta creada exitosamente",
  submitButton: "Procesar venta",
  cancel: "Cancelar",
} as const;

export function CreateProductSaleBillingProcessDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createSaleOrderMutation } = useBilling();
  const dispatch = useSelectProductDispatch();

// export const createProductSaleBillingSchema = z.object({
//   branchId: z.string({
//     required_error: "Debe seleccionar la sucursal que genera la venta",
//   }),
//   patientId: z.string({
//     required_error: "Debe seleccionar un paciente",
//   }),
//   storageLocation: z.string().optional(),
//   batchNumber: z.string().optional(),
//   referenceId: z.string().optional(),
//   currency: z.string(),
//   paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "YAPE"]),
//   notes: z.string().optional(),
//   metadata: z.record(z.never()).optional(),
//   products: z.array(z.object({
//     productId: z.string(),
//     quantity: z.coerce.number(),
//     storageId: z.string({
//       required_error: "Debe seleccionar un almacén",
//     }),
//   })),
// }) satisfies z.ZodType<CreateProductSaleBillingDto>;
  const form = useForm<CreateProductSaleBillingInput>({
    resolver: zodResolver(createProductSaleBillingSchema, undefined, {
      raw: true, //to be able to use useFIeldArray
    }),
    defaultValues: {
      branchId: undefined, //required
      patientId: undefined, //required
      storageLocation: undefined,
      batchNumber: undefined,
      referenceId: undefined,
      currency: "PEN",
      paymentMethod: "CASH",
      notes: undefined,
      metadata: undefined,
      products: [],
    },
  });

  const formControl = form.control;

  const fieldArray = useFieldArray({
    control: formControl,
    name: "products",
    rules: {
      minLength: 1,
    },
  });
  const { remove } = fieldArray;

  const handleClearProductList = useCallback(() => {
    // this removes from the tanstack state management
    dispatch({
      type: "clear",
    });
    //THis removes from the react-hook-form arraylist
    remove();
  }, []);

  useEffect(() => {
    if (!open) {
      handleClearProductList();
    }
  }, [open, handleClearProductList]);

  function handleSubmit(input: CreateProductSaleBillingDto) {
    // console.log('Input received', input);
    // console.log('Ingresando a handdle submit',createMutation.isPending, isCreatePending);
    if (createSaleOrderMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      createSaleOrderMutation.mutate(input, {
        onSuccess: (res) => {
          toast.success('Venta creada exitosamente: ' + res.data.id);
          form.reset();
          setOpen(false);
        },
        onError: (error) => {
          if (error.message.includes("No autorizado")) {
            setTimeout(() => {
              form.reset();
            }, 1000);
          }
        },
      });
    });
  }

  const handleClose = () => {
    form.reset();
    handleClearProductList();
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
      <Button
        type="submit"
        disabled={isCreatePending || createSaleOrderMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || createSaleOrderMutation.isPending) && (
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {CREATE_OUTGOING_MESSAGES.submitButton}
      </Button>
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

  const TriggerButton = () => (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {CREATE_OUTGOING_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent
          key={open ? "open" : "closed"}
          className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{CREATE_OUTGOING_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_OUTGOING_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateProductSaleBillingOrderForm
            form={form}
            onSubmit={handleSubmit}
            controlledFieldArray={fieldArray}
          >
            {/* <DevelopmentZodError form={form} /> */}
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateProductSaleBillingOrderForm>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent key={open ? "open" : "closed"} className="overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>{CREATE_OUTGOING_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_OUTGOING_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreateProductSaleBillingOrderForm
          form={form}
          onSubmit={handleSubmit}
          controlledFieldArray={fieldArray}
        >
          {/* <DevelopmentZodError form={form} /> */}
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateProductSaleBillingOrderForm>
      </DrawerContent>
    </Drawer>
  );
}

// function DevelopmentZodError({
//   form,
// }: {
//   form: UseFormReturn<CreateProductSaleBillingInput>;
// }) {
//   console.log("Ingresando a DevelopmentZodError", process.env.NEXT_PUBLIC_ENV);
//   if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
//   const [errors, setErrors] = useState<
//     FieldErrors<CreateProductSaleBillingInput>
//   >({});
//   useEffect(() => {
//     if (form.formState.errors) {
//       setErrors(form.formState.errors);
//     }
//   }, [form.formState.errors]);
//   return (
//     <div>
//       <div>
//         {Object.keys(errors).map((key) => (
//           <p key={key}>
//             {key}: {errors[key as keyof CreateProductSaleBillingInput]?.message}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// }
