"use client";

import { useProfile } from "@/hooks/use-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

const accountUpdateSchema = z.object({
    name: z.string().min(1, {
        message: "Ingrese su nuevo nombre",
    }),
    telephone: z.string().min(6),
});
type AccountUpdateSchema = z.infer<typeof accountUpdateSchema>;

export function AccountComponent() {
    const { user, onUpdate, isLoading, isSuccess, refetch } = useProfile();
    const [isDirty, setIsDirty] = useState(false);

    const form = useForm<AccountUpdateSchema>({
        resolver: zodResolver(accountUpdateSchema),
        defaultValues: {
            name: user?.email ?? "",
            telephone: user?.phone ?? "",
        },
    });

    // When the user profile loads, prepopulate the form data.
    useEffect(() => {
        if (user !== undefined) {
            form.setValue("name", user?.name ?? "");
            form.setValue("telephone", user?.phone ?? "");
        }
    }, [form, user, isSuccess]);

    const submitForm = (data: AccountUpdateSchema) => {
        const updateData = {
            id: user?.id ?? "",
            roles: user?.roles.map((role) => role.id) ?? [],
            name: data.name ?? "",
            phone: data?.telephone ?? "",
        };
        onUpdate(updateData).then(() => {
            setIsDirty(false);
            refetch();
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cuenta</CardTitle>
                <CardDescription>
                    Cambia los detalles de tu cuenta aquí.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Form {...form}>
                    <form
                        className={cn(
                            "space-y-4",
                            isLoading && "animate-pulse",
                        )}
                        onSubmit={form.handleSubmit(submitForm)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Cargando..."
                                            disabled={isLoading}
                                            {...field}
                                            onInput={() => setIsDirty(true)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de teléfono</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Cargando..."
                                            disabled={isLoading}
                                            onInput={() => setIsDirty(true)}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isLoading || !isDirty} type="submit">
                            {isLoading
                                ? "Actualizando..."
                                : "Actualizar información"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
