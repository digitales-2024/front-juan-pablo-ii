'use client';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateServiceTypeDto,
  createServiceTypeSchema,
} from '../_interfaces/service-type.interface';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Plus, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateServiceTypeForm } from './CreateServiceTypeForm';
import { useServiceTypes } from '../_hooks/useServiceTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const CREATE_SERVICE_TYPE_MESSAGES = {
  button: 'Crear tipo de servicio',
  title: 'Registrar nuevo tipo de servicio',
  description: 'Rellena los campos para crear un nuevo tipo de servicio',
  success: 'Tipo de servicio creado exitosamente',
  submitButton: 'Crear tipo de servicio',
  cancel: 'Cancelar',
} as const;

export function CreateServiceTypeDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const { createMutation } = useServiceTypes();

  const form = useForm<CreateServiceTypeDto>({
    resolver: zodResolver(createServiceTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const isSubmitting = createMutation.isPending || isCreatePending;

  function handleSubmit(input: CreateServiceTypeDto) {
    if (isSubmitting) return;

    startCreateTransition(() => {
      createMutation.mutate(input, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error('Error al crear tipo de servicio:', error);
        },
      });
    });
  }

  const handleClose = () => {
    if (isSubmitting) return;
    form.reset();
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && (
          <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        {CREATE_SERVICE_TYPE_MESSAGES.submitButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
        disabled={isSubmitting}>
        {CREATE_SERVICE_TYPE_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      onClick={() => !isSubmitting && setOpen(true)}
      variant="outline"
      size="sm"
      disabled={isSubmitting}>
      <Plus className="mr-2 size-4" aria-hidden="true" />
      {CREATE_SERVICE_TYPE_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(value) => !isSubmitting && setOpen(value)}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{CREATE_SERVICE_TYPE_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {CREATE_SERVICE_TYPE_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <CreateServiceTypeForm form={form} onSubmit={handleSubmit}>
            <DialogFooter>
              <DialogFooterContent />
            </DialogFooter>
          </CreateServiceTypeForm>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(value) => !isSubmitting && setOpen(value)}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{CREATE_SERVICE_TYPE_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {CREATE_SERVICE_TYPE_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <CreateServiceTypeForm form={form} onSubmit={handleSubmit}>
          <DrawerFooter>
            <DialogFooterContent />
          </DrawerFooter>
        </CreateServiceTypeForm>
      </DrawerContent>
    </Drawer>
  );
}
