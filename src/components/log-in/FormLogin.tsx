"use client";

import { useLogin } from "@/hooks/use-login";
import { authSchema } from "@/schemas";
import { Credentials } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

import ThemeToggle from "../ThemeTogle";
import { Input } from "../ui/input";

export const FormLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Credentials>({
        resolver: zodResolver(authSchema),
    });

    const { onLogin, isLoading } = useLogin();

    const mainColor = "rgb(128, 173, 225)";

    return (
        <Card className={cn("w-[32rem] bg-background p-10 shadow-lg")}>
            <CardHeader className="text-center">
                <ThemeToggle />
                <CardTitle className="text-3xl font-semibold">
                    Sistema Clinico
                </CardTitle>
                <CardDescription className="text-lg text-gray-500">
                    Bienvenido! Por favor, inicie sesión con su cuenta.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onLogin)}>
                    {/* Campo de Email */}
                    <div className="space-y-3">
                        <label
                            htmlFor="email"
                            className="block text-lg font-medium"
                            style={{ color: mainColor }}
                        >
                            Nombre Usuario
                        </label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="usuario@correo.com"
                            className="w-full rounded-md border px-4 py-3 focus:outline-none"
                            style={{
                                borderColor: mainColor,
                                color: mainColor,
                            }}
                            autoComplete="email"
                            {...register("email")}
                        />
                        {errors.email?.message && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Campo de Contraseña */}
                    <div className="space-y-3">
                        <label
                            htmlFor="password"
                            className="block text-lg font-medium"
                            style={{ color: mainColor }}
                        >
                            Contraseña
                        </label>

                        <Input
                            type="password"
                            id="password"
                            placeholder="********"
                            className="w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-1"
                            style={{
                                borderColor: mainColor,
                                color: mainColor,
                            }}
                            autoComplete="current-password"
                            {...register("password")}
                        />
                        {errors.password?.message && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        className="mt-6 flex w-full items-center justify-center rounded-md px-4 py-3 text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ backgroundColor: mainColor }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Autenticando...</span>
                            </>
                        ) : (
                            "Ingresar"
                        )}
                    </button>
                </form>
            </CardContent>
        </Card>
    );
};
