'use client';

import { UseFormReturn } from 'react-hook-form';
import { CreateStaffTypeDto } from '../_interfaces/staff-type.interface';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface CreateStaffTypeFormProps
  extends Omit<React.ComponentPropsWithRef<'form'>, 'onSubmit'> {
  children: React.ReactNode;
  form: UseFormReturn<CreateStaffTypeDto>;
  onSubmit: (data: CreateStaffTypeDto) => void;
  disabled?: boolean;
}

export function CreateStaffTypeForm({
  children,
  form,
  onSubmit,
  disabled = false,
}: CreateStaffTypeFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-6 p-4 sm:p-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Médico"
                    {...field}
                    disabled={disabled || form.formState.isSubmitting}
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
                <FormLabel>Descripción (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descripción del tipo de personal"
                    {...field}
                    disabled={disabled || form.formState.isSubmitting}
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
} 