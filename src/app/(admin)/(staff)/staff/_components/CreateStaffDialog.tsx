"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStaffDto, createStaffSchema } from "../_interfaces/staff.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaff } from "../_hooks/useStaff";
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
import { CreateStaffForm } from "./CreateStaffForm";

const CREATE_STAFF_MESSAGES = {
  button: "Crear personal",
  title: "Registrar nuevo personal",
  description: "Rellena los campos para crear un nuevo personal",
  success: "Personal creado exitosamente",
  submitButton: "Crear personal",
  cancel: "Cancelar",
} as const;

export function CreateStaffDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useStaff();

  const form = useForm<CreateStaffDto>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      staffTypeId: "",
      name: "",
      lastName: "",
      dni: "",
      birth: "",
      email: "",
      phone: "",
      cmp: "",
      userId: "",
      branchId: "", // Agregar este campo
    },
  });

  function handleSubmit(input: CreateStaffDto) {
    if (createMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      createMutation.mutate(input, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error("Error al crear personal:", error);
          form.reset();
        },
      });
    });
  }

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 flex flex-col-reverse sm:flex-row-reverse sm:gap-2 w-full">
      <Button
        type="submit"
        disabled={isCreatePending || createMutation.isPending}
        className="w-full sm:w-auto"
        form="create-staff-form"
      >
        {(isCreatePending || createMutation.isPending) && (
          <RefreshCcw
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {CREATE_STAFF_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={handleClose}
      >
        {CREATE_STAFF_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      variant="outline"
      size="sm"
      className="flex items-center text-xs sm:text-sm"
    >
      <Plus className="size-3 sm:size-4 mr-1 sm:mr-2" aria-hidden="true" />
      {CREATE_STAFF_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[85vh]">
          <DialogHeader className="text-left sm:text-center">
            <DialogTitle className="text-lg sm:text-xl">
              {CREATE_STAFF_MESSAGES.title}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {CREATE_STAFF_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 sm:p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm sm:text-base">
            <p className="font-semibold">
              Recuerda ingresar el CMP si estás creando un personal médico.
            </p>
          </div>
          <div className="overflow-y-auto pr-1">
            <CreateStaffForm form={form} onSubmit={handleSubmit}>
              <DialogFooter>
                <DialogFooterContent />
              </DialogFooter>
            </CreateStaffForm>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6 pt-4 max-h-[90vh]">
        <DrawerHeader className="px-0 pb-4">
          <DrawerTitle className="text-lg">
            {CREATE_STAFF_MESSAGES.title}
          </DrawerTitle>
          <DrawerDescription>
            {CREATE_STAFF_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm mb-4">
          <p className="font-semibold">
            Recuerda ingresar el CMP si estás creando un personal médico.
          </p>
        </div>
        <div className="overflow-y-auto pr-1 pb-16">
          <CreateStaffForm form={form} onSubmit={handleSubmit}>
            <DrawerFooter className="px-0 pt-4">
              <DialogFooterContent />
            </DrawerFooter>
          </CreateStaffForm>
        </div>
      </DrawerContent>
    </Drawer>
  );
}