"use client";
import { useEffect, useState, useTransition } from "react";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePatientFormData,
  CreatePatientInput,
  createPatientSchema,
} from "../_interfaces/patient.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePatients } from "../_hooks/usePatient";
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
import { CreatePatientForm } from "./CreatePatientForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const CREATE_PATIENT_MESSAGES = {
  button: "Crear paciente",
  title: "Registrar nuevo paciente",
  description: "Rellena los campos para crear un nuevo paciente",
  success: "Paciente creado exitosamente",
  submitButton: "Crear paciente",
  cancel: "Cancelar",
} as const;

export function CreatePatientDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  //mutation hook
  const { createMutation } = usePatients();

  const form = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      data: {
        name: "",
        lastName: "",
        dni: "",
        birthDate: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
        emergencyContact: "",
        emergencyPhone: "",
        healthInsurance: "",
        maritalStatus: "",
        occupation: "",
        workplace: "",
        bloodType: "",
        primaryDoctor: "",
        language: "",
        notes: "",
        patientPhoto: "", // Este campo se mantiene vacío
      },
      image: null, // Inicializamos el campo de imagen como null
    },
  });

  function handleSubmit({ data, image }: CreatePatientFormData) {
    if (createMutation.isPending || isCreatePending) return;

    const input: CreatePatientInput = {
      ...data,
      patientPhoto: image ? URL.createObjectURL(image) : "", // Convertimos el archivo de imagen a una URL si existe
    };

    startCreateTransition(() => {
      createMutation.mutate(input, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error(
            `Error al crear ${METADATA.entityName.toLowerCase()}:`,
            error
          );
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
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {CREATE_PATIENT_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_PATIENT_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {CREATE_PATIENT_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[calc(100vh-4rem)]">
          <DialogHeader>
            <DialogTitle>{CREATE_PATIENT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_PATIENT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(100vh-16rem)] p-4">
            <CreatePatientForm form={form} onSubmit={handleSubmit}>
              <DevelopmentZodError form={form} />
              <DialogFooter>
                <DialogFooterContent />
              </DialogFooter>
            </CreatePatientForm>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-lg">
        <DrawerHeader>
          <DrawerTitle>{CREATE_PATIENT_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_PATIENT_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="max-h-[calc(100vh-16rem)] p-4">
          <CreatePatientForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DrawerFooter>
              <DialogFooterContent />
            </DrawerFooter>
          </CreatePatientForm>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function DevelopmentZodError({
  form,
}: {
  form: UseFormReturn<CreatePatientInput>;
}) {
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<CreatePatientInput>>({});
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
            {key}: {errors[key as keyof CreatePatientInput]?.message}
          </p>
        ))}
      </div>
    </div>
  );
}
