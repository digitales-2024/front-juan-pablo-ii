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
import { RefreshCcwDot } from "lucide-react";
import { useState } from "react";
import { useStaffSchedules } from "../_hooks/useStaffSchedules";

interface ReactivateStaffScheduleDialogProps {
  schedule?: StaffSchedule;
  schedules?: StaffSchedule[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateStaffScheduleDialog({
  schedule,
  schedules,
  variant = "outline",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: ReactivateStaffScheduleDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { reactivateMutation: { isPending, mutateAsync } } = useStaffSchedules();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = schedules ?? (schedule ? [schedule] : []);
  const title = items.length === 1 ? "Reactivar Horario" : "Reactivar Horarios";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas reactivar el horario de "${items[0].staff?.name ?? 'el usuario'}"?`
      : `¿Estás seguro de que deseas reactivar ${items.length} horarios?`;

  async function handleReactivate() {
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
            onClick={handleReactivate} 
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