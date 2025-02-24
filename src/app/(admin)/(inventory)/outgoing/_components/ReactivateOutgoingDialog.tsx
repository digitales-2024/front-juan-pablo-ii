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
import { DetailedOutgoing } from "../_interfaces/outgoing.interface";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";
import { useOutgoing } from "../_hooks/useOutgoing";
import { ComponentPropsWithoutRef } from "react";
import { METADATA } from "../_statics/metadata";
import { useIncoming } from "../../income/_hooks/useIncoming";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReactivateOutgoingDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  outgoing?: DetailedOutgoing;
  outcomes?: DetailedOutgoing[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateOutgoingDialog({
  outgoing,
  outcomes,
  showTrigger = true,
  onSuccess,
  ...props
}: ReactivateOutgoingDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { reactivateMutation: { isPending, mutateAsync } } = useOutgoing();
  const { reactivateMutation: incomingReactivateMutation } = useIncoming();
  const queryClient = useQueryClient();

  const items = outcomes ?? (outgoing ? [outgoing] : []);

  async function onReactivate() {
    const transferenceIds: string[] = [];
    const ids = items.map((item) => {
      if (item.isTransference) {
        transferenceIds.push(item.id);
      }
      return item.id;
    });
    try {
      await mutateAsync({ ids },
        {
          onSuccess: async () => {
            if (transferenceIds.length > 0) {
              await incomingReactivateMutation.mutateAsync({ ids: transferenceIds },{
                onSuccess: async () => {
                  await Promise.all([
                    queryClient.refetchQueries({ queryKey: ["product-stock-by-storage"] }),
                    queryClient.refetchQueries({ queryKey: ["stock"] }),
                    queryClient.refetchQueries({ queryKey: ["detailed-incomings"] }),
                  ]);
                  toast.success(
                    items.length === 1
                      ? `La transferencia ha sido reactivada exitosamente`
                      : `Las transferencias han sido reactivadas exitosamente`
                  );
                },
                onError: (error) => {
                  if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
                    toast.error("No tienes permisos para realizar esta acción");
                  } else {
                    toast.error(error.message || `Error al reactivar la/las transferencia`);
                  }
                }
              });
            }
          },
          onError: (error) => {
            if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
              toast.error("No tienes permisos para realizar esta acción");
            } else {
              toast.error(error.message || `Error al reactivar la/las transferencia`);
            }
          }
        }
      );
      toast.success(
        items.length === 1
          ? `La ${METADATA.entityName.toLowerCase()} ha sido reactivada exitosamente`
          : `Las ${METADATA.entityPluralName.toLowerCase()} han sido reactivadas exitosamente`
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
