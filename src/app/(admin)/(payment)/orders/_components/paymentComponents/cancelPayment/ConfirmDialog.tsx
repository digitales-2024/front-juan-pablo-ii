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
import { RefreshCcw } from "lucide-react";

interface ConfirmOrderDialogProps {
    onConfirm: () => Promise<void>;
    trigger: React.ReactNode;
    isLoading?: boolean;
    confirmationText: string;
}

export function ConfirmOrderDialog({
    onConfirm,
    trigger,
    confirmationText,
    isLoading = false,
}: ConfirmOrderDialogProps) {
    const [open, setOpen] = React.useState(false);

    const handleConfirm = async () => {
        await onConfirm();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger type="button" disabled={isLoading} asChild className={cn(buttonVariants({
                variant: "default",
            }))}>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar cancelar orden</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro que desea cancellar esta orden antes de procesar el pago?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={isLoading} className="flex items-center gap-2">
                        {(isLoading)&& (
                            <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
                        )}
                        {isLoading && "Procesando..."}
                        {confirmationText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}