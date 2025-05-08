"use client";
import { useEffect, useState, useTransition } from "react";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStorageInput, createStorageSchema } from "../_interfaces/storage.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateStorageForm } from "./CreateStorageForm";
import { useStorages } from "../_hooks/useStorages";
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
import { METADATA } from "../_statics/metadata";

const SUBJECT_ENTITYNAME = METADATA.entityName.toLowerCase();
const CREATE_STORAGE_MESSAGES = {
  button: `Crear ${SUBJECT_ENTITYNAME}`,
  title: `Registrar nuevo ${SUBJECT_ENTITYNAME}`,
  description: `Rellena los campos para crear un nuevo ${SUBJECT_ENTITYNAME}`,
  success: `${METADATA.entityName} creado exitosamente`,
  submitButton: `Crear ${SUBJECT_ENTITYNAME}`,
  cancel: "Cancelar",
} as const;

export function CreateStorageDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useStorages();

// export const createStorageSchema = z.object({
//   name: z.string().min(1, "El nombre es requerido"),
//   location: z.string().optional(),
//   typeStorageId: z.string().uuid(),
// }) satisfies z.ZodType<CreateStorageDto>;

  const form = useForm<CreateStorageInput>({
    resolver: zodResolver(createStorageSchema),
    defaultValues: {
      name: "",
      location: "",
      typeStorageId: "",
    },
  });

  function handleSubmit(input: CreateStorageInput) {
    console.log('Ingresando a handdle submit',createMutation.isPending, isCreatePending);
    if (createMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      createMutation.mutate(input, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error(`Error al crear ${METADATA.entityName.toLowerCase()}:`, error);
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
        disabled={isCreatePending || createMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || createMutation.isPending) && (
          <RefreshCcw
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {CREATE_STORAGE_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_STORAGE_MESSAGES.cancel}
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
      {CREATE_STORAGE_MESSAGES.button}
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
            <DialogTitle>{CREATE_STORAGE_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_STORAGE_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateStorageForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateStorageForm>
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
          <DrawerTitle>{CREATE_STORAGE_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_STORAGE_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreateStorageForm form={form} onSubmit={handleSubmit}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateStorageForm>
      </DrawerContent>
    </Drawer>
  );
}


function DevelopmentZodError({ form }: { form: UseFormReturn<CreateStorageInput> }) {
  console.log('Ingresando a DevelopmentZodError', process.env.NEXT_PUBLIC_ENV);
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<CreateStorageInput>>({});
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
              {key}: {errors[key as keyof CreateStorageInput]?.message}
            </p>
          ))
        }
      </div>
    </div>
  )
}