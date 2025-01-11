'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { loginAction } from '@/app/(auth)/actions';
import { toast } from '@/lib/toast/toast-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El email es requerido' })
    .email('Email inválido'),
  password: z
    .string()
    .min(1, { message: 'La contraseña es requerida' })
    .min(5, 'La contraseña debe tener al menos 5 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

export function UserAuthForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const response = await loginAction({ email: values.email, password: values.password });
      console.log(response);
      
      if (response.success) {
        toast.success('Inicio de sesión exitoso');
        router.push(response.redirect || '/');
      } else {
        toast.error(response.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.log(error);
      
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="nombre@ejemplo.com" 
                    type="email"
                    disabled={isLoading}
                    {...field} 
                  />
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
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </Form>
      
    </div>
  );
}