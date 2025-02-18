"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn } from "react-hook-form"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  type StaffSchedule,
  type UpdateStaffScheduleDto,
  updateStaffScheduleSchema,
} from "../_interfaces/staff-schedules.interface"
import { PencilIcon, RefreshCcw, X, Info } from "lucide-react"
import { useStaffSchedules } from "../_hooks/useStaffSchedules"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, toDate } from "date-fns-tz"
import { Badge } from "@/components/ui/badge"
import { colorOptions } from "@/app/(admin)/(staff)/schedules/_components/calendar/calendarTailwindClasses"
import { RECURRENCE_OPTIONS, DAYS_PRESETS, FERIADOS_2025, allDays } from "./CreateStaffScheduleForm"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

const DAYS_OF_WEEK = [
  { label: "Lunes", value: "MONDAY" },
  { label: "Martes", value: "TUESDAY" },
  { label: "Miércoles", value: "WEDNESDAY" },
  { label: "Jueves", value: "THURSDAY" },
  { label: "Viernes", value: "FRIDAY" },
  { label: "Sábado", value: "SATURDAY" },
  { label: "Domingo", value: "SUNDAY" },
] as const

const TIME_ZONE = "America/Lima"

interface UpdateStaffScheduleSheetProps {
  schedule: StaffSchedule
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
}

export function UpdateStaffScheduleSheet({
  schedule,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdateStaffScheduleSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const { updateMutation } = useStaffSchedules()

  const isOpen = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen

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
      exceptions: schedule.exceptions,
    },
  })

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "recurrence.frequency") {
        if (value.recurrence?.frequency === "DAILY") {
          form.setValue("daysOfWeek", [...allDays], { shouldValidate: true })
        } else if (value.recurrence?.frequency === "YEARLY") {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          form.setValue("daysOfWeek", ["WEDNESDAY"], { shouldValidate: true })
          form.setValue("recurrence.until", format(yesterday, "yyyy-MM-dd", { timeZone: TIME_ZONE }), {
            shouldValidate: true,
          })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: UpdateStaffScheduleDto) => {
    if (updateMutation.isPending) return

    try {
      await updateMutation.mutateAsync(
        {
          id: schedule.id,
          data,
        },
        {
          onSuccess: () => {
            setOpen(false)
            form.reset()
            toast.success("Horario actualizado exitosamente")
          },
          onError: (error) => {
            toast.error(error.message || "Error al actualizar el horario")
          },
        },
      )
    } catch (error) {
      console.error("Error en onSubmit:", error)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="sm:max-w-3xl w-[95vw]">
        <SheetHeader>
          <SheetTitle>Actualizar Horario</SheetTitle>
          <SheetDescription>Actualiza toda la información del horario y guarda los cambios</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-[calc(100vh-100px)] mt-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 p-1">
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
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un color" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <RecurrenceField form={form} />

                {form.watch("recurrence.frequency") !== "YEARLY" && <DaysOfWeekField form={form} />}

                <TimeRangeFields form={form} />

                <ExceptionsField form={form} />
              </div>
            </ScrollArea>

            <SheetFooter>
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={updateMutation.isPending}>
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
      </SheetContent>
    </Sheet>
  )
}

interface RecurrenceFieldProps {
  form: UseFormReturn<UpdateStaffScheduleDto>;
}

function RecurrenceField({ form }: RecurrenceFieldProps) {
  return (
    <FormField
      control={form.control}
      name="recurrence"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Patrón de repetición</FormLabel>
          <Select
            onValueChange={(value) => {
              const option = RECURRENCE_OPTIONS.find((opt) => opt.label === value)
              if (option) {
                field.onChange({
                  frequency: option.frequency,
                  interval: option.interval,
                })
              }
            }}
            value={
              RECURRENCE_OPTIONS.find(
                (opt) => opt.frequency === field.value?.frequency && opt.interval === field.value?.interval,
              )?.label || ""
            }
          >
            <FormControl>
              <SelectTrigger className="h-[56px]">
                <SelectValue placeholder="Seleccione un patrón">
                  {field.value && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {
                          RECURRENCE_OPTIONS.find(
                            (opt) => opt.frequency === field.value?.frequency && opt.interval === field.value?.interval,
                          )?.label
                        }
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {
                          RECURRENCE_OPTIONS.find(
                            (opt) => opt.frequency === field.value?.frequency && opt.interval === field.value?.interval,
                          )?.description
                        }
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
                      <span className="text-muted-foreground text-sm ml-4">{option.description}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">{option.example}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-4 p-4 bg-blue-50 text-blue-600 rounded-lg space-y-3">
            <p className="text-sm font-medium">¿Cómo funcionan los patrones?</p>
            <ul className="list-disc pl-5 space-y-2.5">
              {form.watch("recurrence.frequency") === "YEARLY" ? (
                <li className="text-sm">
                  <span className="font-medium block mb-1">Sin Patron:</span>
                  Este horario no generará eventos automáticamente
                </li>
              ) : (
                <>
                  <li className="text-sm">
                    <span className="font-medium block mb-1">Días seleccionados:</span>
                    Define los días específicos de la semana que tendrán el horario
                  </li>
                  <li className="text-sm">
                    <span className="font-medium block mb-1">Intervalo:</span>
                    Determina cada cuánto se repite el ciclo
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-4 p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600">
              {form.watch("recurrence.frequency") === "YEARLY" ? (
                <>ⓘ Este horario no generará eventos automáticamente</>
              ) : (
                <>ⓘ La fecha "Válido hasta" marca el ÚLTIMO DÍA donde se aplicará el horario</>
              )}
            </p>
          </div>
        </FormItem>
      )}
    />
  )
}

interface DaysOfWeekFieldProps {
  form: UseFormReturn<UpdateStaffScheduleDto>;
}

function DaysOfWeekField({ form }: DaysOfWeekFieldProps) {
  return (
    <FormField
      control={form.control}
      name="daysOfWeek"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Días de aplicación
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  {form.watch("recurrence.frequency") === "DAILY"
                    ? "El horario se aplicará todos los días de la semana automáticamente"
                    : "Seleccione los días específicos para aplicar el horario"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {DAYS_PRESETS.map((preset) => (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  key={preset.label}
                  onClick={() => form.setValue("daysOfWeek", [...preset.days], { shouldValidate: true })}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                            const currentValue = innerField.value || []
                            if (checked) {
                              innerField.onChange([...currentValue, day.value])
                            } else {
                              innerField.onChange(currentValue.filter((value) => value !== day.value))
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{day.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </FormItem>
      )}
    />
  )
}

interface TimeRangeFieldsProps {
  form: UseFormReturn<UpdateStaffScheduleDto>;
}

function TimeRangeFields({ form }: TimeRangeFieldsProps) {
  return (
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
  )
}

interface ExceptionsFieldProps {
  form: UseFormReturn<UpdateStaffScheduleDto>;
}

function ExceptionsField({ form }: ExceptionsFieldProps) {
  const handleAddHolidays = () => {
    const currentExceptions = form.getValues("exceptions") || []
    const mergedDates = [...new Set([...currentExceptions, ...FERIADOS_2025])]
    form.setValue("exceptions", mergedDates, { shouldValidate: true })
  }

  return (
    <FormField
      control={form.control}
      name="exceptions"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Excepciones</FormLabel>
          <div className="flex gap-2 mb-2">
            <Button type="button" variant="outline" size="sm" onClick={handleAddHolidays}>
              Agregar feriados 2025
            </Button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-left">
                {(field.value?.length ?? 0) > 0
                  ? `${field.value?.length ?? 0} fechas excluidas`
                  : "Seleccionar excepciones"}
                {/* <CalendarIcon className="ml-2 h-4 w-4" /> */}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="multiple"
                selected={field.value?.map((dateString) => toDate(dateString, { timeZone: TIME_ZONE }))}
                onSelect={(dates) => {
                  const formattedDates = dates?.map((d) => format(d, "yyyy-MM-dd", { timeZone: TIME_ZONE })) || []
                  field.onChange(formattedDates)
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex flex-wrap gap-2 mt-2">
            {field.value?.map((dateString: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
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
  )
}

