"use client";

import { useQuotations } from "@/hooks/use-quotation";
import { QuotationStatusType, QuotationSummary } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Row } from "@tanstack/react-table";
import { useState, useEffect } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerFooter,
    DrawerDescription,
} from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const statusOptions = {
    [QuotationStatusType.PENDING]: "Pendiente",
    [QuotationStatusType.APPROVED]: "Aprobada",
    [QuotationStatusType.REJECTED]: "Rechazada",
};

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
}

interface UpdateStatusQuotationDialogProps {
    quotation: Row<QuotationSummary>["original"];
    showTrigger?: boolean;
    onSuccess?: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpdateStatusQuotationDialog({
    quotation,
    showTrigger = true,
    onSuccess,
    open,
    onOpenChange,
}: UpdateStatusQuotationDialogProps) {
    const [status, setStatus] = useState<QuotationStatusType>(
        quotation.status as QuotationStatusType,
    );
    const { onUpdateQuotationStatus, isSuccessUpdateQuotationStatus } =
        useQuotations();
    const [showAlert, setShowAlert] = useState(false);
    const isMobile = useMediaQuery("(max-width: 640px)");

    const handleStatusChange = (newStatus: QuotationStatusType) => {
        setStatus(newStatus);
    };

    const handleAccept = () => {
        setShowAlert(true);
    };

    const handleConfirm = async () => {
        await onUpdateQuotationStatus(quotation.id, status);
    };

    useEffect(() => {
        if (isSuccessUpdateQuotationStatus) {
            onOpenChange(false);
            setShowAlert(false);
            onSuccess?.();
        }
    }, [isSuccessUpdateQuotationStatus, onOpenChange, onSuccess]);

    const Content = () => (
        <>
            <div className={isMobile ? "p-4" : "p-0"}>
                <Select
                    onValueChange={(value) =>
                        handleStatusChange(value as QuotationStatusType)
                    }
                    value={status}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(statusOptions).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {isMobile ? (
                <DrawerFooter>
                    <Button
                        variant="destructive"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="normal"
                        onClick={handleAccept}
                        disabled={status === quotation.status}
                    >
                        Aceptar
                    </Button>
                </DrawerFooter>
            ) : (
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="normal"
                        onClick={handleAccept}
                        disabled={status === quotation.status}
                    >
                        Aceptar
                    </Button>
                </DialogFooter>
            )}
        </>
    );

    return (
        <>
            {isMobile ? (
                <Drawer open={open} onOpenChange={onOpenChange}>
                    {showTrigger && (
                        <DrawerTrigger asChild>
                            <Button variant="outline">Cambiar Estado</Button>
                        </DrawerTrigger>
                    )}
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>
                                Cambiar Estado de Cotización
                            </DrawerTitle>
                            <DrawerDescription>
                                Selecciona un estado para la cotización
                            </DrawerDescription>
                        </DrawerHeader>
                        <Content />
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    {showTrigger && (
                        <DialogTrigger asChild>
                            <Button variant="outline">Cambiar Estado</Button>
                        </DialogTrigger>
                    )}
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                Cambiar Estado de Cotización
                            </DialogTitle>
                            <DialogDescription>
                                Selecciona un estado para la cotización
                            </DialogDescription>
                        </DialogHeader>
                        <Content />
                    </DialogContent>
                </Dialog>
            )}

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción cambiará el estado de la cotización a{" "}
                            {statusOptions[status]}. ¿Deseas continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
