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
import { RefreshCcwDot } from "lucide-react";
import { useState } from "react";
import { usePatients } from "../_hooks/usePatient";

interface ReactivatePatientDialogProps {
  patient?: Patient;
  patients?: Patient[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivatePatientDialog({
  patient,
  patients,
  variant = "outline",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess,
}: ReactivatePatientDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const {
    reactivateMutation: { isPending, mutateAsync },
  } = usePatients();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = patients ?? (patient ? [patient] : []);
  const title =
    items.length === 1 ? "Reactivar Paciente" : "Reactivar Pacientes";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas reactivar al paciente "${items[0].name}"?`
      : `¿Estás seguro de que deseas reactivar ${items.length} pacientes?`;

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
            <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
            {items.length === 1 ? "Reactivar" : `Reactivar (${items.length})`}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {items.length === 1 && (
          <div className="mb-4">
            <p>
              <strong>Nombre:</strong> {items[0].name}
            </p>
          {/*   {items[0].description && (
              <p>
                <strong>Descripción:</strong> {items[0].description}
              </p>
            )} */}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={onReactivate}
            disabled={isPending}
            className="bg-green-500 hover:bg-green-600 hover:text-white"
          >
            {isPending ? "Reactivando..." : "Reactivar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
