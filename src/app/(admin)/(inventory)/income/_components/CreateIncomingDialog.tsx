"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FieldErrors, useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateIncomeInput, createIncomeSchema} from "../_interfaces/income.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateIncomingForm } from "./CreateIncomingForm";
import { useIncoming } from "../_hooks/useIncoming";
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
import { useSelectProductDispatch } from "../_hooks/useSelectProducts";

const CREATE_INCOMING_MESSAGES = {
  button: "Crear entrada",
  title: "Registrar nueva entrada",
  description: "Rellena los campos para crear una nueva entrada",
  success: "Entrada creada exitosamente",
  submitButton: "Crear entrada",
  cancel: "Cancelar",
} as const;

export function CreateIncomingDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useIncoming();
  const dispatch = useSelectProductDispatch();

  // name: string;
  // storageId: string;
  // date: string;
  // state: string;
  // description?: string | undefined;
  // referenceId?: string | undefined;

  const form = useForm<CreateIncomeInput>({
    resolver: zodResolver(createIncomeSchema, undefined, {
      raw: true, //to be able to use useFIeldArray
    }),
    defaultValues: {
      name: "",
      storageId: "",
      date: "",
      //state: "false",
      state: false,
      description: "",
      referenceId: "",
    },
  });

  const formControl = form.control; 

  const fieldArray = useFieldArray({
      control:formControl,
      name: "movement",
      rules: {
        minLength: 1
      }
    });
  const { remove } = fieldArray;

  const handleClearProductList = useCallback(() => {
    // this removes from the tanstack state management
    dispatch(
      {
        type: "clear",
      }
    )
    //THis removes from the react-hook-form arraylist
    remove();
  }, []);

  useEffect(() => {
    if (!open) {
      handleClearProductList();
    }
  }, [open, handleClearProductList]);

  function handleSubmit(input: CreateIncomeInput) {
    if (createMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      createMutation.mutate(input, {
        onSuccess: () => {
          handleClearProductList();
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
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button 
        type="submit" 
        disabled={isCreatePending || createMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || createMutation.isPending) && (
          <RefreshCcw
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {CREATE_INCOMING_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_INCOMING_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button 
      onClick={() => setOpen(true)}
      variant="outline" 
      size="sm"
    >
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {CREATE_INCOMING_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent key={open ? 'open' : 'closed'} className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{CREATE_INCOMING_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_INCOMING_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateIncomingForm form={form} onSubmit={handleSubmit} controlledFieldArray={fieldArray}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateIncomingForm>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent key={open ? 'open' : 'closed'} className="overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>{CREATE_INCOMING_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_INCOMING_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreateIncomingForm form={form} onSubmit={handleSubmit} controlledFieldArray={fieldArray}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateIncomingForm>
      </DrawerContent>
    </Drawer>
  );
}


function DevelopmentZodError({ form }: { form: UseFormReturn<CreateIncomeInput> }) {
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<CreateIncomeInput>>({});
  useEffect(() => {
    if (form.formState.errors) {
      setErrors(form.formState.errors);
    }
  }, [form.formState.errors]);
  return  (
    <div>
      <div>
        {
          Object.keys(errors).map((key) => (
            <p key={key}>
              {key}: {errors[key as keyof CreateIncomeInput]?.message}
            </p>
          ))
        }
        {
          <div>
            {Object.entries(form.getFieldState("movement")).map(([key, value]) => (
              <p key={key}>
                {key}: {JSON.stringify(value)}
              </p>
            ))}
          </div>
        }
      </div>
    </div>
  )
}