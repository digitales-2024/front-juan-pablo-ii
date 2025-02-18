"use client";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TableProperties } from "lucide-react";
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
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MovementsTable } from "./MovementsTable";
import { IncomingMovement } from "../../_interfaces/income.interface";

export function ShowMovementsDialog({data, incomingName}: {data: IncomingMovement[], incomingName: string}) {
    const SHOW_MOVEMENTS_MESSAGES = {
        button: "Mostrar Movimientos",
        title: "Movimientos de la entrada",
        description: `Aquí puedes ver los movimientos de la entrada "${incomingName}".`,
        cancel: "Cerrar",
    } as const;
  const [open, setOpen] = useState(false);
  //   const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleClose = () => {
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {SHOW_MOVEMENTS_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      variant="outline"
      size="sm"
      aria-label="Open menu"
      className="flex p-2 data-[state=open]:bg-muted text-sm"
    >
      <TableProperties className="text-primary size-7"/>
      {SHOW_MOVEMENTS_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)]">
          <DialogHeader>
            <DialogTitle>{SHOW_MOVEMENTS_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {SHOW_MOVEMENTS_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <MovementsTable data={data}></MovementsTable>
          <DialogFooter>
              <DialogFooterContent />
        </DialogFooter>
          {/* <CreateProductForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            
          </CreateProductForm> */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{SHOW_MOVEMENTS_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {SHOW_MOVEMENTS_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <MovementsTable data={data}></MovementsTable>
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}