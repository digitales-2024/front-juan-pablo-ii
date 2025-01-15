'use client'

import { Profile } from '@/app/(auth)/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormValues } from '../type'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/lib/toast/toast-service'
import { PhoneInput } from '@/components/ui/phone-input'



interface ProfilePersonalDataProps {
  profile: Profile;
  onUpdate?: (data: ProfileFormValues) => Promise<void>;
}

export function ProfilePersonalData({ profile, onUpdate }: ProfilePersonalDataProps) {
  const [formActive, setFormActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone || '',
    },
  })

  // Observar cambios en los campos del formulario
  const watchFields = {
    name: form.watch('name'),
    phone: form.watch('phone'),
  }

  // Detectar si el formulario ha sido modificado
  useEffect(() => {
    const isFormModified = 
      profile.name !== watchFields.name || 
      profile.phone !== watchFields.phone
    setFormActive(isFormModified)
  }, [watchFields, profile])

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true)
      if (onUpdate) {
        await onUpdate(data)
        toast.success('Los cambios han sido guardados correctamente.')
      }
    } catch (error) {
      toast.error('No se pudieron guardar los cambios.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <h4 className="text-md font-medium">Datos Personales</h4>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
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
                  <PhoneInput defaultCountry="PE" placeholder="Tu teléfono" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={!formActive || isLoading}
        >
          {isLoading ? 'Actualizando...' : 'Actualizar perfil'}
        </Button>
      </form>
    </Form>
  )
} 