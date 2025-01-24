'use client';

import { useAuth } from '@/app/(auth)/sign-in/_hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '../_hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { isValidPhoneNumber } from 'react-phone-number-input';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().refine(isValidPhoneNumber, {
    message: 'El número de teléfono no es válido.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountData() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [formActive, setFormActive] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
      });
    }
  }, [profile]);

  // Watch form fields for changes
  const watchFields = {
    name: form.watch('name'),
    phone: form.watch('phone'),
  };

  // Detect if form has been modified
  useEffect(() => {
    if (!profile) return;

    const isFormModified =
      profile.name !== watchFields.name || profile.phone !== watchFields.phone;

    setFormActive(isFormModified);
  }, [watchFields, profile]);

  const onSubmit = async (data: FormValues) => {
    if (!user?.id) return;

    await updateProfile({
      name: data.name,
      phone: data.phone, // Remove country code before saving
    });

    setFormActive(false);
  };

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Datos de la cuenta</CardTitle>
          <CardDescription>No hay información disponible</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de la cuenta</CardTitle>
        <CardDescription>Información detallada de tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese su nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="PE"
                        placeholder="Ingrese su teléfono"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Correo electrónico
                </label>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Rol</label>
                <Badge variant="outline" className="w-fit">
                  {profile.roles[0]?.name || 'No role'}
                </Badge>
              </div>

              <Button type="submit" disabled={!formActive} className="w-fit">
                Actualizar datos
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
