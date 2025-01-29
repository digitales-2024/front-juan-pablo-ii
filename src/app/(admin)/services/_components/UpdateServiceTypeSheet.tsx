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
  ServiceType, 
  updateServiceTypeSchema, 
  UpdateServiceTypeDto 
} from "../_interfaces/service-type.interface";
import { PencilIcon, RefreshCcw } from "lucide-react";
import { useServiceTypes } from "../_hooks/useServiceTypes";
import { toast } from "sonner";

interface UpdateServiceTypeSheetProps {
  serviceType: ServiceType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateServiceTypeSheet({ 
  serviceType, 
  open: controlledOpen, 
  onOpenChange,
  showTrigger = true
}: UpdateServiceTypeSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = useServiceTypes();

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const form = useForm<UpdateServiceTypeDto>({
    resolver: zodResolver(updateServiceTypeSchema),
    defaultValues: {
      name: serviceType.name,
      description: serviceType.description ?? "",
    },
  });

  const onSubmit = async (data: UpdateServiceTypeDto) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync({
        id: serviceType.id,
        data,
      }, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error("Error al actualizar tipo de servicio:", error);
          toast.error(error.message || "Error al actualizar el tipo de servicio");
        },
      });
    } catch (error) {
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
          <SheetTitle>Actualizar Tipo de Servicio</SheetTitle>
          <SheetDescription>
            Actualiza la información del tipo de servicio y guarda los cambios
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
                      <Input 
                        placeholder="Consultas" 
                        {...field} 
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Descripción del tipo de servicio" 
                        {...field} 
                        disabled={updateMutation.isPending}
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