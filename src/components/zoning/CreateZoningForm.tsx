"use client";

import { CreateZoningSchema } from "@/schemas";
import { Percent } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface CreateZoningFormProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateZoningSchema>;
    onSubmit: (data: CreateZoningSchema) => void;
}

export const CreateZoningForm = ({
    children,
    form,
    onSubmit,
}: CreateZoningFormProps) => {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-1"
            >
                <div className="flex flex-col gap-6 p-4 sm:p-0">
                    <FormField
                        control={form.control}
                        name="zoneCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">
                                    Codigo de la Zonificación
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Ingrese el codigo de la zonificación"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="description">
                                    Descripcion del ambiente
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="description"
                                        placeholder="Ingrese el nombre del ambiente"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="buildableArea"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="buildableArea">
                                    Porcentaje de área construible
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            id="buildableArea"
                                            type="number"
                                            placeholder="Ingrese el porcentaje de área construible"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="pr-10"
                                        />
                                        <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="openArea"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="openArea">
                                    Porcentaje de área libre
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            id="openArea"
                                            type="number"
                                            placeholder="Ingrese el porcentaje de área libre"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="pr-10"
                                        />
                                        <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500" />
                                    </div>
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
