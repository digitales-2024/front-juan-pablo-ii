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
import { StaffSchedule } from "../_interfaces/staff-schedules.interface";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useStaffSchedules } from "../_hooks/useStaffSchedules";

interface DeleteStaffScheduleDialogProps {
  schedule?: StaffSchedule;
  schedules?: StaffSchedule[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteStaffScheduleDialog({
  schedule,
  schedules,
  variant = "outline",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: DeleteStaffScheduleDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { deleteMutation: { isPending, mutateAsync } } = useStaffSchedules();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = schedules ?? (schedule ? [schedule] : []);
  const title = items.length === 1 ? "Eliminar Horario" : "Eliminar Horarios";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas eliminar el horario de "${items[0].staff?.name ?? 'el usuario'}"?`
      : `¿Estás seguro de que deseas eliminar ${items.length} horarios?`;

  async function handleDeactivate() {
    const ids = items.map((item) => item.id);
    try {
      await mutateAsync({ ids });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant={variant} size={variant === "outline" ? "sm" : "default"}>
            <TrashIcon className="mr-2 h-4 w-4" />
            {items.length === 1 ? "Eliminar" : `Eliminar (${items.length})`}
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
          <Button variant="destructive" onClick={handleDeactivate} disabled={isPending}>
            {isPending ? "Eliminandi..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 