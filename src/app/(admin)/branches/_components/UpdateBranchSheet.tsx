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
import { Branch, updateBranchSchema, UpdateBranchInput } from "../_interfaces/branch.interface";
import { PencilIcon, RefreshCcw } from "lucide-react";
import { useBranches } from "../_hooks/useBranches";
import { PhoneInput } from "@/components/ui/phone-input";

interface UpdateBranchSheetProps {
  branch: Branch;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateBranchSheet({ 
  branch, 
  open: controlledOpen, 
  onOpenChange,
  showTrigger = true
}: UpdateBranchSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = useBranches();

  // Usar el estado controlado si se proporcionan las props, sino usar el estado interno
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const form = useForm<UpdateBranchInput>({
    resolver: zodResolver(updateBranchSchema),
    defaultValues: {
      name: branch.name,
      address: branch.address,
      phone: branch.phone ?? "",
    },
  });

  const onSubmit = async (data: UpdateBranchInput) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync({
        id: branch.id,
        data,
      }, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error("Error al actualizar sucursal:", error);
          if (error.message.includes("No autorizado")) {
            setTimeout(() => {
              form.reset();
            }, 1000);
          }
        },
      });
    } catch (error) {
      // El error ya es manejado por la mutación
      console.error("Error en onSubmit:", error);
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
          <SheetTitle>Actualizar Sucursal</SheetTitle>
          <SheetDescription>
            Actualiza la información de la sucursal y guarda los cambios
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Sede Central" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Av. Principal 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="PE"
                        placeholder="Ingrese el teléfono"
                        value={field.value ?? ""}
                        onChange={(value) => field.onChange(value ?? undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                  >
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
