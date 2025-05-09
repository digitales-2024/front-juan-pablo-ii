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
import { UpdateOutgoingStorageInput } from "../../../_interfaces/outgoing.interface";
import { UseFormReturn } from "react-hook-form";
import { useProductsStockByStorage, useUpdateProductStockByStorage } from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
import { Label } from "@/components/ui/label";

const CREATE_PRODUCT_MESSAGES = {
  button: "Añadir producto(s)",
  title: "Seleccionar productos en stock",
  description:
    "No puedes cambiar el almacén, pero si puedes añadir otros productos en stock del almacén seleccionado para añadirlos a la lista de movimientos.",
  onZeroStockSelectedItem: "Existen productos seleccionados en este almacén con stock en 0. Estos productos no serán añadidos a la lista de movimientos.",
  success: "Productos guardados exitosamente",
  submitButton: "Guardar selección",
  cancel: "Cancelar",
} as const;

interface SelectProductDialogProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  form: UseFormReturn<UpdateOutgoingStorageInput>;
  className?: string;
  storageId?: string;
}
export function UpdateOutgoingSelectProductDialog({
  //data,
  storageId,
  form,
  className,
  ...rest
}: SelectProductDialogProps) {
  const [open, setOpen] = useState(false);
  //const [data, setData] = useState<OutgoingProducStockForm[]>([]);
  const [localSelectRows, setLocalSelectRows] = useState<
    OutgoingProducStockForm[]
  >([]);
  const [hasZeroStockRowsSelected, setHasZeroStockRowsSelected] = useState<boolean>(false);

  const findZeroStockSelectedItems = (selectedRows: OutgoingProducStockForm[], selectedStorageId:string|null) => {
    if (selectedStorageId === null) return;
    const selectedStorageStocks = selectedRows.flatMap((row)=>(
      row.Stock.map((stock)=>(
        {
          storageId: stock.Storage.id,
          productId: row.id,
          stock: stock.stock
        }
      ))
    ))
    const zeroStockSelectedItems = selectedStorageStocks.filter((stock) => (stock.stock === 0) && (stock.storageId === selectedStorageId));
    return zeroStockSelectedItems;
  }

  const onRowSelectionChange= (selectedRows: OutgoingProducStockForm[]) => {
    const zeroStockSelectedItems = findZeroStockSelectedItems(selectedRows, selectedStorageId);
    if (zeroStockSelectedItems && zeroStockSelectedItems.length > 0){
      setHasZeroStockRowsSelected(true);
      // return;
      const productsIds = zeroStockSelectedItems.map((item)=>item.productId);
      setLocalSelectRows(()=>selectedRows.filter((row)=>!productsIds.includes(row.id)));
      return;
    }
    setHasZeroStockRowsSelected(false);
    setLocalSelectRows(() => [...selectedRows]);
  }
  // const [selectedStorageHasChanged, setSelectedStorageHasChanged] = useState<boolean>(false);
  const [selectedStorageId, setSelectedStorageId] = useState<string | null>(form.getValues('storageId')??null);
  // const selectedProductsTanstack = useSelectedProducts();
  const { activeStoragesQuery: responseStorage } = useStorages();

  const productsStockQuery = useProductsStockByStorage()
  const { updateProductStock, cleanProductStock } = useUpdateProductStockByStorage();
  const dispatch = useSelectProductDispatch();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleSave = (selectedRows: OutgoingProducStockForm[]) => {
    cleanProductStock();
    setSelectedStorageId(null);
    dispatch({ type: "replace", payload: selectedRows });
    setOpen(false);
  };

  const handleClose = () => {
    //form.reset();
    cleanProductStock();
    setSelectedStorageId(null);
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

  // useEffect(()=>
  //   setSelectedStorageHasChanged(true),
  //   [selectedStorageId]
  // )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)] overflow-auto">
          <DialogHeader>
            <DialogTitle>{CREATE_PRODUCT_MESSAGES.title}</DialogTitle>
            <DialogDescription className="text-balance">
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
              disabled={!!storageId}
              value={selectedStorageId??undefined}
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
          { productsStockQuery.isLoading && <LoadingDialogForm />}
          { selectedStorageId && <div className="overflow-auto max-h-full">
            <DataTable
                columns={columns}
                data={productsStockQuery.data??[]}
                onRowSelectionChange={onRowSelectionChange}
              />
          </div>}
          <DialogFooter>
          {
              hasZeroStockRowsSelected && <p className="w-full flex items-center  text-center text-destructive text-sm text-pretty">
                <span>{CREATE_PRODUCT_MESSAGES.onZeroStockSelectedItem}</span>
              </p>
            }
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
        <div className="w-full px-1 mb-4">
            <Label>
              Seleccione un almacén
            </Label>
            <Select
              // onValueChange={(value) => {
              //   updateProductStock({
              //     productId: row.original.id,
              //     storageId: value,
              //   })
              // }}
              value={selectedStorageId??undefined}
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
        {
          selectedStorageId && <div className="overflow-auto max-h-[calc(100dvh-12rem)]">
            <DataTable
            columns={columns}
            data={productsStockQuery.data??[]}
            onRowSelectionChange={(selectedRows) => {
              setLocalSelectRows(() => [...selectedRows]);
            }}
                    />
          </div>
        }
        <DrawerFooter className="space-y-2">
        {
              hasZeroStockRowsSelected && <p className="w-full flex items-center  text-center text-destructive text-sm text-pretty">
                {CREATE_PRODUCT_MESSAGES.onZeroStockSelectedItem}
              </p>
            }
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
