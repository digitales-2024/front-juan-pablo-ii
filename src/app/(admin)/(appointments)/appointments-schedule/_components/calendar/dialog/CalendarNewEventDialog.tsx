import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useCalendarContext } from '../CalendarContext';
import { DateTimePicker } from '../../form/DateTimePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStaffSchedules } from '@/app/(admin)/(staff)/staff-schedules/_hooks/useStaffSchedules';
import { useEvents } from '@/app/(admin)/(staff)/schedules/_hooks/useEvents';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CreateEventDto } from '@/app/(admin)/(staff)/schedules/_interfaces/event.interface';

const formSchema = z.object({
  title: z.string().min(1, 'Título es requerido'),
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  staffScheduleId: z.string().min(1, 'Debe seleccionar un horario'),
}).refine(data => new Date(data.end) > new Date(data.start), {
  message: "La hora de fin debe ser posterior a la hora de inicio",
  path: ["end"]
});

export default function CalendarNewEventDialog() {
  const { newEventDialogOpen, setNewEventDialogOpen, date } =
    useCalendarContext();

  const { allStaffSchedulesQuery } = useStaffSchedules();
  const { createMutation } = useEvents();
  const queryClient = useQueryClient();

  console.log('🔵 [NewEventDialog] Estado inicial:', {
    dialogOpen: newEventDialogOpen,
    currentDate: date.toISOString(),
    schedules: allStaffSchedulesQuery.data?.length || 0,
    schedulesLoading: allStaffSchedulesQuery.isLoading,
    createMutationStatus: createMutation.status
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      start: format(date, "yyyy-MM-dd'T'HH:mmXXX"),
      end: format(date, "yyyy-MM-dd'T'HH:mmXXX"),
      staffScheduleId: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const startUTC = new Date(values.start).toISOString();
    const endUTC = new Date(values.end).toISOString();

    console.log('🕒 Fechas normalizadas:', { startUTC, endUTC });

    const selectedSchedule = allStaffSchedulesQuery.data?.find(
      (s) => s.id === values.staffScheduleId
    );

    if (!selectedSchedule) {
      toast.error('Horario no encontrado');
      return;
    }

    const eventData: CreateEventDto = {
      ...values,
      start: startUTC,
      end: endUTC,
      staffId: selectedSchedule.staffId,
      branchId: selectedSchedule.branchId,
      color: selectedSchedule.color || '#3b82f6',
      type: 'TURNO',
      status: 'CONFIRMED',
    };

    console.log('📤 Datos del evento a crear:', eventData);

    createMutation.mutate(eventData, {
      onSuccess: () => {
        console.log('✅ Evento creado exitosamente');
        setNewEventDialogOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['staff-schedules'] });
      },
      onError: (error) => {
        console.error('❌ Error detallado:', JSON.stringify(error, null, 2));

        const errorMessage = error instanceof Error
          ? error.message
          : 'Error desconocido al crear el evento';

        if (errorMessage.includes('conflict')) {
          toast.error('Conflicto de horario con otro evento');
        } else if (errorMessage.includes('ZodError')) {
          toast.error('Datos del formulario inválidos');
        } else {
          toast.error(`Error al crear el evento: ${errorMessage}`);
        }
      },
    });
  }

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('🔄 Cambio en formulario:', { name, type, value });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (newEventDialogOpen) {
      form.reset({
        title: '',
        start: format(date, "yyyy-MM-dd'T'HH:mmXXX"),
        end: format(date, "yyyy-MM-dd'T'HH:mmXXX"),
        staffScheduleId: '',
      });
    }
  }, [newEventDialogOpen, date, form]);

  return (
    <Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen} key={date.toISOString()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar evento a horario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {allStaffSchedulesQuery.isLoading && (
              <div className="text-sm">Cargando horarios...</div>
            )}
            {allStaffSchedulesQuery.error && (
              <div className="text-red-500 text-sm">
                Error: {allStaffSchedulesQuery.error.message}
              </div>
            )}
            <FormField
              control={form.control}
              name="staffScheduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Horario</FormLabel>
                  {allStaffSchedulesQuery.data?.length === 0 ? (
                    <div className="space-y-2 text-sm">
                      <p>Debe crear un horario primero para asignar eventos</p>
                    </div>
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un horario para vincular" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allStaffSchedulesQuery.data?.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id}>
                            {schedule.title} - {schedule.staff?.name}{' '}
                            {schedule.staff?.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {Boolean(allStaffSchedulesQuery.data?.length) && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Título del evento
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese nombre del turno"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Hora de inicio
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Hora de fin</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          field={field}
                          fromDate={new Date(form.getValues('start'))}
                        />
                      </FormControl>
                      <FormMessage />
                      {form.formState.errors.end?.type === 'custom' && (
                        <span className="text-sm text-red-500">
                          {form.formState.errors.end.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-between items-center mt-6">
              {allStaffSchedulesQuery.data?.length ? (
                <>
                  <Button asChild variant="outline" className="ml">
                    <a href="/staff-schedules">Crear horario</a>
                  </Button>
                  <Button
                    type="submit"
                    className="ml-2"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Creando...' : 'Vincular evento'}
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full">
                  <a href="/staff-schedules">Crear horario</a>
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
