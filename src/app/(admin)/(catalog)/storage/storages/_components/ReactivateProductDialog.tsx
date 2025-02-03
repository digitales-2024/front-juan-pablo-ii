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
import { Storage } from "../_interfaces/storage.interface";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";
import { useStorages } from "../_hooks/useStorages";
import { ComponentPropsWithoutRef } from "react";
import { METADATA } from "../_statics/metadata";

interface ReactivateStorageDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  storage?: Storage;
  storages?: Storage[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateStorageDialog({
  storage,
  storages,
  showTrigger = true,
  onSuccess,
  ...props
}: ReactivateStorageDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { reactivateMutation: { isPending, mutateAsync } } = useStorages();

  const items = storages ?? (storage ? [storage] : []);

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
              {items.length === 1 ? ` ${METADATA.entityName.toLowerCase()}` : ` ${METADATA.entityPluralName.toLowerCase()}`}
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
            {items.length === 1 ? ` ${METADATA.entityName.toLowerCase()}` : ` ${METADATA.entityPluralName.toLowerCase()}`}
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
