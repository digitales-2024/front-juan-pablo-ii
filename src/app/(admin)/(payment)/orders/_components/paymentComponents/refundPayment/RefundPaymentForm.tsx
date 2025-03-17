"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { useMemo } from "react";
import {
  paymentMethodConfig,
  paymentMethodOptions,
  RefundPaymentInput,
} from "../../../_interfaces/order.interface";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { REFUND_PAYMENT_STATICS } from "../../../_statics/forms";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<RefundPaymentInput>;
  onSubmit: (data: RefundPaymentInput) => void;
}

export function RefundPaymentForm({
  children,
  form,
  onSubmit,
}: CreateProductFormProps) {
  //   const { activeTypeStoragesQuery: responseStorageTypes } = useTypeStorages();
  //   const { activeStaffQuery: responseStaff } = useStaff();
  //   const { activeBranchesQuery: responseBranches } = useBranches();
  const FORMSTATICS = useMemo(() => REFUND_PAYMENT_STATICS, []);

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
            name={FORMSTATICS.amount.name}
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{FORMSTATICS.amount.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder={FORMSTATICS.amount.placeholder}
                    type={FORMSTATICS.amount.type}
                  />
                </FormControl>
                <FormMessage />
                <CustomFormDescription
                  required={FORMSTATICS.amount.required}
                ></CustomFormDescription>
                <FormDescription>No se debe modificar el monto</FormDescription>
              </FormItem>
            )}
          />
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="refundMethod"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{FORMSTATICS.refundMethod.label}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={FORMSTATICS.refundMethod.placeholder}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethodOptions.map((method) => {
                        const {
                          backgroundColor,
                          hoverBgColor,
                          icon: Icon,
                          textColor,
                        } = paymentMethodConfig[method.value];
                        return (
                          <SelectItem
                            key={method.value}
                            value={method.value}
                            className={cn(
                              backgroundColor,
                              textColor,
                              hoverBgColor,
                              "mb-2"
                            )}
                          >
                            <div className="flex space-x-1 items-center justify-center">
                              <Icon className="size-4" />
                              <span>{method.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <div className="sm:col-span-1">
            <FormField
              control={form.control}
              name={FORMSTATICS.date.name}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between h-full">
                  <FormLabel>{FORMSTATICS.date.placeholder}</FormLabel>
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
                  <CustomFormDescription required={FORMSTATICS.date.required} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

          <FormField
            control={form.control}
            name={FORMSTATICS.reason.name}
            render={({ field }) => (
              <FormItem >
                <FormLabel>{FORMSTATICS.reason.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={FORMSTATICS.reason.placeholder}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.reason.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={FORMSTATICS.notes.name}
            render={({ field }) => (
              <FormItem >
                <FormLabel>{FORMSTATICS.notes.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={FORMSTATICS.notes.placeholder}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.notes.required}
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
