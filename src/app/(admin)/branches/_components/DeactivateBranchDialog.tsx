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
import { Branch } from "../_interfaces/branch.interface";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useBranches } from "../_hooks/useBranches";

interface DeactivateBranchDialogProps {
  branch?: Branch;
  branches?: Branch[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeactivateBranchDialog({
  branch,
  branches,
  variant = "outline",
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: DeactivateBranchDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { deleteMutation: { isPending, mutateAsync } } = useBranches();

  // Usar el estado controlado si se proporcionan las props, sino usar el estado interno
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const items = branches ?? (branch ? [branch] : []);
  const title = items.length === 1 ? "Desactivar Sucursal" : "Desactivar Sucursales";
  const description =
    items.length === 1
      ? `¿Estás seguro de que deseas desactivar la sucursal "${items[0].name}"?`
      : `¿Estás seguro de que deseas desactivar ${items.length} sucursales?`;

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
          <Button 
            variant={variant} 
            size={variant === "outline" ? "sm" : "default"}
          >
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
          <Button 
            variant="destructive"
            onClick={onDelete} 
            disabled={isPending}
          >
            {isPending ? "Desactivando..." : "Desactivar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
