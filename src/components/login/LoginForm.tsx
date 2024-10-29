"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Credentials } from "@/types";
import logoJuanPablo from "@/assets/icons/logo-juanpablo.png";
import portadaLogin from "@/assets/icons/portada-login.png";
import { useLogin } from "@/hooks/use-login";

type LoginFormProps = {
  onSuccess?: () => void; // Optional callback for successful login
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<Credentials>();
  const { onLogin, isLoading } = useLogin();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<Credentials> = async (data) => {
    await onLogin(data);
    if (onSuccess) onSuccess(); // Invoke the success callback if provided
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sección izquierda con la imagen de portada */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={portadaLogin}
            alt="Portada login"
            fill
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Sección derecha con el formulario */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-gray-100 p-8">
        <Card className="w-full max-w-2xl bg-white shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-6 pb-6">
            <Image
              src={logoJuanPablo}
              alt="Logo Juan Pablo"
              width={200}
              height={200}
              className="w-48"
            />
            <h2 className="text-3xl font-bold text-gray-800">Iniciar sesión</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <Label htmlFor="email" className="text-lg font-medium text-gray-700">
                  Usuario
                </Label>
                <Input
                  id="email"
                  placeholder="Ingrese su usuario"
                  type="email"
                  required
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register("email")}
                />
              </div>
              <div className="space-y-4 mt-6">
                <Label htmlFor="password" className="text-lg font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-4 py-3"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-6 w-6" />
                    ) : (
                      <EyeIcon className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
              <CardFooter className="flex flex-col space-y-6 mt-8 px-0">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 text-lg rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
                <Button
                  type="button"
                  className="w-full bg-green-600 text-white py-3 text-lg rounded-md hover:bg-green-700"
                >
                  Registrarse
                </Button>
                <div className="flex items-center justify-center text-lg mt-6">
                  <Link href="/reset-password" className="text-blue-500 hover:underline">
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}