"use client";
import { useEffect, useState, useTransition } from "react";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductInput, createProductSchema } from "../_interfaces/products.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProductForm } from "./CreateProductForm";
import { useProducts } from "../_hooks/useProduct";
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
import { METADATA } from "../_statics/metadata";

const CREATE_PRODUCT_MESSAGES = {
  button: "Crear producto",
  title: "Registrar nuevo producto",
  description: "Rellena los campos para crear un nuevo producto",
  success: "Producto creado exitosamente",
  submitButton: "Crear producto",
  cancel: "Cancelar",
} as const;

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { createMutation } = useProducts();

  // export const createProductSchema = z.object({
  //   categoriaId: z.string().min(1, "La categoría es requerida").uuid(),
  //   tipoProductoId: z.string().min(1, "El tipo de producto es requerido").uuid(),
  //   name: z.string().min(1, "El nombre es requerido"),
  //   precio: z.number().min(0, "El precio no puede ser negativo"),
  //   unidadMedida: z.string().optional(),
  //   proveedor: z.string().optional(),
  //   uso: z.string().optional(),
  //   usoProducto: z.string().optional(),
  //   description: z.string().optional(),
  //   codigoProducto: z.string().optional(),
  //   descuento: z.number().optional(),
  //   observaciones: z.string().optional(),
  //   condicionesAlmacenamiento: z.string().optional(),
  //   imagenUrl: z.string().url().optional(),
  // }) satisfies z.ZodType<CreateProductDto>;

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      categoriaId: "",
      tipoProductoId: "",
      name: "",
      precio: 0,
      unidadMedida: "",
      proveedor: "",
      uso: "",
      usoProducto: "",
      description: "",
      codigoProducto: "",
      descuento: 0,
      observaciones: "",
      condicionesAlmacenamiento: "",
      imagenUrl: "https://fakeimg.pl/600x400"
    },
  });

  function handleSubmit(input: CreateProductInput) {
    console.log('Ingresando a handdle submit',createMutation.isPending, isCreatePending);
    if (createMutation.isPending || isCreatePending) return;

    startCreateTransition(() => {
      createMutation.mutate(input, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error(`Error al crear ${METADATA.entityName.toLowerCase()}:`, error);
          if (error.message.includes("No autorizado")) {
            setTimeout(() => {
              form.reset();
            }, 1000);
          }
        },
      });
    });
  }

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  //ACtivate only when form errors
  // useEffect(() => {
  //   if (form.formState.errors) {
  //     console.log("Errores en el formulario", form.formState.errors);
  //   }
  // }, [form.formState.errors]);

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button 
        type="submit" 
        disabled={isCreatePending || createMutation.isPending}
        className="w-full"
      >
        {(isCreatePending || createMutation.isPending) && (
          <RefreshCcw
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
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
        <DialogContent className="max-w-xl max-h-[calc(100vh-4rem)]">
          <DialogHeader>
            <DialogTitle>{CREATE_PRODUCT_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_PRODUCT_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateProductForm form={form} onSubmit={handleSubmit}>
            <DevelopmentZodError form={form} />
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateProductForm>
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
        <CreateProductForm form={form} onSubmit={handleSubmit}>
          <DevelopmentZodError form={form} />
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateProductForm>
      </DrawerContent>
    </Drawer>
  );
}


function DevelopmentZodError({ form }: { form: UseFormReturn<CreateProductInput> }) {
  console.log('Ingresando a DevelopmentZodError', process.env.NEXT_PUBLIC_ENV);
  if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
  const [errors, setErrors] = useState<FieldErrors<CreateProductInput>>({});
  useEffect(() => {
    if (form.formState.errors) {
      setErrors(form.formState.errors);
    }
  }, [form.formState.errors]);
  return  (
    <div>
      <div>
        {
          Object.keys(errors).map((key) => (
            <p key={key}>
              {key}: {errors[key as keyof CreateProductInput]?.message}
            </p>
          ))
        }
      </div>
    </div>
  )
}