"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
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
import { Product } from "../_interfaces/storageTypes.interface";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";
import { useProducts } from "../_hooks/useStorageTypes";
import { ComponentPropsWithoutRef } from "react";

interface ReactivateProductDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  product?: Product;
  products?: Product[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateProductDialog({
  product,
  products,
  showTrigger = true,
  onSuccess,
  ...props
}: ReactivateProductDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { reactivateMutation: { isPending, mutateAsync } } = useProducts();

  const items = products ?? (product ? [product] : []);

  async function onReactivate() {
    const ids = items.map((item) => item.id);
    try {
      await mutateAsync({ ids });
      onSuccess?.();
    } catch (error) {
      console.log(error);
    }
  }

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger && (
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
              Reactivar ({items.length})
            </Button>
          </AlertDialogTrigger>
        )}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción reactivará a
              <span className="font-medium"> {items.length}</span>
              {items.length === 1 ? " producto" : " productos"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onReactivate}
              disabled={isPending}
            >
              {isPending && (
                <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
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
      {showTrigger && (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
            Reactivar ({items.length})
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción reactivará a
            <span className="font-medium"> {items.length}</span>
            {items.length === 1 ? " producto" : " productos"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            onClick={onReactivate}
            disabled={isPending}
          >
            {isPending && (
              <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
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
}
