import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useCalendarContext } from '../../CalendarContext';
import CalendarEvent from '../../CalendarEvent';

export default function CalendarBodyMonth() {
  const { events, filters, date, eventsQuery, setDate, setNewEventDialogOpen } = useCalendarContext();

  // Los eventos ya vienen filtrados desde el contexto
  // Eliminar console.logs de depuración si es necesario

  // Get the first day of the month
  const monthStart = startOfMonth(date);
  // Get the last day of the month
  const monthEnd = endOfMonth(date);

  // Get the first Monday of the first week (may be in previous month)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  // Get the last Sunday of the last week (may be in next month)
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Get all days between start and end
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const today = new Date();

  // Mostrar estado de carga
  // if (eventsQuery.isLoading) {
  //   return (
  //     <div className="flex-1 flex items-center justify-center">
  //       <Spinner className="h-8 w-8 text-primary" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="hidden md:grid grid-cols-7 border-border divide-x divide-border">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-muted-foreground border-b border-border">
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthStart.toISOString()}
          className="grid md:grid-cols-7 flex-grow overflow-y-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}>
          {calendarDays.map((day) => {
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, date);

            // Filtrar eventos para el día actual
            const dayEvents = events.filter(event =>
              isSameDay(new Date(event.start), day)
            );

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'relative flex flex-col border-b border-r p-2 aspect-square cursor-pointer',
                  !isCurrentMonth && 'bg-muted/50 hidden md:flex'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setDate(day);
                  // setNewEventDialogOpen(true);
                }}>
                <div
                  className={cn(
                    'text-sm font-medium w-fit p-1 flex flex-col items-center justify-center rounded-full aspect-square',
                    isToday && 'bg-primary text-background'
                  )}>
                  {format(day, 'd')}
                </div>
                <AnimatePresence mode="wait">
                  <div className="flex flex-col gap-1 mt-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <CalendarEvent
                        key={event.id}
                        event={event}
                        className="relative h-auto"
                        month
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <motion.div
                        key={`more-${day.toISOString()}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="text-xs text-muted-foreground"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setDate(day);
                          setNewEventDialogOpen(true);
                        }}>
                        +{dayEvents.length - 3} more
                      </motion.div>
                    )}
                  </div>
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
