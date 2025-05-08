"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCcw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConfirmOrderDialogProps {
  onConfirm: () => Promise<void>;
  trigger: React.ReactNode;
  confirmationText: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ConfirmOrderDialog({
  onConfirm,
  trigger,
  confirmationText,
  disabled,
  isLoading,
}: ConfirmOrderDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        type="button"
        disabled={disabled}
        asChild
        className={cn(
          buttonVariants({
            variant: "default",
          })
        )}
      >
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar orden</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea crear esta orden? Una vez creada no podrá
            retroceder.
          </DialogDescription>
        </DialogHeader>

        {/* Alerta de advertencia con icono */}
        <Alert className="mt-4 border-amber-500 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            <span className="font-medium">¡IMPORTANTE!</span> Asegúrese de haber
            registrado correctamente la cita en los servicios y de haber
            guardado todos los cambios antes de proceder.
          </AlertDescription>
        </Alert>

        <DialogFooter className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            {isLoading && (
              <RefreshCcw
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {isLoading ? "Procesando..." : confirmationText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
