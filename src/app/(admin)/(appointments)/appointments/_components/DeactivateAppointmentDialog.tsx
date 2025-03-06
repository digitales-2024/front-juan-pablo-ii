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
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useAppointments } from "../_hooks/useAppointments";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";

interface DeactivateAppointmentDialogProps {
    appointment?: Appointment;
    appointments?: Appointment[];
    variant?: "default" | "outline";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function DeactivateAppointmentDialog({
    appointment,
    appointments,
    variant = "outline",
    open: controlledOpen,
    onOpenChange,
    showTrigger = true,
    onSuccess
}: DeactivateAppointmentDialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const { deleteMutation: { isPending, mutateAsync } } = useAppointments();
    const { usePatientById } = usePatients();

    const isOpen = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    const items = appointments ?? (appointment ? [appointment] : []);
    const title = items.length === 1 ? "Desactivar Cita" : "Desactivar Citas";

    const patientId = items.length === 1 ? items[0].patientId : undefined;
    const { data: patient } = patientId ? usePatientById(patientId) : { data: null };

    const description =
        items.length === 1 && patient
            ? `¿Estás seguro de que deseas desactivar la cita de "${patient.name}"?`
            : `¿Estás seguro de que deseas desactivar ${items.length} citas?`;

    async function onDelete() {
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
                    <Button variant={variant} size={variant === "outline" ? "sm" : "default"}>
                        <TrashIcon className="mr-2 h-4 w-4" />
                        {items.length === 1 ? "Desactivar" : `Desactivar (${items.length})`}
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
                    <Button variant="destructive" onClick={onDelete} disabled={isPending}>
                        {isPending ? "Desactivando..." : "Desactivar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 