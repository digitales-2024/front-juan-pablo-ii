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
// import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./SelectProductTableColumns";
import { OutgoingProducStockForm } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import LoadingDialogForm from "../../LoadingDialogForm";
import GeneralErrorMessage from "../../errorComponents/GeneralErrorMessage";
import { CreateOutgoingInput } from "../../../_interfaces/outgoing.interface";
import { UseFormReturn } from "react-hook-form";
import { useProductsStockByStorage, useUpdateProductStockByStorage } from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";

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
  //data: OutgoingProducStockForm[];
  form: UseFormReturn<CreateOutgoingInput>;
  className?: string;
}
export function SelectProductDialog({
  //data,
  form,
  className,
  ...rest
}: SelectProductDialogProps) {
  const [open, setOpen] = useState(false);
  //const [data, setData] = useState<OutgoingProducStockForm[]>([]);
  const [localSelectRows, setLocalSelectRows] = useState<
    OutgoingProducStockForm[]
  >([]);
  const [selectedStorageId, setSelectedStorageId] = useState<string | null>(null);
  // const selectedProductsTanstack = useSelectedProducts();
  const { activeStoragesQuery: responseStorage } = useStorages();

  const productsStockQuery = useProductsStockByStorage()
  const { updateProductStock, cleanProductStock } = useUpdateProductStockByStorage();
  const dispatch = useSelectProductDispatch();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleSave = (selectedRows: OutgoingProducStockForm[]) => {
    // console.log('oldStateTanstack', selectedProductsTanstack);
    // console.log('handleSave', selectedRows);
    cleanProductStock();
    dispatch({ type: "append", payload: selectedRows });
    setOpen(false);
  };

  const handleClose = () => {
    //form.reset();
    cleanProductStock();
    setOpen(false);
  };

  const handleUpdateStorageFormField = (storageId: string) => {
    form.setValue("storageId", storageId);
  }

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button
        type="button"
        //disabled={isCreatePending || createMutation.isPending}
        onClick={() => handleSave(localSelectRows)}
        className="w-full"
      >
        {/* {(isCreatePending || createMutation.isPending) && (
                    <RefreshCcw
                        className="mr-2 size-4 animate-spin"
                        aria-hidden="true"
                    />
                )} */}
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

    if (responseStorage.isLoading && productsStockQuery.isLoading) {
      return <LoadingDialogForm />;
    } else {
      if (responseStorage.isError) {
        return (
          <GeneralErrorMessage
            error={responseStorage.error}
            reset={responseStorage.refetch}
          />
        );
      }
      if (!responseStorage.data) {
        return (
          <GeneralErrorMessage
            error={new Error("No se encontraron almacenes")}
            reset={responseStorage.refetch}
          />
        );
      }
    }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)]">
          <DialogHeader>
            <DialogTitle>{CREATE_PRODUCT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_PRODUCT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <div className="w-1/2">
            <Select
              // onValueChange={(value) => {
              //   updateProductStock({
              //     productId: row.original.id,
              //     storageId: value,
              //   })
              // }}
              onValueChange={
                async (value) => {
                  setSelectedStorageId(value);
                  handleUpdateStorageFormField(value);
                   await updateProductStock({storageId:value});
                }
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione un almacén" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="max-h-40">
                  {responseStorage.data.length === 0 ? (
                    <SelectGroup>
                      <SelectLabel>No existe stock en ningún almacén</SelectLabel>
                    </SelectGroup>
                  ) : (
                    <SelectGroup>
                      <SelectLabel>Almacenes disponibles</SelectLabel>
                      {responseStorage.data.map((storage) => (
                        <SelectItem key={storage.id} value={storage.id}>
                          <div className="capitalize">
                            <span>{storage.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          { selectedStorageId && <DataTable
              columns={columns}
              data={productsStockQuery.data??[]}
              onRowSelectionChange={(selectedRows) => {
                setLocalSelectRows(() => [...selectedRows]);
              }}
            />}
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
        {
          selectedStorageId && <DataTable
          columns={columns}
          data={productsStockQuery.data??[]}
          onRowSelectionChange={(selectedRows) => {
            setLocalSelectRows(() => [...selectedRows]);
          }}
        />
        }
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
