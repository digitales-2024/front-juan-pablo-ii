"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBranchInput, createBranchSchema } from "../_interfaces/branch.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateBranchForm } from "./CreateBranchForm";
import { useBranches } from "../_hooks/useBranches";
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

const CREATE_BRANCH_MESSAGES = {
  button: "Crear sucursal",
  title: "Registrar nueva sucursal",
  description: "Rellena los campos para crear una nueva sucursal",
  success: "Sucursal creada exitosamente",
  submitButton: "Crear sucursal",
  cancel: "Cancelar",
} as const;

export function CreateBranchDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useBranches();

  const form = useForm<CreateBranchInput>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
    mode: "onChange",
  });

  async function handleSubmit(input: CreateBranchInput) {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createMutation.mutateAsync(input, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error("Error al crear sucursal:", error);
        },
      });
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setOpen(false);
    }
  };

  const isLoading = isSubmitting || createMutation.isPending;

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button 
        type="submit" 
        disabled={isLoading || !form.formState.isValid}
        className="w-full"
      >
        {isLoading && (
          <RefreshCcw
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {isLoading ? "Creando..." : CREATE_BRANCH_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
        disabled={isLoading}
      >
        {CREATE_BRANCH_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button 
      onClick={() => !isLoading && setOpen(true)} 
      variant="outline" 
      size="sm"
      disabled={isLoading}
    >
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {CREATE_BRANCH_MESSAGES.button}
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
            <DialogTitle>{CREATE_BRANCH_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_BRANCH_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateBranchForm form={form} onSubmit={handleSubmit}>
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateBranchForm>
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
          <DrawerTitle>{CREATE_BRANCH_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_BRANCH_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreateBranchForm form={form} onSubmit={handleSubmit}>
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateBranchForm>
      </DrawerContent>
    </Drawer>
  );
}
