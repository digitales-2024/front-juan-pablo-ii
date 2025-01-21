"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
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
} from "@/components/ui/sheet";
import { Branch, updateBranchSchema, UpdateBranchInput } from "../_interfaces/branch.interface";
import { PencilIcon } from "lucide-react";
import { useBranches } from "../_hooks/useBranches";

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

  async function onSubmit(data: UpdateBranchInput) {
    try {
      await updateMutation.mutateAsync({ id: branch.id, data });
      toast.success("Sucursal actualizada exitosamente");
      setOpen(false);
    } catch (error) {
      console.log(error);
      // El error ya es manejado por el hook
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {showTrigger ? (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <PencilIcon className="h-4 w-4" />
            <span className="sr-only">Editar sucursal</span>
          </Button>
        </SheetTrigger>
      ) : null}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar Sucursal</SheetTitle>
          <SheetDescription>
            Actualice los datos de la sucursal "{branch.name}".
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
                      <Input placeholder="+51999999999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <Button type="submit" className="w-full" disabled={updateMutation.isLoading}>
                {updateMutation.isLoading ? "Actualizando..." : "Actualizar Sucursal"}
              </Button> */}
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
