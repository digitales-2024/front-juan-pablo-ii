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
  RejectPaymentInput,
} from "../../../_interfaces/order.interface";
import { Textarea } from "@/components/ui/textarea";
import { REJECT_PAYMENT_STATICS } from "../../../_statics/forms";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<RejectPaymentInput>;
  onSubmit: (data: RejectPaymentInput) => void;
}

export function RejectPaymentForm({
  children,
  form,
  onSubmit,
}: CreateProductFormProps) {
  const FORMSTATICS = useMemo(() => REJECT_PAYMENT_STATICS, []);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid gap-4">
          <FormField
            control={form.control}
            name={FORMSTATICS.rejectionReason.name}
            render={({ field }) => (
              <FormItem >
                <FormLabel>{FORMSTATICS.rejectionReason.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={FORMSTATICS.rejectionReason.placeholder}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.rejectionReason.required}
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
