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
import { Textarea } from "@/components/ui/textarea";
import { UPDATEFORMSTATICS as FORMSTATICS} from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { METADATA } from "../_statics/metadata";

interface UpdateStorageTypeSheetProps {
  typeStorage: TypeStorage;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateStorageTypeSheet({
  typeStorage,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdateStorageTypeSheetProps) {
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
            console.error("Error al actualizar tipo de almacén:", error);
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
          <SheetTitle>Actualizar {METADATA.entityName}</SheetTitle>
          <SheetDescription>
            Actualiza la información de este(a) {METADATA.entityName.toLowerCase()} y guarda los cambios
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
                  )}/>
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
