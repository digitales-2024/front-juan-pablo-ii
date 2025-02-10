"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateTypeStorageInput } from "../_interfaces/storageTypes.interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AutoComplete } from "@/components/ui/autocomplete";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { FORMSTATICS as STATIC_FORM } from "../_statics/forms";
import { Option } from "@/types/statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import DataDependencyErrorMessage from "./errorComponents/DataDependencyErrorMessage";
import { METADATA } from "../_statics/metadata";
import { useMemo } from "react";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";

interface CreateTypeStorageFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateTypeStorageInput>;
  onSubmit: (data: CreateTypeStorageInput) => void;
}

export function CreateTypeStorageForm({
  children,
  form,
  onSubmit,
}: CreateTypeStorageFormProps) {

  const { activeStaffQuery: responseStaff } = useStaff();
  const { activeBranchesQuery: responseBranches } = useBranches();
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  if (responseStaff.isLoading && responseBranches.isLoading) {
    return <LoadingDialogForm />;
  } else {
    if (responseStaff.isError) {
      return (
        <GeneralErrorMessage
          error={responseStaff.error}
          reset={responseStaff.refetch}
        />
      );
    }
    if (!responseStaff.data) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontró personal asociado")}
          reset={responseStaff.refetch}
        />
      );
    }
    if (responseBranches.isError) {
      return responseBranches.error ? (
        <GeneralErrorMessage
          error={responseBranches.error}
          reset={responseBranches.refetch}
        />
      ) : null;
    }
    if (!responseBranches.data) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron sucursales")}
          reset={responseBranches.refetch}
        />
      );
    }
  }

  // NO se ingresa a la siguiente alidaciòn porque la dependencia es opcional, pero podemos conservar por si en el futuro las dependencias son obligatorias
  if (
    METADATA.dataDependencies &&
    (responseStaff.data.length === 0 ||
      responseBranches.data.length === 0)
  ) {
    return (
      <DataDependencyErrorMessage
        error={
          new Error(
            `No existe la información necesaria. Revisar presencia de información en: ${METADATA.dataDependencies
              .map((dependency) => dependency.dependencyName)
              .join(", ")}`
          )
        }
        dataDependencies={METADATA.dataDependencies}
      />
    );
  }

  const staffOptions: Option[] = responseStaff.data.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const branchesOptions: Option[] = responseBranches.data.map(
    (typeProduct) => ({
      label: typeProduct.name,
      value: typeProduct.id,
    })
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={FORMSTATICS.name.name}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{FORMSTATICS.name.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={FORMSTATICS.name.placeholder}
                    type={FORMSTATICS.name.type}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.name.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo de Sucursal */}
          <FormField
              control={form.control}
              name={FORMSTATICS.branchId.name}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor={FORMSTATICS.branchId.name}>{FORMSTATICS.branchId.label}</FormLabel>
                  <FormControl>
                    {
                      branchesOptions.length>0 ? <AutoComplete
                      options={branchesOptions}
                      placeholder={FORMSTATICS.branchId.placeholder}
                      emptyMessage={FORMSTATICS.branchId.emptyMessage!}
                      value={
                        branchesOptions.find(
                          (option) => option.value === field.value
                        ) ?? undefined
                      }
                      onValueChange={(option) => {
                        field.onChange(option?.value || "");
                      }}
                    /> : (
                      <Input
                        disabled={true}
                        placeholder={FORMSTATICS.branchId.placeholder}
                        type={FORMSTATICS.branchId.type}
                      />
                    )
                    }
                  </FormControl>
                  <CustomFormDescription required={FORMSTATICS.branchId.required}>
                    { branchesOptions.length===0 && <span>No hay sucursales disponibles o activas. Este campo es opcional</span>}
                  </CustomFormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo de personal */}
            <FormField
              control={form.control}
              name={FORMSTATICS.staffId.name}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {FORMSTATICS.staffId.label}
                  </FormLabel>
                  <FormControl>
                    {
                      staffOptions.length>0 ? <AutoComplete
                      options={staffOptions}
                      placeholder={FORMSTATICS.staffId.placeholder}
                      emptyMessage={FORMSTATICS.staffId.emptyMessage!}
                      value={
                        staffOptions.find(
                          (option) => option.value === field.value
                        ) ?? undefined
                      }
                      onValueChange={(option) => {
                        field.onChange(option?.value || "");
                      }}
                    /> : (
                      <Input
                        disabled={true}
                        placeholder={FORMSTATICS.name.placeholder}
                        type={FORMSTATICS.staffId.type}
                      />
                    )
                    }
                  </FormControl>
                  <CustomFormDescription required={FORMSTATICS.staffId.required}>
                    { staffOptions.length===0 && <span>No hay personal disponible o activo. Este campo es opcional</span>}
                  </CustomFormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={FORMSTATICS.description.name}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{FORMSTATICS.description.label}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={FORMSTATICS.description.placeholder}
                    />
                  </FormControl>
                  <FormMessage />
                  <CustomFormDescription required={FORMSTATICS.description.required}></CustomFormDescription>
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
