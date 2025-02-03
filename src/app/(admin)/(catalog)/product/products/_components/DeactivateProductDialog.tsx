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
import { Product } from "../_interfaces/products.interface";
import { RefreshCcw, Trash } from "lucide-react";
import { useProducts } from "../_hooks/useProduct";
import { toast } from "sonner";
import { ComponentPropsWithoutRef } from "react";

interface DeactivateProductDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  product?: Product;
  products?: Product[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeactivateProductDialog({
  product,
  products,
  showTrigger = true,
  onSuccess,
  ...props
}: DeactivateProductDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { deleteMutation: { isPending, mutateAsync } } = useProducts();

  const items = products ?? (product ? [product] : []);

  async function onDelete() {
    const ids = items.map((item) => item.id);
    try {
      await mutateAsync({ ids });
      toast.success(
        items.length === 1
          ? "Producto desactivado exitosamente"
          : "Productos desactivados exitosamente"
      );
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
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Desactivar ({items.length})
            </Button>
          </AlertDialogTrigger>
        )}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará a
              <span className="font-medium"> {items.length}</span>
              {items.length === 1 ? " producto" : " productos"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={isPending}
            >
              {isPending && (
                <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
              )}
              Desactivar
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
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Desactivar ({items.length})
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción desactivará a
            <span className="font-medium"> {items.length}</span>
            {items.length === 1 ? " producto" : " productos"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending && (
              <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Desactivar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
