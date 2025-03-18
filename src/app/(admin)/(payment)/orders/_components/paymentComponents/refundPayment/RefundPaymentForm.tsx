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
  const FORMSTATICS = useMemo(() => REFUND_PAYMENT_STATICS, []);

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

          <FormField
            control={form.control}
            name={FORMSTATICS.reason.name}
            render={({ field }) => (
              <FormItem  className="sm:col-span-4">
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
              <FormItem className="sm:col-span-4">
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
