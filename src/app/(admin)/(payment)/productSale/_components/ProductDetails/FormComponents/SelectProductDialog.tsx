/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
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
// import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./SelectProductTableColumns";
import { OutgoingProducStockForm, OutgoingProductStock } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import LoadingDialogForm from "../../LoadingDialogForm";
import GeneralErrorMessage from "../../errorComponents/GeneralErrorMessage";
import { UseFormReturn } from "react-hook-form";
import { useProductsStockByStorage, useProductsStockByUse, useUpdateProductStockByStorage } from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
import { Label } from "@/components/ui/label";
import { CreateProductSaleBillingInput } from "@/app/(admin)/(payment)/orders/_interfaces/order.interface";
import { useSelectProductDispatch } from "../../../_hooks/useSelectProducts";
import { toast } from "sonner";

const CREATE_PRODUCT_MESSAGES = {
  button: "Añadir producto(s)",
  title: "Seleccionar nuevos productos para procesar una órden de venta.",
  description:
    "Selecciona nuevos productos que figuran en la receta y procederán con la órden de venta.",
  onZeroStockSelectedItem: "Existen productos seleccionados en este almacén con stock en 0. Estos productos no serán añadidos a la lista de movimientos.",
  success: "Servicios y/o Productos guardados exitosamente",
  submitButton: "Guardar selección",
  cancel: "Cancelar",
} as const;

// ProductPurchaseItemDto
// CreateProductPurchaseBillingDto

interface SelectProductDialogProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  //data: OutgoingProducStockForm[];
  form: UseFormReturn<CreateProductSaleBillingInput>;
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
    OutgoingProductStock[]
  >([]);
  // const [hasZeroStockRowsSelected, setHasZeroStockRowsSelected] = useState<boolean>(false);
  // const [selectedStorageHasChanged, setSelectedStorageHasChanged] = useState<boolean>(false);
  // const [selectedStorageId, setSelectedStorageId] = useState<string | null>(form.getValues("storageId")??null);
  // const selectedProductsTanstack = useSelectedProducts();
  // const { activeStoragesQuery: responseStorage } = useStorages();

  // const productsStockQuery = useProductsStockByStorage()
  // const { updateProductStock, cleanProductStock } = useUpdateProductStockByStorage();
  const useProductsStockQuery = useProductsStockByUse()
  const { productStockQuery } = useProductsStockQuery('VENTA');
  const dispatch = useSelectProductDispatch();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // const findZeroStockSelectedItems = (selectedRows: OutgoingProducStockForm[], selectedStorageId:string|null) => {
  //   if (selectedStorageId === null) return;
  //   const selectedStorageStocks = selectedRows.flatMap((row)=>(
  //     row.Stock.map((stock)=>(
  //       {
  //         storageId: stock.Storage.id,
  //         productId: row.id,
  //         stock: stock.stock
  //       }
  //     ))
  //   ))
  //   const zeroStockSelectedItems = selectedStorageStocks.filter((stock) => (stock.stock === 0) && (stock.storageId === selectedStorageId));
  //   return zeroStockSelectedItems;
  // }

  const onRowSelectionChange= (selectedRows: OutgoingProductStock[]) => {
    //const zeroStockSelectedItems = findZeroStockSelectedItems(selectedRows, selectedStorageId);
    // if (zeroStockSelectedItems && zeroStockSelectedItems.length > 0){
    //   setHasZeroStockRowsSelected(true);
    //   // return;
    //   const productsIds = zeroStockSelectedItems.map((item)=>item.productId);
    //   setLocalSelectRows(()=>selectedRows.filter((row)=>!productsIds.includes(row.id)));
    //   return;
    // }
    // setHasZeroStockRowsSelected(false);
    setLocalSelectRows(() => [...selectedRows]);
  }

  const handleSave = (selectedRows: OutgoingProductStock[]) => {
    // cleanProductStock();
    // setSelectedStorageId(null);
    console.log(selectedRows)
    dispatch({ type: "replace", payload: selectedRows });
    setOpen(false);
  };

  const handleClose = () => {
    // cleanProductStock();
    // setSelectedStorageId(null);
    setOpen(false);
  };

  // const handleUpdateStorageFormField = (storageId: string) => {
  //   form.setValue("storageId", storageId);
  // }

  // const storageIdActions = async (storageId:string) => {
  //   setSelectedStorageId(storageId);
  //   handleUpdateStorageFormField(storageId); //Actualiza el formulario de RHF
  //   await updateProductStock({storageId:storageId}); //Actualiza el stock de los productos
  // }

  // useEffect(() => {
  //   // Control de ejecución para evitar fetchs innecesarios
  //   let isMounted = true;
    
  //   // Definir función async dentro del efecto
  //   const fetchProductStock = async () => {
  //     try {
  //       if (isMounted && newStorageId) {
  //         await updateProductStock({storageId: newStorageId});
  //       }
  //     } catch (error) {
  //       if (isMounted) {
  //         console.error("Error actualizando producto stock:", error);
  //       }
  //     }
  //   };
  
  //   // Ejecutar la función async si hay un ID válido
  //   if (newStorageId) {
  //     fetchProductStock().then(
  //       () => {
  //         if (isMounted) {
  //           toast.success("Stock actualizado correctamente");
  //         }
  //       }
  //     ).catch(error => {
  //       if (isMounted) {
  //         toast.error("Error en fetchProductStock:");
  //       }
  //     });
  //   }

  //   // Función de limpieza: evita actualizar estado si el componente ya no está montado
  //   return () => {
  //     isMounted = false; // Previene actualizaciones de estado después de desmontarse
  //   };
  // }, [form.watch('storageId'), updateProductStock, setSelectedStorageId]);

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

    if (productStockQuery.isLoading) {
      return <LoadingDialogForm />;
    } else {
      if (productStockQuery.isError) {
        return (
          <GeneralErrorMessage
            error={productStockQuery.error}
            reset={productStockQuery.refetch}
          />
        );
      }
      if (!productStockQuery.data) {
        return (
          <GeneralErrorMessage
            error={new Error("No se encontraron productos en stock")}
            reset={productStockQuery.refetch}
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
            <DialogDescription>
              {CREATE_PRODUCT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          { productStockQuery.isLoading && <LoadingDialogForm />}
          <div className="overflow-auto max-h-full">
            <DataTable
                columns={columns}
                data={productStockQuery.data??[]}
                onRowSelectionChange={onRowSelectionChange}
              />
          </div>
          <DialogFooter className="space-x-2 space-y-2">
            {/* {
              hasZeroStockRowsSelected && <p className="w-full flex items-center  text-center text-destructive text-sm text-pretty">
                <span>{CREATE_PRODUCT_MESSAGES.onZeroStockSelectedItem}</span>
              </p>
            } */}
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
        <div className="overflow-auto max-h-full">
            <DataTable
                columns={columns}
                data={productStockQuery.data??[]}
                onRowSelectionChange={onRowSelectionChange}
              />
          </div>
        <DrawerFooter className="space-y-2">
          {/* {
              hasZeroStockRowsSelected && <p className="w-full flex items-center  text-center text-destructive text-sm text-pretty">
                {CREATE_PRODUCT_MESSAGES.onZeroStockSelectedItem}
              </p>
            } */}
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
