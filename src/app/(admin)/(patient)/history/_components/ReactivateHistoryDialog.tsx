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
import { MedicalHistory } from "../_interfaces/history.interface";
import { RefreshCcwDot } from "lucide-react";
import { useState } from "react";
import { useMedicalHistories } from "../_hooks/usehistory";
import { toast } from "sonner";

interface ReactivateHistoryDialogProps {
  history?: MedicalHistory;
  histories?: MedicalHistory[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateHistoryDialog({
  history,
  histories,
  variant = "outline",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess,
}: ReactivateHistoryDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const {
    reactivateMedicalHistoryMutation: { isPending, mutateAsync },
  } = useMedicalHistories();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = histories ?? (history ? [history] : []);
  const title =
    items.length === 1 ? "Reactivar Historia Médica" : "Reactivar Historias Médicas";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas reactivar la historia médica?`
      : `¿Estás seguro de que deseas reactivar ${items.length} historias médicas?`;

  async function onReactivate() {
    const ids = items.map((item) => item.id);
    try {
      await mutateAsync({ ids });
      toast.success(
        items.length === 1
          ? "Historia médica reactivada exitosamente"
          : "Historias médicas reactivadas exitosamente"
      );
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