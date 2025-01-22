"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateServiceDto, createServiceSchema } from "../_interfaces/service.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateServiceForm } from "./CreateServiceForm";
import { useServices } from "../_hooks/useServices";
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

const CREATE_SERVICE_MESSAGES = {
  button: "Crear servicio",
  title: "Registrar nuevo servicio",
  description: "Rellena los campos para crear un nuevo servicio",
  success: "Servicio creado exitosamente",
  submitButton: "Crear servicio",
  cancel: "Cancelar",
} as const;

export function CreateServiceDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useServices();

  const form = useForm<CreateServiceDto>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      serviceTypeId: "",
    },
  });

  function handleSubmit(input: CreateServiceDto) {
    if (createMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      createMutation.mutate(input, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error("Error al crear servicio:", error);
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
        {CREATE_SERVICE_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_SERVICE_MESSAGES.cancel}
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
      {CREATE_SERVICE_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{CREATE_SERVICE_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_SERVICE_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateServiceForm form={form} onSubmit={handleSubmit}>
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateServiceForm>
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
          <DrawerTitle>{CREATE_SERVICE_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_SERVICE_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreateServiceForm form={form} onSubmit={handleSubmit}>
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateServiceForm>
      </DrawerContent>
    </Drawer>
  );
} 