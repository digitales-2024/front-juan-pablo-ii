"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStaffScheduleDto, createStaffScheduleSchema } from "../_interfaces/staff-schedules.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaffSchedules } from "../_hooks/useStaffSchedules";
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
import { CreateStaffScheduleForm } from "./CreateStaffScheduleForm";

const CREATE_STAFF_SCHEDULE_MESSAGES = {
  button: "Crear horario",
  title: "Registrar nuevo horario",
  description: "Rellena los campos para crear un nuevo horario",
  success: "Horario creado exitosamente",
  submitButton: "Crear horario",
  cancel: "Cancelar",
} as const;

export function CreateStaffScheduleDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useStaffSchedules();

  const form = useForm<CreateStaffScheduleDto>({
    resolver: zodResolver(createStaffScheduleSchema),
    defaultValues: {
      staffId: "",
      branchId: "",
      title: "",
      color: "sky",
      startTime: "08:00",
      endTime: "17:00",
      daysOfWeek: [],
      recurrence: {
        frequency: "YEARLY",
        interval: 1
      },
      exceptions: [],
    },
  });

  function handleSubmit(input: CreateStaffScheduleDto) {
    if (createMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      createMutation.mutate(input, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    });
  }

  function handleClose() {
    setOpen(false);
    form.reset();
  }

  const DialogFooterContent = () => (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <Button
        type="submit"
        form="create-staff-schedule-form"
        disabled={createMutation.isPending || isCreatePending}
        className="w-full"
      >
        {(createMutation.isPending || isCreatePending) && (
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {CREATE_STAFF_SCHEDULE_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_STAFF_SCHEDULE_MESSAGES.cancel}
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
      {CREATE_STAFF_SCHEDULE_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>{CREATE_STAFF_SCHEDULE_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_STAFF_SCHEDULE_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateStaffScheduleForm form={form} onSubmit={handleSubmit}>
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateStaffScheduleForm>
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
          <DrawerTitle>{CREATE_STAFF_SCHEDULE_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_STAFF_SCHEDULE_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreateStaffScheduleForm form={form} onSubmit={handleSubmit}>
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateStaffScheduleForm>
      </DrawerContent>
    </Drawer>
  );
} 