"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useRol } from "@/hooks/use-rol";
import { Role } from "@/types";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, Trash } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

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
} from "@/components/ui/alert-dialog";
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

interface DeleteRolesDialogProps
    extends ComponentPropsWithoutRef<typeof AlertDialog> {
    roles: Row<Role>["original"][];
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function DeleteRolesDialog({
    roles,
    showTrigger = true,
    onSuccess,
    ...props
}: DeleteRolesDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const { onDeleteRoles, isLoadingDeleteRoles } = useRol();

    const onDeleteRolesHandler = () => {
        onDeleteRoles(roles);
        props.onOpenChange?.(false);
        onSuccess?.();
    };

    if (isDesktop) {
        return (
            <AlertDialog {...props}>
                {showTrigger ? (
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Trash className="mr-2 size-4" aria-hidden="true" />
                            Eliminar ({roles.length})
                        </Button>
                    </AlertDialogTrigger>
                ) : null}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Estás absolutamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará a
                            <span className="font-medium"> {roles.length}</span>
                            {roles.length === 1 ? " rol" : " roles"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">Cancelar</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            aria-label="Delete selected rows"
                            onClick={onDeleteRolesHandler}
                            disabled={isLoadingDeleteRoles}
                        >
                            {isLoadingDeleteRoles && (
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
                        Eliminar ({roles.length})
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
                    <DrawerDescription>
                        Esta acción eliminará a
                        <span className="font-medium">{roles.length}</span>
                        {roles.length === 1 ? " rol" : " roles"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button
                        aria-label="Delete selected rows"
                        onClick={onDeleteRolesHandler}
                        disabled={isLoadingDeleteRoles}
                    >
                        {isLoadingDeleteRoles && (
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
