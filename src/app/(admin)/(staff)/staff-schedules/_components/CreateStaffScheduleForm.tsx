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

const TIME_ZONE = 'America/Lima';

const DAYS_OF_WEEK = [
  { label: "Lunes", value: "MONDAY" },
  { label: "Martes", value: "TUESDAY" },
  { label: "Miércoles", value: "WEDNESDAY" },
  { label: "Jueves", value: "THURSDAY" },
  { label: "Viernes", value: "FRIDAY" },
  { label: "Sábado", value: "SATURDAY" },
  { label: "Domingo", value: "SUNDAY" },
] as const;

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
                          <FormItem
                            key={day.value}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="recurrence.frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                      </FormControl>
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
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
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
              render={({ field }) => {
                return (
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
                );
              }}
            />

            <FormField
              control={form.control}
              name="exceptions"
              render={({ field }) => {
                console.log('Excepciones actuales:', field.value);
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Excepciones</FormLabel>
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