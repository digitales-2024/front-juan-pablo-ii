"use client";
import { CreateSpacesSchema } from "@/schemas/spaces/createSpacesSchema";
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

interface CreateSpacesFormProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateSpacesSchema>;
    onSubmit: (data: CreateSpacesSchema) => void;
}

export const CreateSpacesForm = ({
    children,
    form,
    onSubmit,
}: CreateSpacesFormProps) => {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-1"
            >
                <div className="flex flex-col gap-6 p-4 sm:p-0">
                    {/* Campo de Nombre */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">
                                    Nombre del Ambiente
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
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
                </div>
                {children}
            </form>
        </Form>
    );
};
