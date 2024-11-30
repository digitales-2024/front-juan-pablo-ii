"use client";

import { useProfile } from "@/hooks/use-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

import { cn } from "@/lib/utils";

import { InputPassword } from "../common/forms";

const passwordUpdateSchema = z.object({
    password: z.string(),
    newPassword: z
        .string()
        .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message:
                "La contraseña debe tener al menos 1 minuscula, 1 número, 1 símbolo y 1 número",
        }),
    confirmPassword: z
        .string()
        .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message:
                "La contraseña debe tener al menos 1 minuscula, 1 número, 1 símbolo y 1 número",
        }),
});
type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>;

export function PasswordComponent() {
    const [isDirty, setIsDirty] = useState(false);
    const {
        onUpdatePassword,
        isLoadingUpdatePassword: isLoading,
        refetch,
    } = useProfile();

    const form = useForm<PasswordUpdateSchema>({
        resolver: zodResolver(passwordUpdateSchema),
        defaultValues: {
            password: "",
        },
    });

    const submitForm = (data: PasswordUpdateSchema) => {
        const updateData = {
            password: data.password,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        };
        onUpdatePassword(updateData).then(() => refetch());
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contraseña</CardTitle>
                <CardDescription>
                    Cambia tu contraseña aquí.
                    <br />
                    Una vez tu contraseña se cambie, se cerrará tu sesión.
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña actual</FormLabel>
                                    <FormControl>
                                        <InputPassword
                                            id="password"
                                            placeholder="********"
                                            disabled={isLoading}
                                            onInput={() => setIsDirty(true)}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña nueva</FormLabel>
                                    <FormControl>
                                        <InputPassword
                                            id="newPassword"
                                            placeholder="********"
                                            disabled={isLoading}
                                            onInput={() => setIsDirty(true)}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Confirmar contraseña nueva
                                    </FormLabel>
                                    <FormControl>
                                        <InputPassword
                                            id="confirmPassword"
                                            placeholder="********"
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
                                : "Actualizar contraseña"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
