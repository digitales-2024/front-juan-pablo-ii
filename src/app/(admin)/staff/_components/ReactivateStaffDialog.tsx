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
import { Staff } from "../_interfaces/staff.interface";
import { ActivityIcon } from "lucide-react";
import { useState } from "react";
import { useStaff } from "../_hooks/useStaff";

interface ReactivateStaffDialogProps {
  staff?: Staff;
  staffs?: Staff[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateStaffDialog({
  staff,
  staffs,
  variant = "default",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: ReactivateStaffDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { reactivateMutation: { isPending, mutateAsync } } = useStaff();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = staffs ?? (staff ? [staff] : []);
  const title = items.length === 1 ? "Reactivar Personal" : "Reactivar Personal";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas reactivar a "${items[0].name} ${items[0].lastName}"?`
      : `¿Estás seguro de que deseas reactivar ${items.length} miembros del personal?`;

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
            className="text-green-600"
          >
            <ActivityIcon className="mr-2 h-4 w-4" />
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