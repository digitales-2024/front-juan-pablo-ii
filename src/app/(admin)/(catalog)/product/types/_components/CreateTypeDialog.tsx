"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTypeProductDto, TypeProductCreateSchema } from "../types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw, SquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import { CreateTypeForm } from "./CreateTypeForm";
import { useTypeProducts } from "../hook/useType";

const CREATE_TYPE_MESSAGES = {
  button: "Crear tipo de producto",
  title: "Registrar nuevo tipo de producto",
  description: "Rellena los campos para crear un nuevo tipo de producto",
  success: "Tipo de producto creado exitosamente",
  submitButton: "Registrar",
  cancel: "Cancelar",
} as const;

export function CreateTypeDialog({ diferentPage }: { diferentPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createTypeProduct, isCreating } = useTypeProducts();

  const form = useForm<CreateTypeProductDto>({
    resolver: zodResolver(TypeProductCreateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function handleSubmit(input: CreateTypeProductDto) {
    startCreateTransition(() => {
      createTypeProduct(input, {
        onSuccess: (response) => {
          if (!("error" in response)) {
            setOpen(false);
            form.reset();
          }
        },
      });
    });
  }

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button
        type="submit"
        disabled={isCreatePending || isCreating}
        className="w-full"
      >
        {(isCreatePending || isCreating) && (
          <RefreshCcw
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {CREATE_TYPE_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_TYPE_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      {diferentPage ? (
        <SquarePlus className="mr-2 size-4" aria-hidden="true" />
      ) : (
        <Plus className="mr-2 size-4" aria-hidden="true" />
      )}
      {CREATE_TYPE_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent tabIndex={undefined}>
          <DialogHeader>
            <DialogTitle>{CREATE_TYPE_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_TYPE_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] w-full justify-center gap-4">
            <CreateTypeForm form={form} onSubmit={handleSubmit}>
              <DialogFooter>
                <DialogFooterContent />
              </DialogFooter>
            </CreateTypeForm>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{CREATE_TYPE_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_TYPE_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="mt-4 max-h-full w-full gap-4 pr-4">
          <CreateTypeForm form={form} onSubmit={handleSubmit}>
            <DrawerFooter className="gap-2 sm:space-x-0">
              <Button disabled={isCreatePending || isCreating}>
                {(isCreatePending || isCreating) && (
                  <RefreshCcw
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {CREATE_TYPE_MESSAGES.submitButton}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">{CREATE_TYPE_MESSAGES.cancel}</Button>
              </DrawerClose>
            </DrawerFooter>
          </CreateTypeForm>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}