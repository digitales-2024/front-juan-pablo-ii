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
import type { CreateEventDto } from '../../../_interfaces/event.interface';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, 'Título es requerido'),
  start: z.string().datetime(),
  end: z.string().datetime(),
  staffScheduleId: z.string().min(1, 'Debe seleccionar un horario'),
});

export default function CalendarNewEventDialog() {
  const { newEventDialogOpen, setNewEventDialogOpen, date } =
    useCalendarContext();

  const { allStaffSchedulesQuery } = useStaffSchedules();
  const { createMutation } = useEvents();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      start: format(date, "yyyy-MM-dd'T'HH:mm"),
      end: format(date, "yyyy-MM-dd'T'HH:mm"),
      staffScheduleId: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedSchedule = allStaffSchedulesQuery.data?.find(
      (s) => s.id === values.staffScheduleId
    );

    if (!selectedSchedule) {
      toast.error('Horario no encontrado');
      return;
    }

    const eventData: CreateEventDto = {
      ...values,
      staffId: selectedSchedule.staffId,
      branchId: selectedSchedule.branchId,
      color: selectedSchedule.color,
      type: 'TURNO',
      status: 'CONFIRMED',
    };

    createMutation.mutate(eventData, {
      onSuccess: () => {
        setNewEventDialogOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar evento a horario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                        <DateTimePicker field={field} />
                      </FormControl>
                      <FormMessage />
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
                  <Button type="submit" className="ml-2">
                    Vincular evento
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
