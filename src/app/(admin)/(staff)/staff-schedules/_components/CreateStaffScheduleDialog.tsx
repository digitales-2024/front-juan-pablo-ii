"use client";
import { useState, useTransition, useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CreateStaffScheduleForm } from "./CreateStaffScheduleForm";
import { format } from "date-fns-tz";
import { es } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStaff } from "../../staff/_hooks/useStaff";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { DAYS_OF_WEEK } from "../_components/CreateStaffScheduleForm";
import { useQueryClient } from "@tanstack/react-query";
import { colorOptions } from "../../schedules/_components/calendar/calendarTailwindClasses";
import { EventFilterParams } from "../../schedules/_hooks/useEvents";


const CREATE_STAFF_SCHEDULE_MESSAGES = {
  button: "Crear horario",
  title: "Registrar nuevo horario",
  description: "Selecciona un horario predeterminado o crea uno personalizado",
  success: "Horario creado exitosamente",
  submitButton: "Crear horario",
  cancel: "Cancelar",
} as const;

const PREDEFINED_SCHEDULES = [
  {
    label: "Turno Mañana",
    value: "morning",
    weekdays: {
      title: "Turno Mañana",
      startTime: "09:00",
      endTime: "14:00",
      daysOfWeek: [1, 2, 3, 4, 5] // Lunes a Viernes
    },
    saturday: {
      title: "Turno Mañana - SÁBADOS",
      startTime: "09:00",
      endTime: "15:00",
      daysOfWeek: [6] // Sábado
    }
  },
  {
    label: "Turno Tarde",
    value: "afternoon",
    weekdays: {
      title: "Turno Tarde",
      startTime: "14:00",
      endTime: "18:00",
      daysOfWeek: [1, 2, 3, 4, 5] // Lunes a Viernes
    },
    saturday: {
      title: "Turno Tarde - SÁBADOS",
      startTime: "09:00",
      endTime: "15:00",
      daysOfWeek: [6] // Sábado
    }
  }
] as const;

export function CreateStaffScheduleDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useStaffSchedules();
  const { staff } = useStaff();
  // const { branches } = useBranches();
  const queryClient = useQueryClient();

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

  const [selectedSchedule, setSelectedSchedule] = useState<string>("morning");
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);

  const staffId = form.watch("staffId");
  const branchId = form.watch("branchId");

  useEffect(() => {
    const selected = PREDEFINED_SCHEDULES.find(s => s.value === selectedSchedule);
    const staffMember = staff?.find(s => s.id === staffId);

    if (!isTitleManuallyEdited) {
      if (staffMember && selected) {
        const defaultTitle = `${selected.label}-${staffMember?.name} ${staffMember?.lastName}`;
        form.setValue("title", defaultTitle);
      } else if (selected) {
        form.setValue("title", selected.label);
      } else {
        form.setValue("title", "");
      }
    }
  }, [selectedSchedule, staffId, branchId, staff, isTitleManuallyEdited]);

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

  const handlePredefinedSubmit = () => {
    const selected = PREDEFINED_SCHEDULES.find(s => s.value === selectedSchedule);
    if (!selected) return;

    const staffId = form.getValues("staffId");
    const branchId = form.getValues("branchId");
    const color = form.getValues("color");
    const staffMember = staff?.find(s => s.id === staffId);
    const defaultTitle = staffMember ? `${selected.label}-${staffMember?.name} ${staffMember?.lastName}` : selected.label;

    const baseSchedule = {
      ...form.getValues(),
      staffId,
      branchId,
      title: defaultTitle,
      color: color,
      startTime: selected.weekdays.startTime,
      endTime: selected.weekdays.endTime,
      daysOfWeek: selected.weekdays.daysOfWeek.map(day => DAYS_OF_WEEK[day - 1].value),
      recurrence: {
        frequency: "WEEKLY",
        interval: 1,
        until: endDate ? format(endDate, "yyyy-MM-dd") : ""
      },
      exceptions: [],
    };

    const schedules = [
      {
        ...baseSchedule,
        ...selected.weekdays,
        daysOfWeek: selected.weekdays.daysOfWeek.map(day => DAYS_OF_WEEK[day - 1].value)
      },
      {
        ...baseSchedule,
        ...selected.saturday,
        daysOfWeek: selected.saturday.daysOfWeek.map(day => DAYS_OF_WEEK[day - 1].value)
      }
    ];

    startCreateTransition(() => {
      Promise.all([
        createMutation.mutateAsync(schedules[0] as CreateStaffScheduleDto),
        createMutation.mutateAsync(schedules[1] as CreateStaffScheduleDto)
      ]).then(() => {
        // Obtener los filtros actuales
        const calendarFilters = queryClient.getQueryData<EventFilterParams>(['calendar-filters']);

        // Invalidar la query específica
        queryClient.refetchQueries({
          queryKey: ['calendar-turns', calendarFilters]
        });

        // Invalidar también todas las queries relacionadas
        queryClient.refetchQueries({
          queryKey: ['calendar-turns'],
        });

        setOpen(false);
        form.reset();
      }).catch((error) => {
        console.error('Error creating schedules:', error);
      });
    });
  };

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

  const ScheduleSelector = () => {
    const { staff } = useStaff();
    const { branches } = useBranches();

    return (
      <Form {...form}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {PREDEFINED_SCHEDULES.map((schedule) => (
              <Button
                key={schedule.value}
                variant={selectedSchedule === schedule.value ? "default" : "outline"}
                onClick={() => setSelectedSchedule(schedule.value)}
              >
                {schedule.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <FormLabel>Personal</FormLabel>
            <Select
              onValueChange={(value) => form.setValue("staffId", value)}
              defaultValue={form.getValues("staffId")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un personal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {staff?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FormLabel>Sucursal</FormLabel>
            <Select
              onValueChange={(value) => form.setValue("branchId", value)}
              defaultValue={form.getValues("branchId")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una sucursal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {branches?.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FormLabel>Título del horario</FormLabel>
            <Input
              placeholder="Título del horario"
              value={form.watch("title")}
              onChange={(e) => {
                form.setValue("title", e.target.value);
                setIsTitleManuallyEdited(true);
              }}
            />
          </div>

          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={(date) => setEndDate(date || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <FormLabel>Color del horario</FormLabel>
            <Select onValueChange={(value) => form.setValue("color", value)}>
              <FormControl>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-3 rounded-full bg-${form.watch("color")}-500`}
                    />
                    <SelectValue placeholder="Selecciona un color" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full bg-${color.value}-500`} />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Ocultar opciones avanzadas" : "Mostrar opciones avanzadas"}
          </Button>
        </div>
      </Form>
    );
  };

  if (isDesktop) {
    return (
      <>
        <TriggerButton />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-screen-md">
            <DialogHeader>
              <DialogTitle>{CREATE_STAFF_SCHEDULE_MESSAGES.title}</DialogTitle>
              <DialogDescription>
                {CREATE_STAFF_SCHEDULE_MESSAGES.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {!showAdvanced && <ScheduleSelector />}

              {showAdvanced && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-4"
                    onClick={() => setShowAdvanced(false)}
                  >
                    ← Volver a opciones sencillas
                  </Button>
                  <CreateStaffScheduleForm form={form} onSubmit={handleSubmit}>
                    <DialogFooter>
                      <DialogFooterContent />
                    </DialogFooter>
                  </CreateStaffScheduleForm>
                </>
              )}
            </div>
            {!showAdvanced && (
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handlePredefinedSubmit}
                  disabled={createMutation.isPending || isCreatePending}
                  className="w-full"
                >
                  {CREATE_STAFF_SCHEDULE_MESSAGES.submitButton}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <TriggerButton />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{CREATE_STAFF_SCHEDULE_MESSAGES.title}</DrawerTitle>
            <DrawerDescription>
              {CREATE_STAFF_SCHEDULE_MESSAGES.description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4">
            {!showAdvanced && <ScheduleSelector />}
            {showAdvanced && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-4"
                  onClick={() => setShowAdvanced(false)}
                >
                  ← Volver a opciones sencillas
                </Button>
                <CreateStaffScheduleForm form={form} onSubmit={handleSubmit}>
                  <DrawerFooter>
                    <DialogFooterContent />
                  </DrawerFooter>
                </CreateStaffScheduleForm>
              </>
            )}
          </div>
          {!showAdvanced && (
            <DrawerFooter>
              <Button
                type="button"
                onClick={handlePredefinedSubmit}
                disabled={createMutation.isPending || isCreatePending}
                className="w-full"
              >
                {CREATE_STAFF_SCHEDULE_MESSAGES.submitButton}
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
} 