// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useCallback, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetFooter,
//   SheetClose,
// } from "@/components/ui/sheet";
// import {
//   updateOutgoingSchema,
//   UpdateOutgoingInput,
//   DetailedOutgoing,
// } from "../_interfaces/outgoing.interface";
// import { AlertCircle, CalendarIcon, PencilIcon, RefreshCcw } from "lucide-react";
// import { useOutgoing } from "../_hooks/useOutgoing";
// import { AutoComplete } from "@/components/ui/autocomplete";
// import { useTypeProducts } from "@/app/(admin)/(catalog)/product/product-types/_hooks/useType";
// import LoadingDialogForm from "./LoadingDialogForm";
// import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
// import { Textarea } from "@/components/ui/textarea";
// import { Option } from "@/types/statics/forms";
// import { UPDATEFORMSTATICS as FORMSTATICS } from "../_statics/forms";
// import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
// import { METADATA } from "../_statics/metadata";
// import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Calendar } from "@/components/ui/calendar";
// import { toast } from "sonner";
// import { Alert } from "@/components/ui/alert";
// import { useSelectedProducts, useSelectProductDispatch } from "../_hooks/useSelectProducts";

// interface UpdateOutgoingSheetProps {
//   outgoing: DetailedOutgoing;
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   showTrigger?: boolean;
// }

// export function UpdateOutgoingSheet({
//   outgoing,
//   open: controlledOpen,
//   onOpenChange,
//   showTrigger = true,
// }: UpdateOutgoingSheetProps) {
//   const [uncontrolledOpen, setUncontrolledOpen] = useState(false); 
//   const [showForm, setShowForm] = useState(false);
//   const { updateMutation } = useOutgoing();
//   const { activeStoragesQuery: responseStorages } = useStorages();
//   const selectedProducts = useSelectedProducts();
//   const dispatch = useSelectProductDispatch();

//   const STATEPROP_OPTIONS = useMemo(() => {
//     return [
//       {
//         label: "En Proceso",
//         value: false,
//       },
//       {
//         label: "Concretado", 
//         value: true,
//       },
//     ];
//   }, []);

//   // Use controlled state if props are provided, otherwise use internal state
//   const isOpen = controlledOpen ?? uncontrolledOpen;
//   const setOpen = onOpenChange ?? setUncontrolledOpen;

//   const bulletClassnames = "font-semibold";
//   const paragraphClassnames = "inline";

//   const ALERT_MESSAGES = useMemo(() => ({
//     title: "¡Riesgo de Corrupción de Integridad de Stock!", 
//     bullets: [
//       <span className={cn(paragraphClassnames)}>
//         Le desaconsejamos <span>encarecidamente</span> alterar los datos de la{" "}
//         {METADATA.entityName.toLowerCase()} directamente.
//       </span>,
//       <span className={cn(paragraphClassnames)}>
//         Si <span className={cn(bulletClassnames)}>elimina</span>,{" "}
//         <span className={cn(bulletClassnames)}>agrega</span> o{" "}
//         <span className={cn(bulletClassnames)}>cambia</span> la lista de
//         movimientos/productos o cambia la cantidad, se generararán{" "}
//         <span className={cn(bulletClassnames)}>negativos</span> y{" "}
//         <span className={cn(bulletClassnames)}>excedentes</span> en el stock.
//       </span>,
//       <span className={cn(paragraphClassnames)}>
//         Si desea alterar cualquier dato de la{" "}
//         {METADATA.entityName.toLowerCase()}, se recomienda realizar una{" "}
//         <span className={cn(bulletClassnames)}>entrada</span> quitando los
//         movimientos y luego crear una{" "}
//         <span className={cn(bulletClassnames)}>salida</span> con los datos
//         correctos.
//       </span>,
//     ],
//   }), []);

//   const form = useForm<UpdateOutgoingInput>({
//     resolver: zodResolver(updateOutgoingSchema),
//     defaultValues: {
//       name: outgoing.name ?? FORMSTATICS.name.defaultValue,
//       storageId: outgoing.storageId ?? FORMSTATICS.storageId.defaultValue,
//       date: outgoing.date ?? FORMSTATICS.date.defaultValue,
//       state: outgoing.state ?? FORMSTATICS.state.defaultValue,
//       description: outgoing.description ?? FORMSTATICS.description.defaultValue,
//       referenceId: outgoing.referenceId ?? FORMSTATICS.referenceId.defaultValue,
//       movement: [],
//     },
//   });

//   const {
//     control,
//     register,
//     watch,
//   } = form;

//   const handleClearProductList = useCallback(() => {
//     dispatch({
//       type: "clear",
//     });
//     remove();
//   }, [dispatch, remove]);

//   useEffect(() => {
//     if (!open) {
//       handleClearProductList();
//     }
//   }, [open, handleClearProductList]);

//   const onSubmit = async (data: UpdateOutgoingInput) => {
//     if (updateMutation.isPending) return;

//     try {
//       await updateMutation.mutateAsync(
//         {
//           id: outgoing.id,
//           data,
//         },
//         {
//           onSuccess: () => {
//             handleClearProductList();
//             form.reset();
//             setOpen(false);
//           },
//           onError: (error) => {
//             toast.error(
//               `Error al actualizar ${METADATA.entityName.toLowerCase()}:` +
//                 error.message
//             );
//             if (error.message.includes("No autorizado")) {
//               setTimeout(() => {
//                 form.reset();
//               }, 1000);
//             }
//           },
//         }
//       );
//     } catch (error) {
//       toast.error("Error in onSubmit" + (error as Error).message);
//     }
//   };

//   const handleOnOpenChange = (open:boolean) => {
//     handleClearProductList();
//     setOpen(open);
//   };

//   // Rest of the component remains similar but with updated UI to show warning and confirmation steps

//   return (
//     <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
//       {/* Sheet content similar to incoming but adapted for outgoing */}
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>
//             Actualizar {METADATA.entityName.toLowerCase()}
//           </SheetTitle>
//           <Alert className="bg-yellow-100/70 text-yellow-600 border-none !mb-2">
//             <div className="flex space-x-2 items-center mb-2 justify-center sm:justify-start">
//               <AlertCircle className="h-4 w-4" />
//               <div className="font-semibold !mb-0">
//                 {ALERT_MESSAGES.title}
//               </div>
//             </div>
//             <div className="w-full px-5">
//               <ul className="space-y-1 list-disc text-start"></ul>
//                 {ALERT_MESSAGES.bullets.map((bullet, idx) => (
//                   <li key={idx}>{bullet}</li>
//                 ))}
//               </ul>
//             </div>
//           </Alert>
//         </SheetHeader>

//         {/* Form content similar but with showForm state control */}
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             {/* Form fields */}
//           </form>
//         </Form>

//         {/* Footer with new button layout */}
//         <SheetFooter>
//           <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end flex-wrap">
//             <SheetClose asChild></SheetClose>
//               <Button variant="default">
//                 Conservar stock y salir
//               </Button>
//             </SheetClose>
//             {!showForm && (
//               <Button
//                 variant="outline"
//                 className="text-destructive hover:text-white hover:bg-destructive border border-destructive"
//                 onClick={() => setShowForm(true)}
//               >
//                 Continuar
//               </Button>
//             )}
//             {showForm && (
//               <Button
//                 type="submit"
//                 variant="outline"
//                 className="text-destructive hover:text-white hover:bg-destructive border border-destructive"
//                 disabled={updateMutation.isPending}
//               >
//                 {updateMutation.isPending ? (
//                   <>
//                     <RefreshCcw className="mr-2 size-4 animate-spin" />
//                     Actualizando...
//                   </>
//                 ) : (
//                   "Actualizar de todos modos"
//                 )}
//               </Button>
//             )}
//           </div>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// }
