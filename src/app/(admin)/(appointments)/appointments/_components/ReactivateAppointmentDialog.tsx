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
import { RefreshCcwDot } from "lucide-react";
import { useState } from "react";
import { useAppointments } from "../_hooks/useAppointments";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";

interface ReactivateAppointmentDialogProps {
    appointment?: Appointment;
    appointments?: Appointment[];
    variant?: "default" | "outline";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function ReactivateAppointmentDialog({
    appointment,
    appointments,
    variant = "outline",
    open: controlledOpen,
    onOpenChange,
    showTrigger = true,
    onSuccess
}: ReactivateAppointmentDialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const { reactivateMutation: { isPending, mutateAsync } } = useAppointments();
    const { usePatientById } = usePatients();
    const patientId = appointment?.patientId;
    const { data: patient } = patientId ? usePatientById(patientId) : { data: null };

    const isOpen = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    const items = appointments ?? (appointment ? [appointment] : []);
    const title = items.length === 1 ? "Reactivar Cita" : "Reactivar Citas";
    const description =
        items.length === 1 && patient
            ? `¿Estás seguro de que deseas reactivar la cita de "${patient.name}"?`
            : `¿Estás seguro de que deseas reactivar ${items.length} citas?`;

    async function onReactivate() {
        const ids = items.map((item) => item.id);
        try {
            await mutateAsync({ ids });
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            console.log(error);
            // El error ya es manejado por el hook
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button
                        variant={variant}
                        size={variant === "outline" ? "sm" : "default"}
                    >
                        <RefreshCcwDot className="mr-2 h-4 w-4" />
                        {items.length === 1 ? "Reactivar" : `Reactivar (${items.length})`}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        onClick={onReactivate}
                        disabled={isPending}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isPending ? "Reactivando..." : "Reactivar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 