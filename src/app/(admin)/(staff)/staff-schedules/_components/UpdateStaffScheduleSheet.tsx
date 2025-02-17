"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { StaffSchedule, UpdateStaffScheduleDto, updateStaffScheduleSchema } from "../_interfaces/staff-schedules.interface";
import { PencilIcon, RefreshCcw, X } from "lucide-react";
import { useStaffSchedules } from "../_hooks/useStaffSchedules";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, toDate } from "date-fns-tz";
import { Badge } from "@/components/ui/badge";
import { colorOptions } from "@/app/(admin)/(staff)/schedules/_components/calendar/calendarTailwindClasses";

const DAYS_OF_WEEK = [
  { label: "Lunes", value: "MONDAY" },
  { label: "Martes", value: "TUESDAY" },
  { label: "Miércoles", value: "WEDNESDAY" },
  { label: "Jueves", value: "THURSDAY" },
  { label: "Viernes", value: "FRIDAY" },
  { label: "Sábado", value: "SATURDAY" },
  { label: "Domingo", value: "SUNDAY" },
] as const;

const TIME_ZONE = 'America/Lima';

interface UpdateStaffScheduleSheetProps {
  schedule: StaffSchedule;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateStaffScheduleSheet({ 
  schedule, 
  open: controlledOpen, 
  onOpenChange,
  showTrigger = true
}: UpdateStaffScheduleSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = useStaffSchedules();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const form = useForm<UpdateStaffScheduleDto>({
    resolver: zodResolver(updateStaffScheduleSchema),
    defaultValues: {
      title: schedule.title,
      color: schedule.color,
      daysOfWeek: schedule.daysOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      staffId: schedule.staffId,
      branchId: schedule.branchId,
      recurrence: schedule.recurrence,
      exceptions: schedule.exceptions
    },
  });

  const onSubmit = async (data: UpdateStaffScheduleDto) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync({
        id: schedule.id,
        data,
      }, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast.error(error.message || "Error al actualizar el horario");
        },
      });
    } catch (error) {
      console.error("Error en onSubmit:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Actualizar Horario</SheetTitle>
          <SheetDescription>
            Actualiza toda la información del horario y guarda los cambios
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del horario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className={`w-4 h-4 rounded-full bg-${color.value}-500`}
                              />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="daysOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días de la semana</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name="daysOfWeek"
                          render={({ field: innerField }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={innerField.value?.includes(day.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = innerField.value || [];
                                    checked 
                                      ? innerField.onChange([...currentValue, day.value])
                                      : innerField.onChange(currentValue.filter(v => v !== day.value));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de inicio</FormLabel>
                      <FormControl>
                        <Input type="time" step="60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de fin</FormLabel>
                      <FormControl>
                        <Input type="time" step="60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="recurrence.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frecuencia</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">Diario</SelectItem>
                          <SelectItem value="WEEKLY">Semanal</SelectItem>
                          <SelectItem value="MONTHLY">Mensual</SelectItem>
                          <SelectItem value="YEARLY">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurrence.interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intervalo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="recurrence.until"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Válido hasta</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="text-left">
                          {field.value ? 
                            format(toDate(field.value, { timeZone: TIME_ZONE }), "yyyy-MM-dd", { timeZone: TIME_ZONE }) : 
                            "Seleccionar fecha"}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value ? toDate(field.value, { timeZone: TIME_ZONE }) : undefined}
                          onSelect={(date) => {
                            if (!date) return;
                            field.onChange(format(date, 'yyyy-MM-dd', { timeZone: TIME_ZONE }));
                          }}
                          disabled={(date) => date < toDate(new Date(), { timeZone: TIME_ZONE })}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exceptions"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Excepciones</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="text-left">
                          {(field.value?.length ?? 0) > 0 
                            ? `${field.value?.length ?? 0} fechas excluidas`
                            : "Seleccionar excepciones"}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="multiple"
                          selected={field.value?.map(dateString => toDate(dateString, { timeZone: TIME_ZONE }))}
                          onSelect={(dates) => {
                            const formattedDates = dates?.map(d => 
                              format(d, 'yyyy-MM-dd', { timeZone: TIME_ZONE })
                            ) || [];
                            field.onChange(formattedDates);
                          }}
                          disabled={(date) => date < toDate(new Date(), { timeZone: TIME_ZONE })}
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value?.map((dateString, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => field.onChange(field.value?.filter((_, i) => i !== index) ?? [])}
                        >
                          {format(toDate(dateString, { timeZone: TIME_ZONE }), "dd/MM/yyyy", { timeZone: TIME_ZONE })}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <RefreshCcw className="mr-2 size-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar"
                    )}
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}



