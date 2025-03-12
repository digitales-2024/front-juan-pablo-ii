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
import { Appointment } from "../_interfaces/appointments.interface";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useAppointments } from "../_hooks/useAppointments";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const cancelSchema = z.object({
    cancellationReason: z.string().min(1, "El motivo de cancelación es requerido"),
});

type CancelFormValues = z.infer<typeof cancelSchema>;

interface CancelAppointmentDialogProps {
    appointment: Appointment;
    variant?: "default" | "outline";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function CancelAppointmentDialog({
    appointment,
    variant = "outline",
    open: controlledOpen,
    onOpenChange,
    showTrigger = true,
    onSuccess
}: CancelAppointmentDialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const { cancelMutation: { isPending, mutateAsync } } = useAppointments();
    const { usePatientById } = usePatients();

    const isOpen = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    const patientId = appointment?.patientId;
    const { data: patient } = patientId ? usePatientById(patientId) : { data: null };

    const form = useForm<CancelFormValues>({
        resolver: zodResolver(cancelSchema),
        defaultValues: {
            cancellationReason: "",
        },
    });

    const description = patient
        ? `¿Estás seguro de que deseas cancelar la cita de "${patient.name}"?`
        : `¿Estás seguro de que deseas cancelar esta cita?`;

    async function onCancel(values: CancelFormValues) {
        try {
            await mutateAsync({
                id: appointment.id,
                data: {
                    cancellationReason: values.cancellationReason,
                },
            });
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error("Error al cancelar la cita:", error);
            // El error ya es manejado por el hook
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button variant={variant} size={variant === "outline" ? "sm" : "default"}>
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancelar Cita
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancelar Cita</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onCancel)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="cancellationReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo de cancelación</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ingrese el motivo de la cancelación"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)} type="button">
                                Volver
                            </Button>
                            <Button variant="destructive" type="submit" disabled={isPending}>
                                {isPending ? "Cancelando..." : "Cancelar Cita"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 