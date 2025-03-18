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
  ProcessPaymentInput,
} from "../../../_interfaces/order.interface";
import { PROCESS_PAYMENT_STATICS } from "../../../_statics/forms";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<ProcessPaymentInput>;
  onSubmit: (data: ProcessPaymentInput) => void;
}

export function ProcessPaymentForm({
  children,
  form,
  onSubmit,
}: CreateProductFormProps) {
  const FORMSTATICS = useMemo(() => PROCESS_PAYMENT_STATICS, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid sm:grid-cols-4 gap-4 place-items-start">
          <div className="sm:col-span-2 w-full p-0">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{FORMSTATICS.paymentMethod.label}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={FORMSTATICS.paymentMethod.placeholder}
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

          <div className="sm:col-span-2 w-full">
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
          </div>

          <FormField
            control={form.control}
            name={FORMSTATICS.amount.name}
            render={({ field }) => (
              <FormItem className="sm:col-span-2 w-full">
                <FormLabel>{FORMSTATICS.amount.label}</FormLabel>
                <FormControl>
                  <div className="flex space-x-2 items-center">
                    <span>
                      {
                        'S/. '
                      }
                    </span>
                    <Input
                      {...field}
                      disabled={true}
                      className="!text-base font-bold"
                      placeholder={FORMSTATICS.amount.placeholder}
                      type={FORMSTATICS.amount.type}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <CustomFormDescription
                  required={FORMSTATICS.amount.required}
                ></CustomFormDescription>
                <FormDescription>No se debe modificar el monto</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={FORMSTATICS.voucherNumber.name}
            render={({ field }) => (
              <FormItem className="sm:col-span-2 w-full">
                <FormLabel>{FORMSTATICS.voucherNumber.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder={FORMSTATICS.voucherNumber.placeholder}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.voucherNumber.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={FORMSTATICS.description.name}
            render={({ field }) => (
              <FormItem className="w-full sm:col-span-4">
                <FormLabel>{FORMSTATICS.description.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={FORMSTATICS.description.placeholder}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.description.required}
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
