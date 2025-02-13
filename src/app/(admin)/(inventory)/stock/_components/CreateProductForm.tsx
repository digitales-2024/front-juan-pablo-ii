// "use client";

// import { UseFormReturn } from "react-hook-form";
// import { CreateProductInput } from "../_interfaces/stock.interface";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { AutoComplete } from "@/components/ui/autocomplete";
// import LoadingDialogForm from "./LoadingDialogForm";
// import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
// import { useCategories } from "@/app/(admin)/(catalog)/product/category/_hooks/useCategory";
// import { useTypeProducts } from "@/app/(admin)/(catalog)/product/product-types/_hooks/useType";
// import { FORMSTATICS as STATIC_FORM } from "../_statics/forms";
// import { Option } from "@/types/statics/forms";
// import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
// import DataDependencyErrorMessage from "./errorComponents/DataDependencyErrorMessage";
// import { METADATA } from "../_statics/metadata";
// import { useMemo } from "react";

// interface CreateProductFormProps
//   extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
//   children: React.ReactNode;
//   form: UseFormReturn<CreateProductInput>;
//   onSubmit: (data: CreateProductInput) => void;
// }

// // export const createProductSchema = z.object({
// //   categoriaId: z.string().min(1, "La categoría es requerida"),
// //   tipoProductoId: z.string().min(1, "El tipo de producto es requerido"),
// //   name: z.string().min(1, "El nombre es requerido"),
// //   precio: z.number().min(0, "El precio no puede ser negativo"),
// //   unidadMedida: z.string().optional(),
// //   proveedor: z.string().optional(),
// //   uso: z.string().optional(),
// //   usoProducto: z.string().optional(),
// //   description: z.string().optional(),
// //   codigoProducto: z.string().optional(),
// //   descuento: z.number().optional(),
// //   observaciones: z.string().optional(),
// //   condicionesAlmacenamiento: z.string().optional(),
// //   imagenUrl: z.string().optional(),
// // }) satisfies z.ZodType<CreateProductDto>;

// export function CreateProductForm({
//   children,
//   form,
//   onSubmit,
// }: CreateProductFormProps) {
//   // const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
//   // const [typeProductOptions, setTypeProductOptions] = useState<Option[]>([]);

//   const { activeCategoriesQuery: responseCategories } = useCategories();
//   const responseTypeProducts = useTypeProducts();
//   const FORMSTATICS = useMemo(() => STATIC_FORM, []);

//   if (responseCategories.isLoading && responseTypeProducts.activeIsLoading) {
//     return <LoadingDialogForm />;
//   } else {
//     if (responseCategories.isError) {
//       return (
//         <GeneralErrorMessage
//           error={responseCategories.error}
//           reset={responseCategories.refetch}
//         />
//       );
//     }
//     if (!responseCategories.data) {
//       return (
//         <GeneralErrorMessage
//           error={new Error("No se encontraron categorías")}
//           reset={responseCategories.refetch}
//         />
//       );
//     }
//     if (responseTypeProducts.activeIsError) {
//       return responseTypeProducts.activeError ? (
//         <GeneralErrorMessage
//           error={responseTypeProducts.activeError}
//           reset={responseTypeProducts.activeRefetch}
//         />
//       ) : null;
//     }
//     if (!responseTypeProducts.activeData) {
//       return (
//         <GeneralErrorMessage
//           error={new Error("No se encontraron subcategorías")}
//           reset={responseTypeProducts.activeRefetch}
//         />
//       );
//     }
//   }

//   if (
//     METADATA.dataDependencies &&
//     (responseCategories.data.length === 0 ||
//       responseTypeProducts.activeData.length === 0)
//   ) {
//     return (
//       <DataDependencyErrorMessage
//         error={
//           new Error(
//             `No existe la información necesaria. Revisar presencia de información en: ${METADATA.dataDependencies
//               .map((dependency) => dependency.dependencyName)
//               .join(", ")}`
//           )
//         }
//         dataDependencies={METADATA.dataDependencies}
//       />
//     );
//   }

//   const categoryOptions: Option[] = responseCategories.data.map((category) => ({
//     label: category.name,
//     value: category.id,
//   }));

//   const typeProductOptions: Option[] = responseTypeProducts.activeData.map(
//     (typeProduct) => ({
//       label: typeProduct.name,
//       value: typeProduct.id,
//     })
//   );

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
//           {/* <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormLabel>Nombre</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Ingresa el nombre" {...field}/>
//                   </FormControl>
//                   <CustomFormDescription required={FORMSTATICS.name.required}></CustomFormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             /> */}
//           <FormField
//             control={form.control}
//             name={FORMSTATICS.name.name}
//             render={({ field }) => (
//               <FormItem className="col-span-2">
//                 <FormLabel>{FORMSTATICS.name.label}</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder={FORMSTATICS.name.placeholder}
//                     type={FORMSTATICS.name.type}
//                   />
//                 </FormControl>
//                 <CustomFormDescription
//                   required={FORMSTATICS.name.required}
//                 ></CustomFormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name={FORMSTATICS.codigoProducto.name}
//             render={({ field }) => (
//               <FormItem className="col-span-2">
//                 <FormLabel>{FORMSTATICS.codigoProducto.label}</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder={FORMSTATICS.codigoProducto.placeholder}
//                   />
//                 </FormControl>
//                 <CustomFormDescription
//                   required={FORMSTATICS.codigoProducto.required}
//                 ></CustomFormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="precio"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{FORMSTATICS.precio.label}</FormLabel>
//                 <div className="flex items-center space-x-2">
//                   <div className="text-muted-foreground">S/.</div>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder={FORMSTATICS.precio.placeholder}
//                       type={FORMSTATICS.precio.type}
//                     />
//                   </FormControl>
//                 </div>
//                 <CustomFormDescription
//                   required={FORMSTATICS.precio.required}
//                 ></CustomFormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name={FORMSTATICS.descuento.name}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{FORMSTATICS.descuento.label}</FormLabel>
//                 <div className="flex items-center space-x-2">
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder={FORMSTATICS.descuento.placeholder}
//                       type={FORMSTATICS.descuento.type}
//                     />
//                   </FormControl>
//                   <div className="text-muted-foreground">%</div>
//                 </div>
//                 <FormMessage />
//                 <CustomFormDescription
//                   required={FORMSTATICS.descuento.required}
//                 ></CustomFormDescription>
//               </FormItem>
//             )}
//           />
//           {/* Campo de categoría */}
//           <FormField
//               control={form.control}
//               name={FORMSTATICS.categoriaId.name}
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormLabel htmlFor={FORMSTATICS.categoriaId.name}>{FORMSTATICS.categoriaId.label}</FormLabel>
//                   <FormControl>
//                     <AutoComplete
//                       options={categoryOptions}
//                       placeholder={FORMSTATICS.categoriaId.placeholder}
//                       emptyMessage={FORMSTATICS.categoriaId.emptyMessage!}
//                       value={
//                         categoryOptions.find(
//                           (option) => option.value === field.value
//                         ) ?? undefined
//                       }
//                       onValueChange={(option) => {
//                         field.onChange(option?.value || "");
//                       }}
//                     />
//                   </FormControl>
//                   <CustomFormDescription required={FORMSTATICS.categoriaId.required}></CustomFormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Campo de tipo de producto */}
//             <FormField
//               control={form.control}
//               name={FORMSTATICS.tipoProductoId.name}
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormLabel>
//                     {FORMSTATICS.tipoProductoId.label}
//                   </FormLabel>
//                   <FormControl>
//                     <AutoComplete
//                       options={typeProductOptions}
//                       placeholder={FORMSTATICS.tipoProductoId.placeholder}
//                       emptyMessage={FORMSTATICS.tipoProductoId.emptyMessage!}
//                       value={
//                         typeProductOptions.find(
//                           (option) => option.value === field.value
//                         ) ?? undefined
//                       }
//                       onValueChange={(option) => {
//                         field.onChange(option?.value || "");
//                       }}
//                     />
//                   </FormControl>
//                   <CustomFormDescription required={FORMSTATICS.tipoProductoId.required}></CustomFormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name={FORMSTATICS.unidadMedida.name}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{FORMSTATICS.unidadMedida.label}</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder={FORMSTATICS.unidadMedida.placeholder}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                   <CustomFormDescription required={FORMSTATICS.unidadMedida.required}></CustomFormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name={FORMSTATICS.proveedor.name}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{FORMSTATICS.proveedor.label}</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder={FORMSTATICS.proveedor.placeholder}/>
//                   </FormControl>
//                   <FormMessage />
//                   <CustomFormDescription required={FORMSTATICS.proveedor.required}></CustomFormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name={FORMSTATICS.usoProducto.name}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{FORMSTATICS.usoProducto.label}</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder={FORMSTATICS.usoProducto.placeholder} />
//                   </FormControl>
//                   <CustomFormDescription required={FORMSTATICS.usoProducto.required}></CustomFormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name={FORMSTATICS.description.name}
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormLabel>{FORMSTATICS.description.label}</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       {...field}
//                       placeholder={FORMSTATICS.description.placeholder}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                   <CustomFormDescription required={FORMSTATICS.description.required}></CustomFormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name={FORMSTATICS.observaciones.name}
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormLabel>{FORMSTATICS.observaciones.label}</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       {...field}
//                       placeholder={FORMSTATICS.observaciones.placeholder}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                   <CustomFormDescription required={FORMSTATICS.observaciones.required}></CustomFormDescription>
//                   <FormMessage />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name={FORMSTATICS.condicionesAlmacenamiento.name}
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormLabel>{FORMSTATICS.condicionesAlmacenamiento.label}</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       {...field}
//                       placeholder={FORMSTATICS.condicionesAlmacenamiento.placeholder}
//                     />
//                   </FormControl>
//                   <CustomFormDescription required={FORMSTATICS.condicionesAlmacenamiento.required}></CustomFormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//         </div>
//         {children}
//       </form>
//     </Form>
//   );
// }
