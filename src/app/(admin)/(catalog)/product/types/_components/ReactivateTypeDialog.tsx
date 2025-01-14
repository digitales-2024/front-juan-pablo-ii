"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { reactivateManyCategories } from "../actions";
import { Category } from "../types";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";
import { ComponentPropsWithoutRef, useTransition } from "react";

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

interface ReactivateCategoryDialogProps
    extends ComponentPropsWithoutRef<typeof AlertDialog> {
    categories: Row<Category>["original"][];
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export const ReactivateCategoryDialog = ({
    categories,
    showTrigger = true,
    onSuccess,
    ...props
}: ReactivateCategoryDialogProps) => {
    const [isReactivatePending, startReactivateTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const onReactivateCategoriesHandler = async () => {
        startReactivateTransition(async () => {
            await reactivateManyCategories(categories.map((category) => category.id));
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
                            <RefreshCcwDot
                                className="mr-2 size-4"
                                aria-hidden="true"
                            />
                            Reactivar ({categories.length})
                        </Button>
                    </AlertDialogTrigger>
                ) : null}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Estás absolutamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción reactivará a{" "}
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
                            aria-label="Reactivate selected rows"
                            onClick={onReactivateCategoriesHandler}
                            disabled={isReactivatePending}
                        >
                            {isReactivatePending && (
                                <RefreshCcw
                                    className="mr-2 size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Reactivar
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
                        <RefreshCcwDot
                            className="mr-2 size-4"
                            aria-hidden="true"
                        />
                        Reactivar ({categories.length})
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
                    <DrawerDescription>
                        Esta acción reactivará a
                        <span className="font-medium">{categories.length}</span>
                        {categories.length === 1 ? " categoría" : " categorías"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button
                        aria-label="Reactivate selected rows"
                        onClick={onReactivateCategoriesHandler}
                        disabled={isReactivatePending}
                    >
                        {isReactivatePending && (
                            <RefreshCcw
                                className="mr-2 size-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Reactivar
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};