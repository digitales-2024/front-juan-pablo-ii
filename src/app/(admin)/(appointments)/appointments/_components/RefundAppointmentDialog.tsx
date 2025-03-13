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
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useAppointments } from "../_hooks/useAppointments";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const refundSchema = z.object({
    refundReason: z.string().min(1, "El motivo de reembolso es requerido"),
});

type RefundFormValues = z.infer<typeof refundSchema>;

interface RefundAppointmentDialogProps {
    appointment: Appointment;
    variant?: "default" | "outline";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function RefundAppointmentDialog({
    appointment,
    variant = "outline",
    open: controlledOpen,
    onOpenChange,
    showTrigger = true,
    onSuccess
}: RefundAppointmentDialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const { refundMutation: { isPending, mutateAsync } } = useAppointments();
    const { usePatientById } = usePatients();

    const isOpen = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    const patientId = appointment?.patientId;
    const { data: patient } = patientId ? usePatientById(patientId) : { data: null };

    const form = useForm<RefundFormValues>({
        resolver: zodResolver(refundSchema),
        defaultValues: {
            refundReason: "",
        },
    });

    const description = patient
        ? `¿Estás seguro de que deseas reembolsar la cita de "${patient.name}"?`
        : `¿Estás seguro de que deseas reembolsar esta cita?`;

    async function onRefund(values: RefundFormValues) {
        try {
            await mutateAsync({
                id: appointment.id,
                data: {
                    refundReason: values.refundReason,
                },
            });
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error("Error al reembolsar la cita:", error);
            // El error ya es manejado por el hook
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button variant={variant} size={variant === "outline" ? "sm" : "default"}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reembolsar Cita
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reembolsar Cita</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onRefund)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="refundReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo de reembolso</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ingrese el motivo del reembolso"
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
                                {isPending ? "Reembolsando..." : "Reembolsar Cita"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 