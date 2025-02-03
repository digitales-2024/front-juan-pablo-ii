"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { TypeProductResponse, } from "../types";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, Trash } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

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
} from "@/components/ui/alert-dialog";
import { useTypeProducts } from "../_hooks/useType";


interface DeleteTypeDialogProps
    extends ComponentPropsWithoutRef<typeof AlertDialog> {
    types: Row<TypeProductResponse>["original"][];
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function DeleteTypeDialog({
    types,
    showTrigger = true,
    onSuccess,
    ...props
}: DeleteTypeDialogProps) {

    const isDesktop = useMediaQuery("(min-width: 640px)");
    const { deleteTypeProduct, isDeleting } = useTypeProducts();

    function onDeleteTypesHandler() {
        deleteTypeProduct({ ids: types.map((type) => type.id) }, {
            onSuccess: () => {
                onSuccess?.();
            },
        });
    };

    if (isDesktop) {
        return (
            <AlertDialog {...props}>
                {showTrigger ? (
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Trash className="mr-2 size-4" aria-hidden="true" />
                            Eliminar ({types.length})
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
                            <span className="font-medium">
                                {" "}
                                {types.length}
                            </span>
                            {types.length === 1 ? " tipo de producto" : " tipos de productos"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">Cancelar</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            aria-label="Delete selected rows"
                            onClick={onDeleteTypesHandler}
                            disabled={isDeleting}
                        >
                            {isDeleting && (
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
                        Eliminar ({types.length})
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
                    <DrawerDescription>
                        Esta acción eliminará a
                        <span className="font-medium">{types.length}</span>
                        {types.length === 1 ? " tipo de producto" : " tipos de productos"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button
                        aria-label="Delete selected rows"
                        onClick={onDeleteTypesHandler}
                        disabled={isDeleting}
                    >
                        {isDeleting && (
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