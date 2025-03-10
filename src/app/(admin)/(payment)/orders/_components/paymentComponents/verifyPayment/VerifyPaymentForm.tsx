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
  VerifyPaymentInput,
} from "../../../_interfaces/order.interface";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { VERIFY_PAYMENT_STATICS } from "../../../_statics/forms";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<VerifyPaymentInput>;
  onSubmit: (data: VerifyPaymentInput) => void;
}

export function VerifyPaymentForm({
  children,
  form,
  onSubmit,
}: CreateProductFormProps) {
  //   const { activeTypeStoragesQuery: responseStorageTypes } = useTypeStorages();
  //   const { activeStaffQuery: responseStaff } = useStaff();
  //   const { activeBranchesQuery: responseBranches } = useBranches();
  const FORMSTATICS = useMemo(() => VERIFY_PAYMENT_STATICS, []);

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

          <div className="sm:col-span-1">
            <FormField
              control={form.control}
              name={FORMSTATICS.verifiedAt.name}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between h-full">
                  <FormLabel>{FORMSTATICS.verifiedAt.placeholder}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            // Verifica si es string
                            typeof field.value === "string" ? (
                              format(new Date(field.value), "PPP", {
                                locale: es,
                              })
                            ) : null
                          ) : (
                            <span>Escoja una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          typeof field.value === "string"
                            ? new Date(field.value)
                            : undefined
                        }
                        onSelect={(val) =>
                          field.onChange(val?.toISOString() ?? "")
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <CustomFormDescription required={FORMSTATICS.verifiedAt.required} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={FORMSTATICS.verificationNotes.name}
            render={({ field }) => (
              <FormItem >
                <FormLabel>{FORMSTATICS.verificationNotes.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={FORMSTATICS.verificationNotes.placeholder}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.verificationNotes.required}
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
