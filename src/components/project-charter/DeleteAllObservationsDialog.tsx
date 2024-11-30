"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useObservation } from "@/hooks/use-observation";
import { ProjectCharter } from "@/types";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, Trash } from "lucide-react";
import { ComponentPropsWithoutRef, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";

interface DeleteAllObservationsDialogProps
    extends ComponentPropsWithoutRef<typeof AlertDialog> {
    projectCharter: Row<ProjectCharter>["original"][];
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function DeleteAllObservationsDialog({
    projectCharter,
    showTrigger = true,
    onSuccess,
    ...props
}: DeleteAllObservationsDialogProps) {
    const [isDeletePending] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const { onDeleteObservationsFromProjectCharters } = useObservation();

    const onDeleteAllObservationsHandler = async () => {
        try {
            // Esperar a que se complete la eliminación
            await onDeleteObservationsFromProjectCharters(projectCharter);

            // Cerrar el diálogo y ejecutar la callback de éxito
            props.onOpenChange?.(false);
            onSuccess?.();
        } catch (error) {
            console.error("Error eliminando observaciones:", error);
        }
    };

    if (isDesktop) {
        return (
            <AlertDialog {...props}>
                {showTrigger ? (
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Trash className="mr-2 size-4" aria-hidden="true" />
                            Eliminar observaciones ({projectCharter.length})
                        </Button>
                    </AlertDialogTrigger>
                ) : null}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Estás absolutamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará todas las observaciones de
                            <span className="font-medium">
                                {" "}
                                {projectCharter.length}
                            </span>
                            {projectCharter.length === 1
                                ? " acta de proyecto"
                                : " actas de proyectos"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">Cancelar</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            aria-label="Delete selected rows"
                            onClick={onDeleteAllObservationsHandler}
                            disabled={isDeletePending}
                        >
                            {isDeletePending && (
                                <RefreshCcw
                                    className="mr-2 size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <Drawer {...props}>
            {showTrigger ? (
                <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Trash className="mr-2 size-4" aria-hidden="true" />
                        Eliminar observaciones ({projectCharter.length})
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
                    <DrawerDescription>
                        Esta acción eliminará todas las observaciones de
                        <span className="font-medium">
                            {projectCharter.length}
                        </span>
                        {projectCharter.length === 1
                            ? " acta de proyecto"
                            : " actas de proyectos"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button
                        aria-label="Delete selected rows"
                        onClick={onDeleteAllObservationsHandler}
                        disabled={isDeletePending}
                    >
                        {isDeletePending && (
                            <RefreshCcw
                                className="mr-2 size-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Eliminar
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
