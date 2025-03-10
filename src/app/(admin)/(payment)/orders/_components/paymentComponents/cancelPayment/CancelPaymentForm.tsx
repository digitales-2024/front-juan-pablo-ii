"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { useMemo } from "react";
import {
  CancelPaymentInput,
} from "../../../_interfaces/order.interface";
import { CANCEL_PAYMENT_STATICS } from "../../../_statics/forms";
import { Textarea } from "@/components/ui/textarea";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CancelPaymentInput>;
  onSubmit: (data: CancelPaymentInput) => void;
}

export function CancelPaymentForm({
  children,
  form,
  onSubmit,
}: CreateProductFormProps) {
  //   const { activeTypeStoragesQuery: responseStorageTypes } = useTypeStorages();
  //   const { activeStaffQuery: responseStaff } = useStaff();
  //   const { activeBranchesQuery: responseBranches } = useBranches();
  const FORMSTATICS = useMemo(() => CANCEL_PAYMENT_STATICS, []);

  //   if (responseStorageTypes.isLoading && responseBranches.isLoading && responseStaff.isLoading) {
  //     return <LoadingDialogForm />;
  //   } else {
  //     if (responseStorageTypes.isError) {
  //       return (
  //         <GeneralErrorMessage
  //           error={responseStorageTypes.error}
  //           reset={responseStorageTypes.refetch}
  //         />
  //       );
  //     }
  //     if (!responseStorageTypes.data) {
  //       return <LoadingDialogForm />;
  //     }
  //     if (responseStaff.isError) {
  //           return (
  //             <GeneralErrorMessage
  //               error={responseStaff.error}
  //               reset={responseStaff.refetch}
  //             />
  //           );
  //         }
  //         if (!responseStaff.data) {
  //           return <LoadingDialogForm />;
  //         }
  //         if (responseBranches.isError) {
  //           return responseBranches.error ? (
  //             <GeneralErrorMessage
  //               error={responseBranches.error}
  //               reset={responseBranches.refetch}
  //             />
  //           ) : null;
  //         }
  //         if (!responseBranches.data) {
  //           return <LoadingDialogForm />;
  //         }
  //   }

  //   if (
  //     METADATA.dataDependencies &&
  //     (responseStorageTypes.data.length === 0 || responseStaff.data.length === 0 ||
  //       responseBranches.data.length === 0) ){
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

  //   const storageTypesOptions: Option[] = responseStorageTypes.data.map(
  //     (typeProduct) => ({
  //       label: typeProduct.name,
  //       value: typeProduct.id,
  //     })
  //   );

  //   const staffOptions: Option[] = responseStaff.data.map((staff) => ({
  //     label: `${staff.name} ${staff.lastName} - ${staff.staffType.name}`,
  //     value: staff.id,
  //   }));

  //   const branchesOptions: Option[] = responseBranches.data.map(
  //     (branch) => ({
  //       label: branch.name,
  //       value: branch.id,
  //     })
  //   );

  // export const createStorageSchema = z.object({
  //   name: z.string().min(1, "El nombre es requerido"),
  //   location: z.string().optional(),
  //   typeStorageId: z.string().uuid(),
  // }) satisfies z.ZodType<CreateStorageDto>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid sm:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name={FORMSTATICS.cancellationReason.name}
            render={({ field }) => (
              <FormItem >
                <FormLabel>{FORMSTATICS.cancellationReason.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={FORMSTATICS.cancellationReason.placeholder}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.cancellationReason.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {children}
      </form>
    </Form>
  );
}
