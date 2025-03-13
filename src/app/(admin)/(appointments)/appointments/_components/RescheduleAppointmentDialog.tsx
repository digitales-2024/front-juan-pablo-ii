"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment, rescheduleAppointmentSchema } from "../_interfaces/appointments.interface";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useAppointments } from "../_hooks/useAppointments";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type RescheduleFormValues = z.infer<typeof rescheduleAppointmentSchema>;

interface RescheduleAppointmentDialogProps {
    appointment: Appointment;
    variant?: "default" | "outline";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function RescheduleAppointmentDialog({
    appointment,
    variant = "outline",
    open: controlledOpen,
    onOpenChange,
    showTrigger = true,
    onSuccess
}: RescheduleAppointmentDialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const { rescheduleMutation: { isPending, mutateAsync } } = useAppointments();
    const { usePatientById } = usePatients();

    const isOpen = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    const patientId = appointment?.patientId;
    const { data: patient } = patientId ? usePatientById(patientId) : { data: null };

    // Función para alinear la fecha a intervalos de 15 minutos y eliminar segundos y milisegundos
    const alignToFifteenMinutes = (date: Date): Date => {
        const newDate = new Date(date);
        // Redondear minutos al intervalo de 15 más cercano
        const minutes = Math.floor(newDate.getMinutes() / 15) * 15;
        newDate.setMinutes(minutes);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        return newDate;
    };

    // Inicializar con la fecha actual alineada a 15 minutos
    const initialDate = alignToFifteenMinutes(new Date());

    const form = useForm<RescheduleFormValues>({
        resolver: zodResolver(rescheduleAppointmentSchema),
        defaultValues: {
            newDateTime: initialDate.toISOString(),
            rescheduleReason: "",
        },
    });

    const description = patient
        ? `Reprogramar la cita de "${patient.name}"`
        : `Reprogramar esta cita`;

    async function onReschedule(values: RescheduleFormValues) {
        try {
            await mutateAsync({
                id: appointment.id,
                data: {
                    newDateTime: values.newDateTime,
                    rescheduleReason: values.rescheduleReason,
                },
            });
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error("Error al reprogramar la cita:", error);
            // El error ya es manejado por el hook
        }
    }

    // Componente DateTimePicker simplificado
    function DateTimePicker({ field }: { field: { value: string; onChange: (value: string) => void } }) {
        const [date, setDate] = useState<Date>(
            field.value ? alignToFifteenMinutes(new Date(field.value)) : alignToFifteenMinutes(new Date())
        );
        const [isOpen, setIsOpen] = useState(false);
    
        const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    
        const handleDateSelect = (selectedDate: Date | undefined) => {
            if (selectedDate) {
                const newDate = new Date(date);
                newDate.setFullYear(selectedDate.getFullYear());
                newDate.setMonth(selectedDate.getMonth());
                newDate.setDate(selectedDate.getDate());
                const alignedDate = alignToFifteenMinutes(newDate);
                setDate(alignedDate);
                field.onChange(alignedDate.toISOString());
            }
        };
    
        const handleTimeChange = (
            type: "hour" | "minute" | "ampm",
            value: string
        ) => {
            const newDate = new Date(date);
            if (type === "hour") {
                newDate.setHours(
                    (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
                );
            } else if (type === "minute") {
                newDate.setMinutes(parseInt(value));
            } else if (type === "ampm") {
                const currentHours = newDate.getHours();
                const isPM = value === "PM";
                if (isPM && currentHours < 12) {
                    newDate.setHours(currentHours + 12);
                } else if (!isPM && currentHours >= 12) {
                    newDate.setHours(currentHours - 12);
                }
            }
            // Asegurarse de que no tenga segundos ni milisegundos
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
            setDate(newDate);
            field.onChange(newDate.toISOString());
        };
    
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            format(date, "PPP HH:mm", { locale: es })
                        ) : (
                            <span>Seleccionar fecha y hora</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                            locale={es}
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {hours.map((hour) => (
                                        <Button
                                            key={hour}
                                            size="icon"
                                            variant={
                                                date &&
                                                    date.getHours() % 12 === hour % 12
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange(
                                                    "hour",
                                                    hour.toString()
                                                )
                                            }
                                        >
                                            {hour}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar
                                    orientation="horizontal"
                                    className="sm:hidden"
                                />
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {[0, 15, 30, 45].map((minute) => (
                                        <Button
                                            key={minute}
                                            size="icon"
                                            variant={
                                                date && date.getMinutes() === minute
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange(
                                                    "minute",
                                                    minute.toString()
                                                )
                                            }
                                        >
                                            {minute.toString().padStart(2, "0")}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar
                                    orientation="horizontal"
                                    className="sm:hidden"
                                />
                            </ScrollArea>
                            <ScrollArea>
                                <div className="flex sm:flex-col p-2">
                                    {["AM", "PM"].map((ampm) => (
                                        <Button
                                            key={ampm}
                                            size="icon"
                                            variant={
                                                date &&
                                                    ((ampm === "AM" &&
                                                        date.getHours() < 12) ||
                                                        (ampm === "PM" &&
                                                            date.getHours() >= 12))
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange("ampm", ampm)
                                            }
                                        >
                                            {ampm}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button variant={variant} size={variant === "outline" ? "sm" : "default"}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reprogramar Cita
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Reprogramar Cita</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onReschedule)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="newDateTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nueva fecha y hora</FormLabel>
                                    <FormControl>
                                        <DateTimePicker field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rescheduleReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo de reprogramación</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ingrese el motivo de la reprogramación"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)} type="button">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Reprogramando..." : "Reprogramar Cita"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 