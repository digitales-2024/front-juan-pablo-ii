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
  const FORMSTATICS = useMemo(() => CANCEL_PAYMENT_STATICS, []);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid gap-4">
          <FormField
            control={form.control}
            name={FORMSTATICS.cancellationReason.name}
            render={({ field }) => (
              <FormItem>
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
