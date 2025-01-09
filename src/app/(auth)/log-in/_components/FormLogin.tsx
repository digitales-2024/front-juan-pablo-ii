"use client";

import { Credentials, authSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

import ThemeToggle from "@/components/themeToggle";
import { Input } from "@/components/ui/input";
import { loginAction } from "../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const FormLogin = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: zodResolver(authSchema),
  });

  const mainColor = "rgb(128, 173, 225)";

  async function onSubmit(data: Credentials) {
    const result = await loginAction(data.email, data.password);
    if (result.success && result.redirect) {
      router.push(result.redirect);
    } else {
      setError(result.message || "Error al iniciar sesión");
    }
  }

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
        <form onSubmit={handleSubmit(onSubmit)}>
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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center rounded-md px-4 py-3 text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: mainColor }}
          ></button>
        </form>
      </CardContent>
    </Card>
  );
};
