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
import { TypeStorage } from "../_interfaces/storageTypes.interface";
import { RefreshCcw, Trash } from "lucide-react";
import { useTypeStorages } from "../_hooks/useStorageTypes";
import { toast } from "sonner";
import { ComponentPropsWithoutRef } from "react";

interface DeactivateTypeStorageDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  typeStorage?: TypeStorage;
  typeStorages?: TypeStorage[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeactivateTypeStorageDialog({
  typeStorage,
  typeStorages,
  showTrigger = true,
  onSuccess,
  ...props
}: DeactivateTypeStorageDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { deleteMutation: { isPending, mutateAsync } } = useTypeStorages();

  const items = typeStorages ?? (typeStorage ? [typeStorage] : []);

  async function onDelete() {
    const ids = items.map((item) => item.id);
    try {
      await mutateAsync({ ids });
      toast.success(
        items.length === 1
          ? "Tipo de almacenamiento desactivado exitosamente"
          : "Tipos de almacenamiento desactivados exitosamente"
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
              {items.length === 1 ? " tipo de almacenamiento" : " tipos de almacenamiento"}
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
            {items.length === 1 ? " tipo de almacenamiento" : " tipos de almacenamiento"}
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
