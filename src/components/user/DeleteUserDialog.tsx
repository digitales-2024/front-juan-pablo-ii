"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useUsers } from "@/hooks/use-users";
import { User } from "@/types";
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

interface DeleteUserDialogProps
  extends ComponentPropsWithoutRef<typeof AlertDialog> {
  user: User;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteUserDialog({
  user,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteUserDialogProps) {
  const [isDeletePending] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { onDeleteUsers } = useUsers();

  const onDeleteUserHandler = () => {
    // Pasar el usuario como un arreglo de un solo elemento
    onDeleteUsers([user]);
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
              Esta acción eliminará a <span className="font-medium">{user.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Delete selected user"
              onClick={onDeleteUserHandler}
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
            Esta acción eliminará a <span className="font-medium">{user.name}</span>.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            aria-label="Delete selected user"
            onClick={onDeleteUserHandler}
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