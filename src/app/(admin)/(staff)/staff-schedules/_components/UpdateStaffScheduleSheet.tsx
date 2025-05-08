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
      console.log("Datos del formulario:", data)

      // Crear un objeto con solo los campos que han cambiado
      const changedData = {} as Partial<UpdateStaffScheduleDto>

      // Añadir solo los campos que han cambiado
      if (data.title !== schedule.title) changedData.title = data.title
      if (data.color !== schedule.color) changedData.color = data.color
      if (data.startTime !== schedule.startTime) changedData.startTime = data.startTime
      if (data.endTime !== schedule.endTime) changedData.endTime = data.endTime
      if (JSON.stringify(data.exceptions) !== JSON.stringify(schedule.exceptions))
        changedData.exceptions = data.exceptions

      console.log("Datos filtrados a enviar:", changedData)

      // Si no hay cambios, mostrar mensaje y salir
      if (Object.keys(changedData).length === 0) {
        toast.info("No se detectaron cambios en el horario")
        setOpen(false)
        return
      }

      await updateMutation.mutateAsync(
        {
          id: schedule.id,
          data: changedData,
        },
        {
          onSuccess: () => {
            setOpen(false)
            form.reset()
            toast.success("Horario actualizado exitosamente")
          },
          onError: (error) => {
            console.error("Error al actualizar:", error)
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

