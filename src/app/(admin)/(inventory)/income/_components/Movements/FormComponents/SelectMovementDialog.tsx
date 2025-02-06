"use client";
import { useEffect, useState, useTransition } from "react";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductInput, createProductSchema } from "../_interfaces/product.interface";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProductForm } from "./CreateProductForm";
import { useProduct } from "../_hooks/useProduct";
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
import { useSelectProductDispatch } from "../../../_hooks/useSelectProducts";

const CREATE_PRODUCT_MESSAGES = {
    button: "Seleccionar producto(s)",
    title: "Seleccionar productos para lista de movimientos",
    description: "Selecciona uno o varios productos para añadir a la lista de movimientos.",
    success: "Productos guardados exitosamente",
    submitButton: "Guardar selección",
    cancel: "Cancelar",
} as const;

export function CreateProductDialog() {
    const [open, setOpen] = useState(false);
    //const [isCreatePending, startCreateTransition] = useTransition();
    const dispatch = useSelectProductDispatch()
    const isDesktop = useMediaQuery("(min-width: 640px)");
    
    // const { createMutation } = useProduct();

    // const form = useForm<CreateProductInput>({
    //     resolver: zodResolver(createProductSchema),
    //     defaultValues: {
    //         name: "",
    //         storageId: "",
    //         date: "",
    //         state: "false",
    //         description: "",
    //         referenceId: "",
    //     },
    // });

    // function handleSubmit(input: CreateProductInput) {
    //     console.log('Ingresando a handle submit', createMutation.isPending, isCreatePending);
    //     if (createMutation.isPending || isCreatePending) return;

    //     startCreateTransition(() => {
    //         createMutation.mutate(input, {
    //             onSuccess: () => {
    //                 setOpen(false);
    //                 form.reset();
    //             },
    //             onError: (error) => {
    //                 console.error(`Error al crear ${METADATA.entityName.toLowerCase()}:`, error);
    //                 if (error.message.includes("No autorizado")) {
    //                     setTimeout(() => {
    //                         form.reset();
    //                     }, 1000);
    //                 }
    //             },
    //         });
    //     });
    // }

    const handleClose = () => {
        //form.reset();
        setOpen(false);
    };

    const DialogFooterContent = () => (
        <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
            <Button 
                type="submit" 
                //disabled={isCreatePending || createMutation.isPending}
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
                <DialogContent className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)]">
                    <DialogHeader>
                        <DialogTitle>{CREATE_PRODUCT_MESSAGES.title}</DialogTitle>
                        <DialogDescription>
                            {CREATE_PRODUCT_MESSAGES.description}
                        </DialogDescription>
                    </DialogHeader>
                    {/* <CreateProductForm form={form} onSubmit={handleSubmit}>
                        <DevelopmentZodError form={form} />
                        <DialogFooter>
                            <DialogFooterContent />
                        </DialogFooter>
                    </CreateProductForm> */}

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
                {/* <CreateProductForm form={form} onSubmit={handleSubmit}>
                    <DevelopmentZodError form={form} />
                    <DrawerFooter>
                        <DialogFooterContent />
                    </DrawerFooter>
                </CreateProductForm> */}
            </DrawerContent>
        </Drawer>
    );
}

// function DevelopmentZodError({ form }: { form: UseFormReturn<CreateProductInput> }) {
//     console.log('Ingresando a DevelopmentZodError', process.env.NEXT_PUBLIC_ENV);
//     if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
//     const [errors, setErrors] = useState<FieldErrors<CreateProductInput>>({});
//     useEffect(() => {
//         if (form.formState.errors) {
//             setErrors(form.formState.errors);
//         }
//     }, [form.formState.errors]);
//     return  (
//         <div>
//             <div>
//                 {
//                     Object.keys(errors).map((key) => (
//                         <p key={key}>
//                             {key}: {errors[key as keyof CreateProductInput]?.message}
//                         </p>
//                     ))
//                 }
//             </div>
//         </div>
//     )
// }
