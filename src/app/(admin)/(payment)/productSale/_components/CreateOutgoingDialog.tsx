// "use client";
// import { useCallback, useEffect, useState, useTransition } from "react";
// import {
//   FieldErrors,
//   useFieldArray,
//   useForm,
//   UseFormReturn,
// } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   CreateOutgoingInput,
//   createOutgoingSchema,
// } from "../_interfaces/outgoing.interface";
// import { useMediaQuery } from "@/hooks/use-media-query";
// import { Plus, RefreshCcw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { CreateOutgoingForm } from "./CreateOutgoingForm";
// import { useOutgoing } from "../_hooks/useOutgoing";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { useSelectProductDispatch } from "../_hooks/useSelectProducts";
// import { useIncoming } from "../../income/_hooks/useIncoming";
// import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";

// const CREATE_OUTGOING_MESSAGES = {
//   button: "Crear salida",
//   title: "Registrar nueva salida",
//   description: "Rellena los campos para registrar una nueva salida",
//   success: "Salida creada exitosamente",
//   submitButton: "Crear salida",
//   cancel: "Cancelar",
// } as const;

// export function CreateOutgoingDialog() {
//   const [open, setOpen] = useState(false);
//   const [isCreatePending, startCreateTransition] = useTransition();
//   const isDesktop = useMediaQuery("(min-width: 640px)");
//   const queryClient = useQueryClient();
//   const { createMutation } = useOutgoing();
//   const { createMutation: incomingCreateMutation } = useIncoming();
//   const dispatch = useSelectProductDispatch();

//   const form = useForm<CreateOutgoingInput>({
//     resolver: zodResolver(createOutgoingSchema, undefined, {
//       raw: true, //to be able to use useFIeldArray
//     }),
//     defaultValues: {
//       name: "",
//       storageId: "",
//       date: "",
//       //state: "false",
//       state: false,
//       description: "",
//       referenceId: "",
//     },
//   });

//   const formControl = form.control;

//   const fieldArray = useFieldArray({
//     control: formControl,
//     name: "movement",
//     rules: {
//       minLength: 1,
//     },
//   });
//   const { remove } = fieldArray;

//   const handleClearProductList = useCallback(() => {
//     // this removes from the tanstack state management
//     dispatch({
//       type: "clear",
//     });
//     //THis removes from the react-hook-form arraylist
//     remove();
//   }, []);

//   useEffect(() => {
//     if (!open) {
//       handleClearProductList();
//     }
//   }, [open, handleClearProductList]);

//   function handleSubmit(input: CreateOutgoingInput) {
//     // console.log('Input received', input);
//     // console.log('Ingresando a handdle submit',createMutation.isPending, isCreatePending);
//     if (createMutation.isPending || isCreatePending) return;

//   //   {
//   //     "name": "INgreso regulacion",
//   //     "storageId": "61de3a1b-9538-48a0-8cdc-62edafcef760",
//   //     "date": "2025-02-11",
//   //     "state": true,
//   //     "description": "",
//   //     "referenceId": "",
//   //     "movement": [
//   //         {
//   //             "productId": "4d42f81a-2d5f-4bc5-8ad1-992c6a537934",
//   //             "quantity": 4
//   //         },
//   //         {
//   //             "productId": "397d68a1-cb47-4402-9546-0ab7b57ec93f",
//   //             "quantity": 2
//   //         }
//   //     ]
//   // }

//     startCreateTransition(() => {
//       createMutation.mutate(input, {
//         onSuccess: (res) => {
//           //Creación de la nueva entrada en el stock del stoarage de destino
//           if (input?.isTransference && input?.referenceId) {
//             incomingCreateMutation.mutate({
//               name: input.name,
//               description: input.description,
//               storageId: input.referenceId, //Se envia el almacen de destino
//               date: input.date,
//               state: input.state,
//               referenceId: input.storageId, //Se registra el almacen de salida
//               isTransference: input.isTransference,
//               outgoingId: res.data.id,
//               movement: [...input.movement],
//             }, {
//               onSuccess: async() => {

//                 await Promise.all([
//                   queryClient.refetchQueries({ queryKey: ["product-stock-by-storage"] }),
//                   queryClient.refetchQueries({ queryKey: ["stock"] }),
//                   queryClient.refetchQueries({ queryKey: ["detailed-incomings"] }),
//                   queryClient.refetchQueries({ queryKey: ["detailed-outcomes"] }),
//                 ])
//                 toast.success("Salida y entrada creadas exitosamente", {})
//               },
//               onError: (error) => {
//                 toast.error(error.message || "Error al crear la entrada");
//               },
//             });
//           }
//           form.reset();
//           setOpen(false);
//         },
//         onError: (error) => {
//           if (error.message.includes("No autorizado")) {
//             setTimeout(() => {
//               form.reset();
//             }, 1000);
//           }
//         },
//       });
//     });
//   }

//   const handleClose = () => {
//     form.reset();
//     setOpen(false);
//   };

//   //ACtivate only when form errors
//   // useEffect(() => {
//   //   if (form.formState.errors) {
//   //     console.log("Errores en el formulario", form.formState.errors);
//   //   }
//   // }, [form.formState.errors]);

//   const DialogFooterContent = () => (
//     <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
//       <Button 
//         type="submit" 
//         disabled={isCreatePending || createMutation.isPending}
//         className="w-full"
//       >
//         {(isCreatePending || createMutation.isPending) && (
//           <RefreshCcw
//             className="mr-2 size-4 animate-spin"
//             aria-hidden="true"
//           />
//         )}
//         {CREATE_OUTGOING_MESSAGES.submitButton}
//       </Button>
//       <Button
//         type="button"
//         variant="outline"
//         className="w-full"
//         onClick={handleClose}
//       >
//         {CREATE_OUTGOING_MESSAGES.cancel}
//       </Button>
//     </div>
//   );

//   const TriggerButton = () => (
//     <Button 
//       onClick={() => setOpen(true)}
//       variant="outline" 
//       size="sm"
//     >
//       <Plus className="size-4 mr-2" aria-hidden="true" />
//       {CREATE_OUTGOING_MESSAGES.button}
//     </Button>
//   );

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <TriggerButton />
//         </DialogTrigger>
//         <DialogContent key={open ? 'open' : 'closed'} className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{CREATE_OUTGOING_MESSAGES.title}</DialogTitle>
//             <DialogDescription>
//               {CREATE_OUTGOING_MESSAGES.description}
//             </DialogDescription>
//           </DialogHeader>
//           <CreateOutgoingForm form={form} onSubmit={handleSubmit} controlledFieldArray={fieldArray}>
//             <DevelopmentZodError form={form} />
//             <DialogFooter>
//               <DialogFooterContent />
//             </DialogFooter>
//           </CreateOutgoingForm>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <TriggerButton />
//       </DrawerTrigger>
//       <DrawerContent key={open ? 'open' : 'closed'} className="overflow-y-auto">
//         <DrawerHeader>
//           <DrawerTitle>{CREATE_OUTGOING_MESSAGES.title}</DrawerTitle>
//           <DrawerDescription>
//             {CREATE_OUTGOING_MESSAGES.description}
//           </DrawerDescription>
//         </DrawerHeader>
//         <CreateOutgoingForm form={form} onSubmit={handleSubmit} controlledFieldArray={fieldArray}>
//           <DevelopmentZodError form={form} />
//           <DrawerFooter>
//             <DialogFooterContent />
//           </DrawerFooter>
//         </CreateOutgoingForm>
//       </DrawerContent>
//     </Drawer>
//   );
// }

// function DevelopmentZodError({
//   form,
// }: {
//   form: UseFormReturn<CreateOutgoingInput>;
// }) {
//   console.log("Ingresando a DevelopmentZodError", process.env.NEXT_PUBLIC_ENV);
//   if (process.env.NEXT_PUBLIC_ENV !== "development") return null;
//   const [errors, setErrors] = useState<FieldErrors<CreateOutgoingInput>>({});
//   useEffect(() => {
//     if (form.formState.errors) {
//       setErrors(form.formState.errors);
//     }
//   }, [form.formState.errors]);
//   return (
//     <div>
//       <div>
//         {Object.keys(errors).map((key) => (
//           <p key={key}>
//             {key}: {errors[key as keyof CreateOutgoingInput]?.message}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// }
