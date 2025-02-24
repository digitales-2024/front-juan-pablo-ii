"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateStaffScheduleDto } from "../_interfaces/staff-schedules.interface";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaff } from "../../staff/_hooks/useStaff";
import { Checkbox } from "@/components/ui/checkbox";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, toDate } from "date-fns-tz";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { colorOptions } from "../../schedules/_components/calendar/calendarTailwindClasses";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useEffect } from "react";

const TIME_ZONE = 'America/Lima';

export const DAYS_OF_WEEK = [
  { label: "Lunes", value: "MONDAY" },
  { label: "Martes", value: "TUESDAY" },
  { label: "Miércoles", value: "WEDNESDAY" },
  { label: "Jueves", value: "THURSDAY" },
  { label: "Viernes", value: "FRIDAY" },
  { label: "Sábado", value: "SATURDAY" },
  { label: "Domingo", value: "SUNDAY" },
] as const;

export const RECURRENCE_OPTIONS = [
  {
    label: "Sin patrón",
    frequency: "YEARLY",
    interval: 1,
    description: "Calendario sin eventos",
    example: "Se aplicará solo en la fecha seleccionada"
  },
  {
    label: "Días específicos",
    frequency: "WEEKLY",
    interval: 1,
    description: "Selecciona los días de la semana",
    example: "Ej: Lunes y Miércoles → Esos días cada semana"
  },
  {
    label: "Diario",
    frequency: "DAILY",
    interval: 1,
    description: "Todos los días de la semana",
    example: "Se aplicará de lunes a domingo"
  },
  {
    label: "Quincenal",
    frequency: "WEEKLY",
    interval: 2,
    description: "Mismos días cada 15 días",
    example: "Ej: Viernes → Cada 2 semanas"
  },
] as const;

export const FERIADOS_2025 = [
  '2025-01-01',    // Año Nuevo
  '2025-04-17',    // Jueves Santo
  '2025-04-18',    // Viernes Santo
  '2025-05-01',    // Día del Trabajo
  '2025-06-07',    // Batalla de Arica
  '2025-06-29',    // San Pedro y San Pablo
  '2025-07-23',    // Día de la Fuerza Aérea
  '2025-07-28',    // Fiestas Patrias
  '2025-07-29',    // Fiestas Patrias
  '2025-08-06',    // Batalla de Junín
  '2025-08-30',    // Santa Rosa de Lima
  '2025-10-08',    // Combate de Angamos
  '2025-11-01',    // Día de Todos los Santos
  '2025-12-08',    // Inmaculada Concepción
  '2025-12-09',    // Batalla de Ayacucho
  '2025-12-25'     // Navidad
];

export const DAYS_PRESETS = [
  {
    label: "Días laborables (L-V)",
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const
  },
  {
    label: "L-S",
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const
  },
  {
    label: "Todos los días",
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const
  }
];

export const allDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;

interface CreateStaffScheduleFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateStaffScheduleDto>;
  onSubmit: (data: CreateStaffScheduleDto) => void;
}

export function CreateStaffScheduleForm({
  children,
  form,
  onSubmit,
}: CreateStaffScheduleFormProps) {
  const { staff } = useStaff();
  const { branches } = useBranches();

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'recurrence.frequency') {
        if (value.recurrence?.frequency === 'DAILY') {
          form.setValue('daysOfWeek', [...allDays]);
        }
        else if (value.recurrence?.frequency === 'YEARLY') {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          form.setValue('daysOfWeek', ['WEDNESDAY'], { shouldDirty: false, shouldValidate: true });
          form.setValue('recurrence.until', format(yesterday, 'yyyy-MM-dd', { timeZone: TIME_ZONE }), { shouldDirty: false, shouldValidate: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  useEffect(() => {
    if (form.getValues('recurrence.frequency') === 'YEARLY') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      form.setValue('daysOfWeek', ['WEDNESDAY']);
      form.setValue('recurrence.until', format(yesterday, 'yyyy-MM-dd', { timeZone: TIME_ZONE }));
    }
  }, [form]);

  const handleSubmit = (data: CreateStaffScheduleDto) => {
    const payload = {
      ...data,
      exceptions: data.exceptions ?? []
    };
    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form
        id="create-staff-schedule-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col h-[600px]"
      >
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 p-1">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sucursal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de inicio</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="60"
                        {...field}
                        value={field.value || '08:00'}
                        className="w-full"
                      />
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
                      <Input
                        type="time"
                        step="60"
                        {...field}
                        value={field.value || '17:00'}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese un título para el horario" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un color" />
                      </SelectTrigger>
                    </FormControl>
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

            {form.watch('recurrence.frequency') !== 'YEARLY' && (
              <FormField
                control={form.control}
                name="daysOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Días de aplicación
                      <Tooltip>
                        <Info className="h-4 w-4" />
                        <TooltipContent className="max-w-[300px]">
                          {form.watch('recurrence.frequency') === 'DAILY'
                            ? "El horario se aplicará todos los días de la semana automáticamente"
                            : "Seleccione los días específicos para aplicar el horario"}
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>

                    {form.watch('recurrence.frequency') !== 'DAILY' &&
                      form.watch('recurrence.frequency') !== 'YEARLY' && (
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            {DAYS_PRESETS.map(preset => (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                key={preset.label}
                                onClick={() => {
                                  form.setValue('daysOfWeek', [...preset.days]);
                                }}
                              >
                                {preset.label}
                              </Button>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {DAYS_OF_WEEK.map((day) => (
                              <FormField
                                key={day.value}
                                control={form.control}
                                name="daysOfWeek"
                                render={({ field: innerField }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={innerField.value?.includes(day.value)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = innerField.value || [];
                                          if (checked) {
                                            innerField.onChange([...currentValue, day.value]);
                                          } else {
                                            innerField.onChange(
                                              currentValue.filter((value) => value !== day.value)
                                            );
                                          }
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
                        </div>
                      )}

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patrón de repetición</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const option = RECURRENCE_OPTIONS.find(opt => opt.label === value);
                      if (option) {
                        field.onChange({
                          frequency: option.frequency,
                          interval: option.interval
                        });
                      }
                    }}
                    value={RECURRENCE_OPTIONS.find(opt =>
                      opt.frequency === field.value?.frequency &&
                      opt.interval === field.value?.interval
                    )?.label || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-[56px]">
                        <SelectValue placeholder="Seleccione un patrón">
                          {field.value && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {RECURRENCE_OPTIONS.find(opt =>
                                  opt.frequency === field.value.frequency &&
                                  opt.interval === field.value.interval
                                )?.label}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {RECURRENCE_OPTIONS.find(opt =>
                                  opt.frequency === field.value.frequency &&
                                  opt.interval === field.value.interval
                                )?.description}
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="min-w-[500px]">
                      {RECURRENCE_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.label}
                          value={option.label}
                          className="py-3 group hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-baseline">
                              <span className="font-medium text-base">{option.label}</span>
                              <span className="text-muted-foreground text-sm ml-4">
                                {option.description}
                              </span>
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              {option.example}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-4 p-4 bg-blue-50 text-blue-600 rounded-lg space-y-3">
                    <p className="text-sm font-medium">¿Cómo funcionan los patrones?</p>
                    <ul className="list-disc pl-5 space-y-2.5">
                      {form.watch('recurrence.frequency') === 'YEARLY' ? (
                        <li className="text-sm">
                          <span className="font-medium block mb-1">Sin Patron:</span>
                          Este patrón crea un horario base vacío que no genera eventos automáticos.
                          Útil para crear horarios especiales o excepciones que se aplicarán manualmente
                        </li>
                      ) : (
                        <>
                          <li className="text-sm">
                            <span className="font-medium block mb-1">Días seleccionados:</span>
                            Define los días específicos de la semana que tendrán el horario
                          </li>
                          <li className="text-sm">
                            <span className="font-medium block mb-1">Intervalo:</span>
                            Determina cada cuánto se repite el ciclo (ej: cada 2 semanas)
                          </li>
                          <li className="text-sm">
                            <span className="font-medium block mb-1">Válido hasta:</span>
                            Última fecha donde se aplicará el horario
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">
                      {form.watch('recurrence.frequency') === 'YEARLY' ? (
                        <>
                          ⓘ Este horario no generará eventos automáticamente.
                          Deberás crear los eventos manualmente en el calendario
                        </>
                      ) : (
                        <>
                          ⓘ La fecha "Válido hasta" marca el ÚLTIMO DÍA donde se aplicará el horario.<br />
                          Ejemplo: Si creas un horario semanal hasta 01/08/2024 →<br />
                          Se generarán horarios cada semana hasta esa fecha inclusive.
                        </>
                      )}
                    </p>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('recurrence.frequency') !== 'YEARLY' && (
              <>
                <FormField
                  control={form.control}
                  name="recurrence.until"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Válido hasta</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              type="button"
                              disabled={form.watch('recurrence.frequency') === 'YEARLY'}
                            >
                              {field.value ? (
                                format(toDate(field.value, { timeZone: TIME_ZONE }), "yyyy-MM-dd", { timeZone: TIME_ZONE })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? toDate(field.value, { timeZone: TIME_ZONE }) : undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              field.onChange(format(date, 'yyyy-MM-dd', { timeZone: TIME_ZONE }));
                            }}
                            disabled={(date) => {
                              const now = new Date();
                              const limaDate = toDate(now, { timeZone: TIME_ZONE });
                              return date < limaDate;
                            }}
                            initialFocus
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
                  render={({ field }) => {
                    const handleAddHolidays = () => {
                      const currentExceptions = field.value || [];
                      const mergedDates = [...new Set([...currentExceptions, ...FERIADOS_2025])];
                      field.onChange(mergedDates);
                    };

                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Excepciones</FormLabel>
                        <div className="flex gap-2 mb-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddHolidays}
                          >
                            Agregar todos los feriados 2025
                          </Button>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                                type="button"
                              >
                                {(field.value?.length ?? 0) > 0
                                  ? `${field.value?.length ?? 0} fechas excluidas`
                                  : "Seleccione fechas a excluir"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="multiple"
                              selected={field.value?.map(dateString =>
                                toDate(dateString, { timeZone: TIME_ZONE })
                              )}
                              onSelect={(dates) => {
                                const formattedDates = dates?.map(d =>
                                  format(d, 'yyyy-MM-dd', { timeZone: TIME_ZONE })
                                ) || [];
                                console.log('Excepciones formateadas:', formattedDates);
                                field.onChange(formattedDates);
                              }}
                              disabled={(date) => {
                                const now = new Date();
                                const limaDate = toDate(now, { timeZone: TIME_ZONE });
                                return date < limaDate;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((dateString, index) => {
                            const date = new Date(dateString);
                            return (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => field.onChange(field.value?.filter((_, i) => i !== index) ?? [])}
                              >
                                {format(toDate(dateString, { timeZone: TIME_ZONE }), "dd/MM/yyyy", { timeZone: TIME_ZONE })}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </>
            )}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t">

        </div>

        <div className="pt-4 border-t">
          {children}
        </div>
      </form>
    </Form>
  );
} 