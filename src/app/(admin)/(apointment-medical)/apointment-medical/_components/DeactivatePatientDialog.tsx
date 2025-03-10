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
import { Patient } from "../_interfaces/patient.interface";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { usePatients } from "../_hooks/usePatient";
import { toast } from "sonner";

interface DeactivatePatientDialogProps {
  patient?: Patient;
  patients?: Patient[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeactivatePatientDialog({
  patient,
  patients,
  variant = "outline",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess,
}: DeactivatePatientDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { deleteMutation: { isPending, mutateAsync } } = usePatients();

  // Use controlled state if props are provided, otherwise use internal state
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = patients ?? (patient ? [patient] : []);
  const title = items.length === 1 ? "Desactivar Paciente" : "Desactivar Pacientes";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas desactivar al paciente "${items[0].name}"?`
      : `¿Estás seguro de que deseas desactivar ${items.length} pacientes?`;

  async function onDelete() {
    const ids = items.map((item) => item.id);
    try {
      await mutateAsync({ ids });
      toast.success(
        items.length === 1
          ? "Paciente desactivado exitosamente"
          : "Pacientes desactivados exitosamente"
      );
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.log(error);
      
      // The error is already handled by the hook
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