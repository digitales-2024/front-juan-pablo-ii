"use client";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus } from "lucide-react";
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
import { useSelectProductDispatch } from "../../../_hooks/useSelectProducts";
import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./SelectProductTableColumns";

const CREATE_PRODUCT_MESSAGES = {
  button: "Añadir producto(s)",
  title: "Seleccionar productos para lista de movimientos",
  description:
    "Selecciona uno o varios productos para añadir a la lista de movimientos.",
  success: "Productos guardados exitosamente",
  submitButton: "Guardar selección",
  cancel: "Cancelar",
} as const;

interface SelectProductDialogProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  data: ActiveProduct[];
  className?: string;
}
export function SelectProductDialog({
  data,
  className,
  ...rest
}: SelectProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSelectRows, setLocalSelectRows] = useState<ActiveProduct[]>([]);
  const dispatch = useSelectProductDispatch();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleSave = (selectedRows: ActiveProduct[]) => {
    dispatch({ type: "append", payload: selectedRows });
    setOpen(false);
  };

  const handleClose = () => {
    //form.reset();
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button
        type="button"
        //disabled={isCreatePending || createMutation.isPending}
        onClick={() => handleSave(localSelectRows)}
        className="w-full"
      >
        {CREATE_PRODUCT_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_PRODUCT_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      variant="outline"
      size="sm"
      className={className}
      {...rest}
    >
      <Plus className="size-4 mr-2" aria-hidden="true" />
      {CREATE_PRODUCT_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)] overflow-auto">
          <DialogHeader>
            <DialogTitle>{CREATE_PRODUCT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_PRODUCT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-full">
            <DataTable
              columns={columns}
              data={data}
              onRowSelectionChange={(selectedRows) => {
                setLocalSelectRows(() => [...selectedRows]);
              }}
            />
          </div>
          <DialogFooter>
            <DialogFooterContent />
          </DialogFooter>
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
          <DrawerTitle>{CREATE_PRODUCT_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_PRODUCT_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-auto max-h-[calc(100dvh-12rem)]">
          <DataTable
            columns={columns}
            data={data}
            onRowSelectionChange={(selectedRows) => {
              setLocalSelectRows(() => [...selectedRows]);
            }}
          />
        </div>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
