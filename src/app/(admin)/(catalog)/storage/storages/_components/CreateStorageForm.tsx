"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateStorageInput } from "../_interfaces/storage.interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutoComplete } from "@/components/ui/autocomplete";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { FORMSTATICS as STATIC_FORM } from "../_statics/forms";
import { Option } from "@/types/statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import DataDependencyErrorMessage from "./errorComponents/DataDependencyErrorMessage";
import { METADATA } from "../_statics/metadata";
import { useMemo } from "react";
import { useTypeStorages } from "../../storage-types/_hooks/useStorageTypes";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateStorageInput>;
  onSubmit: (data: CreateStorageInput) => void;
}

export function CreateStorageForm({
  children,
  form,
  onSubmit,
}: CreateProductFormProps) {
  const { activeTypeStoragesQuery: responseStorageTypes } = useTypeStorages();
  const { activeStaffQuery: responseStaff } = useStaff();
  const { activeBranchesQuery: responseBranches } = useBranches();
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  if (
    responseStorageTypes.isLoading &&
    responseBranches.isLoading &&
    responseStaff.isLoading
  ) {
    return <LoadingDialogForm />;
  } else {
    if (responseStorageTypes.isError) {
      return (
        <GeneralErrorMessage
          error={responseStorageTypes.error}
          reset={responseStorageTypes.refetch}
        />
      );
    }
    if (!responseStorageTypes.data) {
      return <LoadingDialogForm />;
    }
    if (responseStaff.isError) {
      return (
        <GeneralErrorMessage
          error={responseStaff.error}
          reset={responseStaff.refetch}
        />
      );
    }
    if (!responseStaff.data) {
      return <LoadingDialogForm />;
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
      return <LoadingDialogForm />;
    }
  }

  if (
    METADATA.dataDependencies &&
    (responseStorageTypes.data.length === 0 ||
      responseStaff.data.length === 0 ||
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

  const storageTypesOptions: Option[] = responseStorageTypes.data.map(
    (typeProduct) => ({
      label: typeProduct.name,
      value: typeProduct.id,
    })
  );

  const staffOptions: Option[] = responseStaff.data.map((staff) => ({
    label: `${staff.name} ${staff.lastName} - ${staff.staffType.name}`,
    value: staff.id,
  }));

  const branchesOptions: Option[] = responseBranches.data.map((branch) => ({
    label: branch.name,
    value: branch.id,
  }));

  // export const createStorageSchema = z.object({
  //   name: z.string().min(1, "El nombre es requerido"),
  //   location: z.string().optional(),
  //   typeStorageId: z.string().uuid(),
  // }) satisfies z.ZodType<CreateStorageDto>;

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
          {/* Campo de tipo de almacén */}
          <FormField
            control={form.control}
            name={FORMSTATICS.typeStorageId.name}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{FORMSTATICS.typeStorageId.label}</FormLabel>
                <FormControl>
                  <AutoComplete
                    options={storageTypesOptions}
                    placeholder={FORMSTATICS.typeStorageId.placeholder}
                    emptyMessage={FORMSTATICS.typeStorageId.emptyMessage!}
                    value={
                      storageTypesOptions.find(
                        (option) => option.value === field.value
                      ) ?? undefined
                    }
                    onValueChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.typeStorageId.required}
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
              <FormItem className="col-span-1">
                <FormLabel htmlFor={FORMSTATICS.branchId.name}>
                  {FORMSTATICS.branchId.label}
                </FormLabel>
                <FormControl>
                  {branchesOptions.length > 0 ? (
                    <AutoComplete
                      options={branchesOptions}
                      placeholder={FORMSTATICS.branchId.placeholder}
                      emptyMessage={FORMSTATICS.branchId.emptyMessage ?? ""}
                      value={
                        branchesOptions.find(
                          (option) => option.value === field.value
                        ) ?? undefined
                      }
                      onValueChange={(option) => {
                        field.onChange(option?.value || "");
                      }}
                    />
                  ) : (
                    <Input
                      disabled={true}
                      placeholder={FORMSTATICS.branchId.placeholder}
                      type={FORMSTATICS.branchId.type}
                    />
                  )}
                </FormControl>
                <CustomFormDescription required={FORMSTATICS.branchId.required}>
                  {branchesOptions.length === 0 && (
                    <span>No hay sucursales disponibles o activas.</span>
                  )}
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
              <FormItem className="col-span-1">
                <FormLabel>{FORMSTATICS.staffId.label}</FormLabel>
                <FormControl>
                  {staffOptions.length > 0 ? (
                    <AutoComplete
                      options={staffOptions}
                      placeholder={FORMSTATICS.staffId.placeholder}
                      emptyMessage={FORMSTATICS.staffId.emptyMessage ?? ""}
                      value={
                        staffOptions.find(
                          (option) => option.value === field.value
                        ) ?? undefined
                      }
                      onValueChange={(option) => {
                        field.onChange(option?.value || "");
                      }}
                    />
                  ) : (
                    <Input
                      disabled={true}
                      placeholder={FORMSTATICS.name.placeholder}
                      type={FORMSTATICS.staffId.type}
                    />
                  )}
                </FormControl>
                <CustomFormDescription required={FORMSTATICS.staffId.required}>
                  {staffOptions.length === 0 && (
                    <span>No hay personal disponible o activo.</span>
                  )}
                </CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={FORMSTATICS.location.name}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{FORMSTATICS.location.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={FORMSTATICS.location.placeholder}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.location.required}
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
