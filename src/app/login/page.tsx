"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/use-login"; // Asegúrate de que la ruta sea correcta
import { Credentials } from "@/types";

export default function Component() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<Credentials>();
  const { onLogin, isLoading, error } = useLogin();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<Credentials> = (data) => {
    onLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-md bg-black bg-opacity-50 text-white shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
            {/* Reemplaza esto con tu logo o imagen */}
            <span className="text-4xl font-bold text-gray-300">Logo</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-100">Iniciar sesión</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Correo electrónico
              </Label>
              <Input
                id="email"
                placeholder="tu@ejemplo.com"
                type="email"
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                {...register("email")}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-200"
                  onClick={togglePasswordVisibility}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="submit"
                className="w-3/4 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <div className="flex items-center justify-between w-full text-sm mt-4">
                <Link
                  href="/register"
                  className="text-blue-500 hover:underline"
                >
                  Regístrate
                </Link>
                <Link
                  href="/register"
                  className="text-blue-500 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
