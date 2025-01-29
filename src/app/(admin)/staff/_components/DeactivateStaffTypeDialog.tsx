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
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useStaffTypes } from "../_hooks/useStaffTypes";
import { toast } from "sonner";

interface DeleteStaffTypeDialogProps {
  staffType?: StaffType;
  staffTypes?: StaffType[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteStaffTypeDialog({
  staffType,
  staffTypes,
  variant = "default",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: DeleteStaffTypeDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { deleteMutation: { isPending, mutateAsync } } = useStaffTypes();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = staffTypes ?? (staffType ? [staffType] : []);
  const title = items.length === 1 ? "Desactivar Tipo de Personal" : "Desactivar Tipos de Personal";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas desactivar el tipo "${items[0].name}"?`
      : `¿Estás seguro de que deseas desactivar ${items.length} tipos de personal?`;

  async function onDelete() {
    const ids = items.map((item) => item.id);
    try {
      await mutateAsync({ ids });
      // toast.success(
      //   items.length === 1
      //     ? "Tipo de personal desactivado exitosamente"
      //     : "Tipos de personal desactivados exitosamente"
      // );
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