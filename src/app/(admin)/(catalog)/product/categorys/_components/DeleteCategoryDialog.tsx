"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { deleteManyCategories } from "../actions";
import { Category } from "../types";
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
} from "@/components/ui/alert-dialog";

interface DeleteCategoryDialogProps
    extends ComponentPropsWithoutRef<typeof AlertDialog> {
    categories: Row<Category>["original"][];
    showTrigger?: boolean;
    onSuccess?: () => void;
}

/**
 * Componente que renderiza un diálogo para eliminar categorías.
 *
 * Este componente se utiliza para eliminar categorías seleccionadas en la tabla
 * de categorías. Si se seleccionaron filas en la tabla, renderiza un botón para
 * eliminar las categorías seleccionadas. Si no se seleccionaron filas en la
 * tabla, no renderiza nada.
 *
 * @param {{ categories: Row<Category>["original"][] }} props - Las categorías
 * que se van a eliminar.
 * @param {boolean} props.showTrigger - Si se muestra el botón para eliminar.
 * @param {() => void} props.onSuccess - La función que se llama cuando se
 * eliminan las categorías con éxito.
 */
export function DeleteCategoryDialog({
    categories,
    showTrigger = true,
    onSuccess,
    ...props
}: DeleteCategoryDialogProps) {
    const [isDeletePending, startDeleteTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const onDeleteCategoriesHandler = async () => {
        startDeleteTransition(async () => {
            await deleteManyCategories(categories.map((category) => category.id));
            props.onOpenChange?.(false);
            onSuccess?.();
        });
    };

    if (isDesktop) {
        return (
            <AlertDialog {...props}>
                {showTrigger ? (
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Trash className="mr-2 size-4" aria-hidden="true" />
                            Eliminar ({categories.length})
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
                                {categories.length}
                            </span>
                            {categories.length === 1 ? " categoría" : " categorías"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">Cancelar</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            aria-label="Delete selected rows"
                            onClick={onDeleteCategoriesHandler}
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
                        Eliminar ({categories.length})
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
                    <DrawerDescription>
                        Esta acción eliminará a
                        <span className="font-medium">{categories.length}</span>
                        {categories.length === 1 ? " categoría" : " categorías"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button
                        aria-label="Delete selected rows"
                        onClick={onDeleteCategoriesHandler}
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