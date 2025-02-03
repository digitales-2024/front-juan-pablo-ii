"use client";
import { useEffect, useState, useTransition } from "react";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTypeStorageInput, createTypeStorageSchema } from "../_interfaces/storageTypes.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTypeStorageForm } from "./CreateStorageTypeForm";
import { useTypeStorages } from "../_hooks/useStorageTypes";
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
const CREATE_TYPE_STORAGE_MESSAGES = {
  button: `Crear ${SUBJECT_ENTITYNAME}`,
  title: `Registrar nuevo ${SUBJECT_ENTITYNAME}`,
  description: `Rellena los campos para crear un nuevo ${SUBJECT_ENTITYNAME}`,
  success: `${METADATA.entityName} creado exitosamente`,
  submitButton: `Crear ${SUBJECT_ENTITYNAME}`,
  cancel: "Cancelar",
} as const;

export function CreateTypeStorageDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useTypeStorages();

// export const createTypeStorageSchema = z.object({
//   name: z.string().min(1, "El nombre es requerido"),
//   description: z.string().optional(),
//   branchId: z.string().uuid().optional(),
//   staffId: z.string().uuid().optional(),
// }) satisfies z.ZodType<CreateTypeStorageDto>;

  const form = useForm<CreateTypeStorageInput>({
    resolver: zodResolver(createTypeStorageSchema),
    defaultValues: {
      name: "",
      description: "",
      branchId: "",
      staffId: "",
    },
  });

  function handleSubmit(input: CreateTypeStorageInput) {
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
        {CREATE_TYPE_STORAGE_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_TYPE_STORAGE_MESSAGES.cancel}
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
      {CREATE_TYPE_STORAGE_MESSAGES.button}
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
            <DialogTitle>{CREATE_TYPE_STORAGE_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_TYPE_STORAGE_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateTypeStorageForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateTypeStorageForm>
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
          <DrawerTitle>{CREATE_TYPE_STORAGE_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_TYPE_STORAGE_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreateTypeStorageForm form={form} onSubmit={handleSubmit}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateTypeStorageForm>
      </DrawerContent>
    </Drawer>
  );
}


function DevelopmentZodError({ form }: { form: UseFormReturn<CreateTypeStorageInput> }) {
  console.log('Ingresando a DevelopmentZodError', process.env.NEXT_PUBLIC_ENV);
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<CreateTypeStorageInput>>({});
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
              {key}: {errors[key as keyof CreateTypeStorageInput]?.message}
            </p>
          ))
        }
      </div>
    </div>
  )
}