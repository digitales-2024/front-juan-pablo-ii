# 📅 Módulo de Agenda de Citas (Appointments Schedule) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Agenda de Citas** es un calendario interactivo avanzado que permite visualizar, filtrar y gestionar citas médicas en tiempo real. Integra múltiples vistas (día, semana, mes), filtros dinámicos, gestión de eventos y comunicación con el backend mediante React Query y Server Actions.

## 📁 Estructura del Módulo

```
appointments-schedule/
├── _components/
│   ├── CalendarAppointments.tsx           # Componente principal del calendario
│   ├── calendar/
│   │   ├── Calendar.tsx                   # Estructura del calendario
│   │   ├── CalendarContext.tsx            # Contexto del calendario
│   │   ├── CalendarProvider.tsx           # Provider con lógica de estado
│   │   ├── CalendarEvent.tsx              # Renderizado de eventos
│   │   ├── CalendarModeIconMap.tsx        # Iconos por modo
│   │   ├── calendarTailwindClasses.ts     # Clases de colores
│   │   ├── body/
│   │   │   ├── CalendarBody.tsx           # Cuerpo principal
│   │   │   ├── CalendarBodyHeader.tsx     # Header del cuerpo
│   │   │   ├── day/
│   │   │   │   ├── CalendarBodyDay.tsx    # Vista día
│   │   │   │   ├── CalendarBodyDayCalendar.tsx
│   │   │   │   ├── CalendarBodyDayContent.tsx
│   │   │   │   ├── CalendarBodyDayEvents.tsx
│   │   │   │   └── CalendarBodyMarginDayMargin.tsx
│   │   │   ├── month/
│   │   │   │   └── CalendarBodyMonth.tsx  # Vista mes
│   │   │   └── week/
│   │   │       └── CalendarBodyWeek.tsx   # Vista semana
│   │   ├── header/
│   │   │   ├── CalendarHeader.tsx         # Header principal
│   │   │   ├── actions/
│   │   │   │   ├── CalendarHeaderActions.tsx
│   │   │   │   ├── CalendarHeaderActionsAdd.tsx
│   │   │   │   └── CalendarHeaderActionsMode.tsx
│   │   │   ├── date/
│   │   │   │   ├── CalendarHeaderDate.tsx
│   │   │   │   ├── CalendarHeaderDateBadge.tsx
│   │   │   │   ├── CalendarHeaderDateChevrons.tsx
│   │   │   │   └── CalendarHeaderDateIcon.tsx
│   │   │   └── filters/
│   │   │       └── EventFilters.tsx       # Filtros de eventos
│   │   └── dialog/
│   │       ├── CalendarManageEventDialog.tsx  # Dialog de gestión
│   │       └── CalendarNewEventDialog.tsx     # Dialog de creación
│   └── form/
│       ├── ColorPicker.tsx                # Selector de colores
│       └── DateTimePicker.tsx             # Selector de fecha/hora
├── page.tsx                               # Página principal
└── README.md                              # Esta documentación
```

## 🔧 Tipos y Interfaces

```typescript
// Tipos del calendario (importados de schedules)
import { CalendarEvent, Mode } from '@/app/(admin)/(staff)/schedules/_types/CalendarTypes';
import { EventFilterParams } from '@/app/(admin)/(staff)/schedules/_actions/event.actions';

// Tipos principales
export type Mode = 'dia' | 'semana' | 'mes';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type: 'CITA' | 'TURNO';
  status: string;
  staffId?: string;
  branchId?: string;
  createdAt: Date;
}

export interface EventFilterParams {
  type: 'CITA';
  status?: string;
  staffId?: string;
  branchId?: string;
  staffScheduleId?: string;
  startDate?: string;
  endDate?: string;
}
```

## 🎣 Hooks y Contexto

### CalendarContext

```typescript
// CalendarContext.tsx
export const CalendarContext = createContext<CalendarContextType>({
  events: [],
  currentMonth: 0,
  setEvents: () => {},
  mode: 'mes',
  setMode: () => {},
  date: new Date(),
  setDate: () => {},
  calendarIconIsToday: true,
  newEventDialogOpen: false,
  setNewEventDialogOpen: () => {},
  manageEventDialogOpen: false,
  setManageEventDialogOpen: () => {},
  selectedEvent: null,
  setSelectedEvent: () => {},
  filters: {} as EventFilterParams,
  eventsQuery: {} as UseQueryResult<Event[], Error>,
});

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}
```

### CalendarProvider

```typescript
// CalendarProvider.tsx - Lógica principal
export default function CalendarProvider({
  setEvents,
  mode,
  setMode,
  calendarIconIsToday = true,
  children,
  filters,
  date: parentDate,
  setDate: parentSetDate,
}: CalendarProviderProps) {
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [manageEventDialogOpen, setManageEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Cálculo de fechas extendidas para obtener eventos
  const { extendedStart, extendedEnd } = useMemo(() => {
    const monthStart = startOfMonth(parentDate);
    const monthEnd = endOfMonth(parentDate);
    return {
      extendedStart: subDays(monthStart, 7),
      extendedEnd: addDays(monthEnd, 7)
    };
  }, [parentDate]);

  // Filtros seguros con fechas
  const safeFilters = useMemo(() => ({
    ...filters,
    type: 'CITA' as const,
    startDate: format(extendedStart, 'yyyy-MM-dd'),
    endDate: format(extendedEnd, 'yyyy-MM-dd')
  }), [filters, extendedStart, extendedEnd]);

  // Query de eventos usando hook externo
  const { eventsCitaQuery } = useEvents(safeFilters);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  // Efecto para procesar eventos recibidos
  useEffect(() => {
    if (eventsCitaQuery.data) {
      const onlyCitas = eventsCitaQuery.data.filter(event => event.type === 'CITA');
      console.log('🔄 [Provider] Eventos filtrados por tipo CITA:', onlyCitas.length);
      setFilteredEvents(onlyCitas);
      setEvents(onlyCitas);
    } else {
      setFilteredEvents([]);
      setEvents([]);
    }
  }, [eventsCitaQuery.data, setEvents]);

  // Invalidación de queries al cambiar mes
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['calendar-appointments', safeFilters],
      exact: false
    });
  }, [parentDate, queryClient]);

  const contextValue = useMemo(() => ({
    events: filteredEvents || [],
    eventsQuery: eventsCitaQuery,
    currentMonth: parentDate.getMonth(),
    setEvents,
    mode,
    setMode,
    date: parentDate,
    setDate: parentSetDate,
    calendarIconIsToday,
    newEventDialogOpen,
    setNewEventDialogOpen,
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    filters: safeFilters,
  }), [/* dependencies */]);

  return (
    <CalendarContext.Provider value={contextValue}>
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  );
}
```

## 🎨 Componentes Principales

### CalendarAppointments (Componente Principal)

```typescript
// CalendarAppointments.tsx
export default function CalendarAppointments() {
  const [mode, setMode] = useState<Mode>('mes');
  const [date, setDate] = useState<Date>(new Date());
  const [appliedFilters, setAppliedFilters] = useState<EventFilterParams>({
    type: 'CITA',
    status: undefined,
    staffId: undefined,
    branchId: undefined,
    staffScheduleId: undefined,
  });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const handleFilterChange = (newFilters: Partial<EventFilterParams>) => {
    setAppliedFilters(prev => ({
      ...prev,
      ...newFilters,
      type: 'CITA'
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <EventFilters
        appliedFilters={appliedFilters}
        onFilterChange={handleFilterChange}
        currentDate={date}
      />
      <CalendarProvider
        setEvents={setCalendarEvents}
        mode={mode}
        setMode={setMode}
        date={date}
        setDate={setDate}
        calendarIconIsToday={true}
        filters={appliedFilters}
      >
        <Calendar />
      </CalendarProvider>
    </div>
  );
}
```

### CalendarEvent (Renderizado de Eventos)

```typescript
// CalendarEvent.tsx
export default function CalendarEvent({
  event,
  month = false,
  className,
}: {
  event: CalendarEventType;
  month?: boolean;
  className?: string;
}) {
  const { events, setSelectedEvent, setManageEventDialogOpen, date } = useCalendarContext();
  
  // Cálculo de posición para eventos superpuestos
  const style = month ? {} : calculateEventPosition(event, events);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          className={cn(
            `px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${event.color}-500/10 hover:bg-${event.color}-500/20 border border-${event.color}-500`,
            !month && "absolute",
            className
          )}
          style={style}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setSelectedEvent(event);
            setManageEventDialogOpen(true);
          }}
          initial={{ opacity: 0, y: -3, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          layoutId={`event-${event.id}-${month ? "month" : "day"}`}
        >
          <motion.div className={cn(`flex flex-col w-full text-${event.color}-500`, month && "flex-row items-center justify-between")}>
            <p className={cn("font-bold truncate", month && "text-xs")}>{event.title}</p>
            <p className={cn("text-sm", month && "text-xs")}>
              <span>{format(event.start, "h:mm a")}</span>
              <span className={cn("mx-1", month && "hidden")}>-</span>
              <span className={cn(month && "hidden")}>{format(event.end, "h:mm a")}</span>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
```

### EventFilters (Filtros Dinámicos)

```typescript
// EventFilters.tsx
export function EventFilters({
  appliedFilters,
  onFilterChange,
  currentDate,
}: EventFiltersProps) {
  const { branches } = useBranches();
  const { staff } = useStaff();

  const [filter, setFilter] = useState<Omit<EventFilterParams, "type">>({
    startDate: format(currentDate, "yyyy-MM-01"),
    endDate: format(endOfMonth(currentDate), "yyyy-MM-dd"),
    staffScheduleId: undefined,
    status: appliedFilters.status,
  });

  // Filtrar personal con CMP
  const staffOptions = useMemo(() => {
    const allActiveStaff = (staff || []).filter((s) => s.isActive);
    return allActiveStaff.filter((staff) => staff.cmp && staff.cmp.trim() !== "");
  }, [staff]);

  const branchOptions = (branches || []).filter((b) => b.isActive);

  // Debounce para cambios de filtro
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        ...filter,
        type: "CITA" as const,
      } as EventFilterParams);
    }, 300);
    return () => clearTimeout(handler);
  }, [filter, onFilterChange]);

  return (
    <Card className="w-full bg-background shadow-md">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Filtro por personal médico */}
          <div className="space-y-2">
            <Label>Citas asignadas al personal médico</Label>
            <Select value={filter.staffId || "todos"} onValueChange={(value) => handleFilterChange("staffId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un personal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los profesionales</SelectItem>
                {staffOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name.toUpperCase()} - {option.lastName.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por sucursal */}
          <div className="space-y-2">
            <Label>Citas registradas por Sucursal</Label>
            <Select value={filter.branchId || "todos"} onValueChange={(value) => handleFilterChange("branchId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las sucursales</SelectItem>
                {branchOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.title.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por estado */}
          <div className="space-y-2">
            <Label>Estado de cita</Label>
            <Select value={filter.status || "todos"} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                <SelectItem value="NO_SHOW">No asistió</SelectItem>
                <SelectItem value="RESCHEDULED">Reprogramada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🔄 Vistas del Calendario

### Vista Mes (CalendarBodyMonth)

```typescript
// CalendarBodyMonth.tsx
export default function CalendarBodyMonth() {
  const { events, date, setDate, setNewEventDialogOpen } = useCalendarContext();

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      {/* Header con días de la semana */}
      <div className="hidden md:grid grid-cols-7 border-border divide-x divide-border">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground border-b">
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthStart.toISOString()}
          className="grid md:grid-cols-7 flex-grow overflow-y-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {calendarDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, date);
            const dayEvents = events.filter(event => isSameDay(new Date(event.start), day));

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
                }}
              >
                <div className={cn(
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
                      <motion.div className="text-xs text-muted-foreground">
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
```

### Vista Día (CalendarBodyDay)

```typescript
// CalendarBodyDay.tsx
export default function CalendarBodyDay() {
  const { date } = useCalendarContext();
  
  return (
    <div className="flex divide-x flex-grow overflow-hidden">
      <div className="flex flex-col flex-grow divide-y overflow-hidden">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="relative flex flex-1 divide-x">
            <CalendarBodyMarginDayMargin />
            <CalendarBodyDayContent date={date} />
          </div>
        </div>
      </div>
      <div className="lg:flex hidden flex-col flex-grow divide-y max-w-[276px]">
        <CalendarBodyDayCalendar />
        <CalendarBodyDayEvents />
      </div>
    </div>
  );
}
```

## 🎨 Diálogos y Formularios

### CalendarManageEventDialog (Gestión de Eventos)

```typescript
// CalendarManageEventDialog.tsx
export default function CalendarManageEventDialog() {
  const { manageEventDialogOpen, setManageEventDialogOpen, selectedEvent, setSelectedEvent } = useCalendarContext();
  const { staff } = useStaff();
  const { branches } = useBranches();

  const currentStaff = staff?.find(s => s.id === selectedEvent?.staffId);
  const currentBranch = branches?.find(b => b.id === selectedEvent?.branchId);

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-6 w-6" />
            Detalles
          </DialogTitle>
        </DialogHeader>

        <Card className="mt-4">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-2xl font-bold">{selectedEvent?.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="capitalize">
                {selectedEvent?.type.toLowerCase()}
              </Badge>
              <span>•</span>
              <span>Agendado: {format(selectedEvent?.createdAt ?? new Date(), "dd/MM/yyyy")}</span>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EventDetailItem
                icon={<User className="h-4 w-4" />}
                label="Personal asignado"
                value={`${currentStaff?.name} ${currentStaff?.lastName}`}
                subValue={`${currentStaff?.staffType.name.toUpperCase()}${currentStaff?.cmp ? ` • CMP: ${currentStaff.cmp}` : ''}`}
              />
              <EventDetailItem
                icon={<MapPin className="h-4 w-4" />}
                label="Ubicación"
                value={currentBranch?.name || "Nombre no disponible"}
                subValue={currentBranch?.address || "Dirección no disponible"}
              />
              {/* Horarios de inicio y fin */}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
```

### DateTimePicker (Selector de Fecha/Hora)

```typescript
// DateTimePicker.tsx
export function DateTimePicker({ field, fromDate }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date>(
    field.value ? new Date(field.value) : new Date()
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
      field.onChange(newDate.toISOString());
    }
  };

  const handleTimeChange = (type: "hour" | "minute" | "ampm", value: string) => {
    const newDate = new Date(date);
    if (type === "hour") {
      newDate.setHours((parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      const isPM = value === "PM";
      if (isPM && currentHours < 12) {
        newDate.setHours(currentHours + 12);
      } else if (!isPM && currentHours >= 12) {
        newDate.setHours(currentHours - 12);
      }
    }
    setDate(newDate);
    field.onChange(newDate.toISOString());
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>MM/DD/YYYY hh:mm aa</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            {/* Selectores de hora, minuto y AM/PM */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={date && date.getHours() % 12 === hour % 12 ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            {/* Similar para minutos y AM/PM */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

## 🔄 Guías de Implementación

### Agregar un Nuevo Modo de Vista

1) Actualizar tipos:
```typescript
// CalendarTypes.ts
export type Mode = 'dia' | 'semana' | 'mes' | 'nuevo';

export const calendarModes: Mode[] = ['dia', 'semana', 'mes', 'nuevo'];
```

2) Agregar icono:
```typescript
// CalendarModeIconMap.tsx
export const calendarModeIconMap: Record<Mode, React.ReactNode> = {
  dia: <Calendar1 />,
  semana: <CalendarFold />,
  mes: <CalendarDays />,
  nuevo: <CalendarIcon />,
};
```

3) Crear componente de vista:
```typescript
// CalendarBodyNuevo.tsx
export default function CalendarBodyNuevo() {
  const { events, date } = useCalendarContext();
  
  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      {/* Implementación de la nueva vista */}
    </div>
  );
}
```

4) Integrar en CalendarBody:
```typescript
// CalendarBody.tsx
export default function CalendarBody() {
  const { mode } = useCalendarContext();

  return (
    <>
      {mode === "dia" && <CalendarBodyDay />}
      {mode === "semana" && <CalendarBodyWeek />}
      {mode === "mes" && <CalendarBodyMonth />}
      {mode === "nuevo" && <CalendarBodyNuevo />}
    </>
  );
}
```

### Agregar Nuevos Filtros

1) Actualizar tipos:
```typescript
export interface EventFilterParams {
  type: 'CITA';
  status?: string;
  staffId?: string;
  branchId?: string;
  staffScheduleId?: string;
  startDate?: string;
  endDate?: string;
  nuevoFiltro?: string; // Nuevo filtro
}
```

2) Agregar al componente EventFilters:
```typescript
<div className="space-y-2">
  <Label>Nuevo Filtro</Label>
  <Select value={filter.nuevoFiltro || "todos"} onValueChange={(value) => handleFilterChange("nuevoFiltro", value)}>
    <SelectTrigger>
      <SelectValue placeholder="Seleccione opción" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="todos">Todas las opciones</SelectItem>
      <SelectItem value="opcion1">Opción 1</SelectItem>
      <SelectItem value="opcion2">Opción 2</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Personalizar Colores de Eventos

```typescript
// calendarTailwindClasses.ts
export const colorOptions = [
  {
    value: "blue",
    label: "Azul",
    class: {
      base: "bg-blue-500 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500",
      light: "bg-blue-300 border-blue-300 bg-blue-300/10 text-blue-300",
      dark: "dark:bg-blue-700 dark:border-blue-700 bg-blue-700/10 text-blue-700",
    },
  },
  // Agregar nuevos colores aquí
  {
    value: "purple",
    label: "Púrpura",
    class: {
      base: "bg-purple-500 border-purple-500 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500",
      light: "bg-purple-300 border-purple-300 bg-purple-300/10 text-purple-300",
      dark: "dark:bg-purple-700 dark:border-purple-700 bg-purple-700/10 text-purple-700",
    },
  },
];
```

## 🧪 Testing del Módulo

### Casos de Prueba Recomendados

- **Filtros**: Cambio de personal, sucursal, estado y verificación de eventos filtrados.
- **Vistas**: Transición entre día, semana y mes con eventos visibles.
- **Navegación**: Cambio de fechas con chevrons y verificación de eventos cargados.
- **Eventos**: Click en eventos para abrir diálogo de detalles.
- **Responsive**: Comportamiento en diferentes tamaños de pantalla.
- **Performance**: Carga de eventos con muchos datos y filtros activos.

### Logs de Debug

```typescript
console.log('🔄 [CalendarAppointments] Eventos actualizados:', calendarEvents);
console.log('🔄 [CalendarAppointments] Filtros aplicados:', appliedFilters);
console.log('🔄 [Provider] Eventos filtrados por tipo CITA:', onlyCitas.length);
console.log('🔄 [Provider] Filtros actuales:', safeFilters);
console.log('📅 [Calendar] Eventos actualizados', { count: filteredEvents?.length || 0 });
```

## 📈 Métricas y Monitoreo

### KPIs Recomendados

- **Citas por día/semana/mes**: Distribución temporal de citas.
- **Tasa de ocupación**: Horarios más/menos utilizados.
- **Filtros más usados**: Personal y sucursales más consultados.
- **Performance**: Tiempo de carga de eventos y filtros.

### Métricas de Uso

```typescript
// Tracking de uso de filtros
const trackFilterUsage = (filterType: string, value: string) => {
  analytics.track('calendar_filter_used', {
    filter_type: filterType,
    filter_value: value,
    timestamp: new Date().toISOString()
  });
};

// Tracking de navegación
const trackViewChange = (fromView: Mode, toView: Mode) => {
  analytics.track('calendar_view_changed', {
    from_view: fromView,
    to_view: toView,
    timestamp: new Date().toISOString()
  });
};
```

## 🔒 Seguridad y Permisos

- **Autorización**: Verificar permisos para ver/editar citas según rol.
- **Validación**: Sanitización de filtros y parámetros de fecha.
- **Rate Limiting**: Protección contra consultas excesivas al backend.

Permisos sugeridos:
- `appointments:read`, `appointments:create`, `appointments:update`, `appointments:delete`
- `calendar:view`, `calendar:filter`, `calendar:export`

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
