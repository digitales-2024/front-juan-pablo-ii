"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSignIn } from "@/app/(auth)/sign-in/_hooks/useAuth";
import { toast } from "@/lib/toast/toast-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, Loader2, UserCheck2Icon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FormData = z.infer<typeof formSchema>;

export function UserAuthForm() {
  const { mutate, isPending } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutate(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="grid gap-6 mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <UserCheck2Icon className="h-3.5 w-3.5" /> Usuario
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="nombre@correo.com"
                      type="email"
                      disabled={isPending}
                      className="h-11 pl-10"
                      {...field}
                    />
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5" /> Contraseña
                  </FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      disabled={isPending}
                      className="h-11 pl-10 pr-10"
                      {...field}
                    />
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-center space-x-2 space-y-0">
            <Checkbox
              id="remember-me"
              disabled={isPending}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="remember-me"
              className="text-sm font-normal cursor-pointer"
            >
              Recordar mi sesión
            </label>
          </div>

          <Button
            type="submit"
            className="w-full h-11 mt-6 transition-all relative"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
