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
import { FORMSTATICS as STATIC_FORM } from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import DataDependencyErrorMessage from "./errorComponents/DataDependencyErrorMessage";
import { METADATA } from "../_statics/metadata";
import { useMemo } from "react";

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

  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  // NO se ingresa a la siguiente alidaciòn porque la dependencia es opcional, pero podemos conservar por si en el futuro las dependencias son obligatorias
  if (
    METADATA.dataDependencies 
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
