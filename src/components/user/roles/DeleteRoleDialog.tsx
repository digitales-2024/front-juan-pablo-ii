"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useRol } from "@/hooks/use-rol";
import { Role } from "@/types";
import { ComponentPropsWithoutRef, useTransition } from "react";
import { Trash, RefreshCcw } from "lucide-react";
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

interface DeleteRoleDialogProps
  extends ComponentPropsWithoutRef<typeof AlertDialog> {
  role: Role;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteRoleDialog({
  role,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteRoleDialogProps) {
  const [isDeletePending] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { onDeleteRoles } = useRol();

  const onDeleteRoleHandler = () => {
    // Pasar el rol como un arreglo de un solo elemento
    onDeleteRoles([role]);
    props.onOpenChange?.(false);
    onSuccess?.();
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Trash className="size-4" aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el rol{" "}
              <span className="font-medium">{role.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Eliminar rol seleccionado"
              onClick={onDeleteRoleHandler}
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
          <Button variant="ghost" size="sm">
            <Trash className="size-4" aria-hidden="true" />
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción eliminará el rol{" "}
            <span className="font-medium">{role.name}</span>.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            aria-label="Eliminar rol seleccionado"
            onClick={onDeleteRoleHandler}
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
