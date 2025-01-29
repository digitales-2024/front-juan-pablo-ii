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
import { ServiceType } from "../_interfaces/service-type.interface";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useServiceTypes } from "../_hooks/useServiceTypes";

interface DeactivateServiceTypeDialogProps {
  serviceType?: ServiceType;
  serviceTypes?: ServiceType[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeactivateServiceTypeDialog({
  serviceType,
  serviceTypes,
  variant = "default",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: DeactivateServiceTypeDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { deleteMutation: { isPending, mutateAsync } } = useServiceTypes();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = serviceTypes ?? (serviceType ? [serviceType] : []);
  const title = items.length === 1 ? "Desactivar Tipo de Servicio" : "Desactivar Tipos de Servicio";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas desactivar el tipo "${items[0].name}"?`
      : `¿Estás seguro de que deseas desactivar ${items.length} tipos de servicio?`;

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