"use client";

import { CreateObservationSchema } from "@/schemas";
import { parse, format } from "date-fns";
import { UseFormReturn } from "react-hook-form";

import DatePicker from "../ui/date-time-picker";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface CreateObservationsFormProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateObservationSchema>;
    onSubmit: (data: CreateObservationSchema) => void;
}

export const CreateObservationsForm = ({
    children,
    form,
    onSubmit,
}: CreateObservationsFormProps) => {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-1"
            >
                <div className="flex flex-col gap-6 p-4 sm:p-0">
                    {/* Campo de Fecha de Reunión */}
                    <FormField
                        control={form.control}
                        name="meetingDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="meetingDate">
                                    Fecha de Reunión
                                </FormLabel>
                                <FormControl>
                                    <DatePicker
                                        value={
                                            field.value
                                                ? parse(
                                                      field.value,
                                                      "yyyy-MM-dd",
                                                      new Date(),
                                                  )
                                                : undefined
                                        }
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = format(
                                                    date,
                                                    "yyyy-MM-dd",
                                                );
                                                field.onChange(formattedDate);
                                            } else {
                                                field.onChange("");
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Campo de Observación */}
                    <FormField
                        control={form.control}
                        name="observation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="observation">
                                    Observación
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="observation"
                                        placeholder="Ingrese la observación"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {children}
            </form>
        </Form>
    );
};
