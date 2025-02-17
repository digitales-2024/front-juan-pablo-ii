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
import { StaffType } from "../_interfaces/staff-type.interface";
import { RefreshCcwDot } from "lucide-react";
import { useState } from "react";
import { useStaffTypes } from "../_hooks/useStaffTypes";

interface ReactivateStaffTypeDialogProps {
  staffType?: StaffType;
  staffTypes?: StaffType[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateStaffTypeDialog({
  staffType,
  staffTypes,
  variant = "outline",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: ReactivateStaffTypeDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { reactivateMutation: { isPending, mutateAsync } } = useStaffTypes();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = staffTypes ?? (staffType ? [staffType] : []);
  const title = items.length === 1 ? "Reactivar Tipo de Personal" : "Reactivar Tipos de Personal";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas reactivar el tipo "${items[0].name}"?`
      : `¿Estás seguro de que deseas reactivar ${items.length} tipos de personal?`;

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