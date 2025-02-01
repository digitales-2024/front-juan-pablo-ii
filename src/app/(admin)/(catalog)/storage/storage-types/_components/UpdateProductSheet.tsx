"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  updateTypeStorageSchema,
  UpdateTypeStorageInput,
  TypeStorage,
} from "../_interfaces/storageTypes.interface";
import { PencilIcon, RefreshCcw } from "lucide-react";
import { useTypeStorages } from "../_hooks/useStorageTypes";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useCategories } from "@/app/(admin)/(catalog)/product/category/_hooks/useCategory";
import { useTypeProducts } from "@/app/(admin)/(catalog)/product/product-types/_hooks/useType";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/statics/forms";
import { UPDATEFORMSTATICS as FORMSTATICS} from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";

interface UpdateProductSheetProps {
  typeStorage: TypeStorage;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateProductSheet({
  typeStorage,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdateProductSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = useTypeStorages();

  // Use controlled state if props are provided, otherwise use internal state
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  // const { oneProductQuery } = useProducts();
  // if (oneProductQuery.isLoading) {
  //   return <LoadingDialogForm />;
  // } else{
  //   if (oneProductQuery.isError) {
  //     return (<GeneralErrorMessage error={oneProductQuery.error} reset={oneProductQuery.refetch} />);
  //   }
  //   if (!oneProductQuery.data) {
  //     return <GeneralErrorMessage error={new Error("No se encontró el producto")} reset={oneProductQuery.refetch} />;
  //   }
  // }

// export const updateTypeStorageSchema = z.object(
//   {
//     name: z.string().optional(),
//     description: z.string().optional(),
//     branchId: z.string().uuid().optional(),
//     staffId: z.string().uuid().optional(),
//   }
// ) satisfies z.ZodType<UpdateTypeStorageDto>;

  const form = useForm<UpdateTypeStorageInput>({
    resolver: zodResolver(updateTypeStorageSchema),
    defaultValues: {
      name: typeStorage.name ?? FORMSTATICS.name.defaultValue,
      description: typeStorage.description ?? FORMSTATICS.description.defaultValue,
      branchId: typeStorage.branchId ?? FORMSTATICS.branchId.defaultValue,
      staffId: typeStorage.staffId ?? FORMSTATICS.staffId.defaultValue,
    },
  });

  const onSubmit = async (data: UpdateTypeStorageInput) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync(
        {
          id: typeStorage.id,
          data,
        },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            console.error("Error al actualizar producto:", error);
            if (error.message.includes("No autorizado")) {
              setTimeout(() => {
                form.reset();
              }, 1000);
            }
          },
        }
      );
    } catch (error) {
      // The error is already handled by the mutation
      console.error("Error in onSubmit:", error);
    }
  };

  const { activeCategoriesQuery: responseCategories } = useCategories();
  const responseTypeProducts = useTypeProducts();
  if (responseCategories.isLoading && responseTypeProducts.activeIsLoading) {
    return <LoadingDialogForm />;
  } else {
    if (responseCategories.isError) {
      return (
        <GeneralErrorMessage
          error={responseCategories.error}
          reset={responseCategories.refetch}
        />
      );
    }
    if (!responseCategories.data) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron categorías")}
          reset={responseCategories.refetch}
        />
      );
    }
    if (responseTypeProducts.activeIsError) {
      return responseTypeProducts.activeError ? (
        <GeneralErrorMessage
          error={responseTypeProducts.activeError}
          reset={responseTypeProducts.activeRefetch}
        />
      ) : null;
    }
    if (!responseTypeProducts.activeData) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron subcategorías")}
          reset={responseTypeProducts.activeRefetch}
        />
      );
    }
  }

  const categoryOptions: Option[] = responseCategories.data.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const typeProductOptions: Option[] = responseTypeProducts.activeData.map(
    (typeProduct) => ({
      label: typeProduct.name,
      value: typeProduct.id,
    })
  );

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Actualizar Producto</SheetTitle>
          <SheetDescription>
            Actualiza la información del producto y guarda los cambios
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={FORMSTATICS.name.name}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{FORMSTATICS.name.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={FORMSTATICS.name.placeholder}
                        type={FORMSTATICS.name.type}
                      />
                    </FormControl>
                    <CustomFormDescription
                      required={FORMSTATICS.name.required}
                    ></CustomFormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Campo de Sucursal */}
              <FormField
                  control={form.control}
                  name={FORMSTATICS.branchId.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel htmlFor={FORMSTATICS.branchId.name}>{FORMSTATICS.branchId.label}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={categoryOptions}
                          placeholder={FORMSTATICS.branchId.placeholder}
                          emptyMessage={FORMSTATICS.branchId.emptyMessage!}
                          value={
                            categoryOptions.find(
                              (option) => option.value === field.value
                            ) ?? undefined
                          }
                          onValueChange={(option) => {
                            field.onChange(option?.value || "");
                          }}
                        />
                      </FormControl>
                      <CustomFormDescription required={FORMSTATICS.branchId.required}></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Campo de tipo de producto */}
                <FormField
                  control={form.control}
                  name={FORMSTATICS.staffId.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        {FORMSTATICS.staffId.label}
                      </FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={typeProductOptions}
                          placeholder={FORMSTATICS.staffId.placeholder}
                          emptyMessage={FORMSTATICS.staffId.emptyMessage!}
                          value={
                            typeProductOptions.find(
                              (option) => option.value === field.value
                            ) ?? undefined
                          }
                          onValueChange={(option) => {
                            field.onChange(option?.value || "");
                          }}
                        />
                      </FormControl>
                      <CustomFormDescription required={FORMSTATICS.staffId.required}></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={FORMSTATICS.description.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.description.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={FORMSTATICS.description.placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                      <CustomFormDescription required={FORMSTATICS.description.required}></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SheetFooter>
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <>
                        <RefreshCcw className="mr-2 size-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar"
                    )}
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
