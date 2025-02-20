"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Incoming } from "../_interfaces/income.interface";
import { AlertCircle, OctagonAlert, RefreshCcw, Trash } from "lucide-react";
import { useIncoming } from "../_hooks/useIncoming";
import { toast } from "sonner";
import { ComponentPropsWithoutRef } from "react";
import { METADATA } from "../_statics/metadata";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface DeactivateIncomingDialogProps
  extends ComponentPropsWithoutRef<typeof AlertDialog> {
  incoming?: Incoming;
  incomings?: Incoming[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeactivateIncomingDialog({
  incoming,
  incomings,
  showTrigger = true,
  onSuccess,
  ...props
}: DeactivateIncomingDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const {
    deleteMutation: { isPending, mutateAsync },
  } = useIncoming();

  const items = incomings ?? (incoming ? [incoming] : []);

  async function onDelete() {
    const ids = items.map((item) => item.id);
    try {
      await mutateAsync({ ids });
      toast.success(
        items.length === 1
          ? `${METADATA.entityName} desactivado exitosamente`
          : `${METADATA.entityPluralName} desactivados exitosamente`
      );
      onSuccess?.();
    } catch (error) {
      console.log(error);
    }
  }

  const STATIC_MESSAGES = {
    title: "Alerta: Integridad del stock en riesgo",
    description:
      "Esta acción generará negativos y excedentes en su stock. ¿Está seguro de continuar?",
    alert:
      "Recomendamos encarecidamente evitar esta acción, corre el riesgo de corromper la integridad de su stock.",
    alert2:
      "Si necesita corregir su inventario, mejor cree nuevas salidas y/o entradas.",
    alert3:
      "Si está seguro de que los productos de este ingreso no han sido vendidos o utilizados, puede continuar.",
    buttonCancel: "Conservar stock",
    buttonDeactivate: "Desactivar de todos modos",
  };

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
            <div className="flex justify-center w-full">
              <OctagonAlert className="!size-8 text-yellow-600"></OctagonAlert>
            </div>
            <AlertDialogTitle className="text-yellow-600 w-full text-center">
              {STATIC_MESSAGES.title}
            </AlertDialogTitle>
            <div className="px-8">
              <AlertDialogDescription className="text-center">
                {STATIC_MESSAGES.description}
              </AlertDialogDescription>
              <AlertDialogDescription className="!mb-2 text-center">
                Esta acción desactivará a
                <span className="font-medium"> {items.length}</span>
                {items.length === 1
                  ? ` ${METADATA.entityName.toLowerCase()}`
                  : ` ${METADATA.entityPluralName.toLowerCase()}`}
                .
              </AlertDialogDescription>
            </div>

            <Alert className="bg-yellow-100/70 text-yellow-600 border-none !mb-2">
              <div className="flex space-x-2 items-center mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="!mb-0 font-semibold">Precaución</AlertTitle>
              </div>
              <div className="w-full px-5">
                <ul className="space-y-1 list-disc">
                  <li>
                    <AlertDescription>{STATIC_MESSAGES.alert}</AlertDescription>
                  </li>
                  <li>
                    <AlertDescription>
                      {STATIC_MESSAGES.alert2}
                    </AlertDescription>
                  </li>
                  <li>
                    <AlertDescription>
                      {STATIC_MESSAGES.alert3}
                    </AlertDescription>
                  </li>
                </ul>
              </div>
            </Alert>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel
              asChild
              className={cn(
                buttonVariants({ variant: "default" }),
                "animate-jump animate-twice animate-duration-1000 animate-ease-linear hover:text-white hover:scale-105 hover:transition-all"
              )}
            >
              {/* <Button>Cancelar</Button> */}
              <span>{STATIC_MESSAGES.buttonCancel}</span>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "text-destructive hover:text-white hover:bg-destructive border border-destructive"
              )}
              disabled={isPending}
            >
              <span>
                {isPending && (
                  <RefreshCcw
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {
                  STATIC_MESSAGES.buttonDeactivate
                }
              </span>
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
          <div className="flex justify-center w-full">
            <OctagonAlert className="!size-8 text-yellow-600"></OctagonAlert>
          </div>
          <DrawerTitle className="text-yellow-600 w-full text-center">
            {STATIC_MESSAGES.title}
          </DrawerTitle>
          <div className="px-8">
            <DrawerDescription className="text-center">
              {STATIC_MESSAGES.description}
            </DrawerDescription>
            <DrawerDescription className="!mb-2 text-center">
              Esta acción desactivará a
              <span className="font-medium"> {items.length}</span>
              {items.length === 1
                ? ` ${METADATA.entityName.toLowerCase()}`
                : ` ${METADATA.entityPluralName.toLowerCase()}`}
              .
            </DrawerDescription>
          </div>
          <Alert className="bg-yellow-100/70 text-yellow-600 border-none !mb-2">
            <div className="flex space-x-2 items-center mb-2 justify-center sm:justify-start">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold !mb-0">Precaución</AlertTitle>
            </div>
            <div className="w-full px-5">
              <ul className="space-y-1 list-disc text-start">
                <li>
                  <AlertDescription>{STATIC_MESSAGES.alert}</AlertDescription>
                </li>
                <li>
                  <AlertDescription>{STATIC_MESSAGES.alert2}</AlertDescription>
                </li>
                <li>
                  <AlertDescription>{STATIC_MESSAGES.alert3}</AlertDescription>
                </li>
              </ul>
            </div>
          </Alert>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "text-destructive hover:text-white hover:bg-destructive border border-destructive"
              )} onClick={onDelete} disabled={isPending}>
            {isPending && (
              <RefreshCcw
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Desactivar
          </Button>
          <DrawerClose asChild className={cn(
                buttonVariants({ variant: "default" }),
                "animate-jump animate-twice animate-duration-1000 animate-ease-linear hover:text-white hover:scale-105 hover:transition-all"
              )}>
            {/* <Button variant="outline">Cancelar</Button> */}
            <span>{ STATIC_MESSAGES.buttonCancel }</span>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
