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
import { RefreshCcwDot } from "lucide-react";
import { useState } from "react";
import { useServiceTypes } from "../_hooks/useServiceTypes";

interface ReactivateServiceTypeDialogProps {
  serviceType?: ServiceType;
  serviceTypes?: ServiceType[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateServiceTypeDialog({
  serviceType,
  serviceTypes,
  variant = "outline",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: ReactivateServiceTypeDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { reactivateMutation: { isPending, mutateAsync } } = useServiceTypes();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = serviceTypes ?? (serviceType ? [serviceType] : []);
  const title = items.length === 1 ? "Reactivar Tipo de Servicio" : "Reactivar Tipos de Servicio";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas reactivar el tipo "${items[0].name}"?`
      : `¿Estás seguro de que deseas reactivar ${items.length} tipos de servicio?`;

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