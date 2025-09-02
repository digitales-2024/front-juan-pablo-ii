# 📅 Módulo de Horarios (Schedules) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Horarios** es un sistema avanzado de gestión de calendarios y eventos que permite administrar turnos médicos, citas y otros eventos relacionados con el personal de la clínica. Este módulo incluye un calendario interactivo con múltiples vistas (día, semana, mes), filtros avanzados, gestión de eventos recurrentes y un sistema completo de CRUD para eventos.

## 📁 Estructura del Módulo

```
schedules/
├── _actions/
│   └── event.actions.ts           # Server Actions para eventos
├── _components/
│   ├── CalendarTurns.tsx          # Componente principal del calendario
│   ├── calendar/                  # Sistema de calendario completo
│   │   ├── Calendar.tsx           # Componente principal del calendario
│   │   ├── CalendarContext.tsx    # Contexto del calendario
│   │   ├── CalendarProvider.tsx   # Provider del calendario
│   │   ├── CalendarEvent.tsx      # Componente de evento individual
│   │   ├── CalendarModeIconMap.tsx # Mapeo de iconos por modo
│   │   ├── calendarTailwindClasses.ts # Clases de colores
│   │   ├── body/                  # Cuerpo del calendario
│   │   │   ├── CalendarBody.tsx
│   │   │   ├── CalendarBodyHeader.tsx
│   │   │   ├── day/              # Vista de día
│   │   │   │   ├── CalendarBodyDay.tsx
│   │   │   │   ├── CalendarBodyDayCalendar.tsx
│   │   │   │   ├── CalendarBodyDayContent.tsx
│   │   │   │   ├── CalendarBodyDayEvents.tsx
│   │   │   │   └── CalendarBodyMarginDayMargin.tsx
│   │   │   ├── month/            # Vista de mes
│   │   │   │   └── CalendarBodyMonth.tsx
│   │   │   └── week/             # Vista de semana
│   │   │       └── CalendarBodyWeek.tsx
│   │   ├── dialog/               # Diálogos del calendario
│   │   │   ├── CalendarNewEventDialog.tsx
│   │   │   └── CalendarManageEventDialog.tsx
│   │   └── header/               # Encabezado del calendario
│   │       ├── CalendarHeader.tsx
│   │       ├── actions/          # Acciones del header
│   │       │   ├── CalendarHeaderActions.tsx
│   │       │   ├── CalendarHeaderActionsAdd.tsx
│   │       │   └── CalendarHeaderActionsMode.tsx
│   │       ├── date/             # Componentes de fecha
│   │       │   ├── CalendarHeaderDate.tsx
│   │       │   ├── CalendarHeaderDateBadge.tsx
│   │       │   ├── CalendarHeaderDateChevrons.tsx
│   │       │   └── CalendarHeaderDateIcon.tsx
│   │       └── filters/          # Filtros del calendario
│   │           └── EventFilters.tsx
│   └── form/                     # Componentes de formulario
│       ├── ColorPicker.tsx
│       └── DateTimePicker.tsx
├── _hooks/
│   ├── useEvents.ts              # Hook principal de eventos
│   └── useEventQueryKey.ts       # Utilidad para claves de query
├── _interfaces/
│   └── event.interface.ts        # Interfaces de eventos
├── _libs/
│   └── mock-calendar-events.ts   # Datos mock para desarrollo
├── _types/
│   └── CalendarTypes.tsx         # Tipos del calendario
└── page.tsx                      # Página principal
```

## 🔧 Funcionalidades Principales

### **1. Calendario Interactivo**
- **Múltiples vistas**: Día, semana y mes
- **Navegación fluida**: Cambio entre períodos con animaciones
- **Eventos visuales**: Representación gráfica de eventos con colores
- **Interacciones**: Click para crear/editar eventos
- **Responsive**: Adaptación a diferentes dispositivos

### **2. Gestión de Eventos**
- **Creación de eventos**: Formularios con validación completa
- **Edición en tiempo real**: Modificación de eventos existentes
- **Eliminación segura**: Confirmación antes de eliminar
- **Estados múltiples**: PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
- **Tipos de evento**: TURNO, CITA, OTRO

### **3. Filtros Avanzados**
- **Filtro por personal**: Selección de médicos específicos
- **Filtro por sucursal**: Eventos por ubicación
- **Filtro por horario**: Eventos por schedule específico
- **Filtro por fecha**: Rango de fechas personalizable
- **Filtro por estado**: Eventos por estado de confirmación

### **4. Eventos Recurrentes**
- **Frecuencias**: Diaria, semanal, mensual, anual
- **Intervalos**: Configuración de repetición
- **Fechas de excepción**: Cancelación de eventos específicos
- **Generación automática**: Creación de eventos recurrentes

## 🏗️ Arquitectura Técnica

### **Server Actions**
```typescript
// Consulta de eventos con filtros
export const getEventsByFilter = await createSafeAction(
  GetEventsByFilterSchema,
  getEventsByFilterHandler
);

// CRUD de eventos
export async function createEvent(data: CreateEventDto)
export async function updateEvent(id: string, data: UpdateEventDto)
export async function deleteEvents(data: DeleteEventsDto)
export async function reactivateEvents(data: DeleteEventsDto)

// Generación de eventos recurrentes
export async function generateEvents(id: string)

// Eliminación por schedule
export async function deleteEventsByScheduleId(scheduleId: string)
```

### **Hooks Principales**
```typescript
export const useEvents = (filters?: EventFilterParams) => {
  const eventsQuery          // Query principal de eventos
  const eventsCitaQuery      // Query específica para citas
  const createMutation       // Mutación de creación
  const updateMutation       // Mutación de actualización
  const deleteMutation       // Mutación de eliminación
  const reactivateMutation   // Mutación de reactivación
  const generateEventsMutation // Mutación de generación
  const deleteByScheduleIdMutation // Mutación de eliminación por schedule
}
```

### **Context del Calendario**
```typescript
export interface CalendarContextType {
  events: CalendarEvent[]           // Eventos del calendario
  eventsQuery: UseQueryResult       // Query de eventos
  mode: Mode                        // Modo actual (día/semana/mes)
  date: Date                        // Fecha actual
  newEventDialogOpen: boolean       // Estado del diálogo de nuevo evento
  manageEventDialogOpen: boolean    // Estado del diálogo de gestión
  selectedEvent: CalendarEvent | null // Evento seleccionado
  filters: EventFilterParams        // Filtros aplicados
}
```

## 📊 Interfaces y Tipos

### **Evento del Calendario**
```typescript
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  staff: {
    name: string;
    lastName: string;
  };
  branch: {
    name: string;
  };
  type: 'TURNO' | 'CITA' | 'OTRO';
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  isActive: boolean;
  isCancelled: boolean;
  isBaseEvent: boolean;
  branchId: string;
  staffId: string;
  staffScheduleId: string;
  recurrence: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval: number;
    until: string;
  };
  exceptionDates?: Date[];
  cancellationReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Filtros de Eventos**
```typescript
export interface EventFilterParams {
  staffId?: string;
  type: 'TURNO' | 'CITA' | 'OTRO';
  branchId?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'RESCHEDULED';
  staffScheduleId?: string;
  startDate?: string;
  endDate?: string;
  disablePagination?: boolean;
}
```

### **Tipos de Evento y Estado**
```typescript
export enum EventType {
  TURNO = 'TURNO',
  CITA = 'CITA',
  OTRO = 'OTRO'
}

export enum EventStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}
```

## 🎨 Componentes Principales

### **Calendario Principal**
- **CalendarTurns**: Componente raíz que integra todo el sistema
- **Calendar**: Estructura principal del calendario
- **CalendarProvider**: Provider del contexto con lógica de estado
- **CalendarContext**: Contexto compartido entre componentes

### **Vistas del Calendario**
- **CalendarBodyDay**: Vista detallada de un día específico
- **CalendarBodyWeek**: Vista de una semana completa
- **CalendarBodyMonth**: Vista de un mes completo
- **CalendarBodyHeader**: Encabezado común para todas las vistas

### **Gestión de Eventos**
- **CalendarEvent**: Renderizado individual de cada evento
- **CalendarNewEventDialog**: Diálogo para crear nuevos eventos
- **CalendarManageEventDialog**: Diálogo para editar/eliminar eventos
- **EventFilters**: Panel de filtros avanzados

### **Navegación y Controles**
- **CalendarHeaderActions**: Acciones principales (crear, cambiar modo)
- **CalendarHeaderDate**: Navegación de fechas
- **CalendarHeaderDateChevrons**: Botones de navegación
- **CalendarHeaderActionsMode**: Selector de modo de vista

## 🔄 Flujo de Datos

### **Carga de Eventos**
1. **Inicialización**: CalendarProvider establece filtros por defecto
2. **Query**: useEvents ejecuta getEventsByFilter con filtros
3. **Transformación**: Datos se convierten a CalendarEvent[]
4. **Actualización**: Context se actualiza con nuevos eventos
5. **Renderizado**: Componentes se re-renderizan con nuevos datos

### **Creación de Eventos**
1. **Apertura**: Usuario hace click en "Agregar evento"
2. **Formulario**: CalendarNewEventDialog se abre
3. **Validación**: Zod valida los datos del formulario
4. **Envío**: createMutation ejecuta createEvent
5. **Actualización**: Query se invalida y se recargan datos
6. **Feedback**: Toast notification confirma éxito

### **Edición de Eventos**
1. **Selección**: Usuario hace click en evento existente
2. **Apertura**: CalendarManageEventDialog se abre
3. **Modo edición**: Usuario activa modo de edición
4. **Validación**: Formulario valida cambios
5. **Actualización**: updateMutation ejecuta updateEvent
6. **Sincronización**: Datos se actualizan en tiempo real

## 🎨 Sistema de Colores

### **Paleta de Colores**
```typescript
export const colorOptions = [
  { value: "blue", label: "Azul" },
  { value: "indigo", label: "Índigo" },
  { value: "pink", label: "Rosa" },
  { value: "red", label: "Rojo" },
  { value: "orange", label: "Naranja" },
  { value: "amber", label: "Ámbar" },
  { value: "emerald", label: "Esmeralda" },
  { value: "sky", label: "Cielo" }
];
```

### **Clases CSS Dinámicas**
- **Base**: `bg-{color}-500/10 hover:bg-{color}-500/20`
- **Borde**: `border-{color}-500`
- **Texto**: `text-{color}-500`
- **Indicador**: `bg-{color}-500`

## 🔍 Sistema de Filtros

### **Filtros Disponibles**
- **Personal**: Filtro por médico específico
- **Sucursal**: Filtro por ubicación
- **Horario**: Filtro por schedule específico
- **Fecha**: Rango de fechas personalizable
- **Estado**: Filtro por estado de confirmación

### **Lógica de Filtrado**
```typescript
const normalizedFilters = useMemo(() => ({
  ...filters,
  type: 'TURNO' as const,
  status: 'CONFIRMED' as const,
  startDate: filters?.startDate || format(subDays(startOfMonth(new Date()), 7), 'yyyy-MM-dd'),
  endDate: filters?.endDate || format(addDays(endOfMonth(new Date()), 7), 'yyyy-MM-dd')
}), [filters]);
```

## 🚨 Gestión de Errores

### **Tipos de Error**
- **Errores de validación**: Zod schema validation
- **Errores de red**: Problemas de conectividad
- **Errores de autorización**: Permisos insuficientes
- **Errores de negocio**: Conflictos de horario

### **Manejo de Errores**
```typescript
const handleAuthError = (error: Error, action: string) => {
  if (error.message.includes('No autorizado')) {
    toast.error(`No tienes permisos para ${action}`);
  } else {
    toast.error(error.message || `Error al ${action}`);
  }
};
```

## 📈 Optimizaciones de Performance

### **Caché Inteligente**
- **staleTime**: 15 minutos para datos frescos
- **gcTime**: 30 minutos para limpieza de caché
- **refetchOnMount**: Recarga al montar componente
- **refetchOnWindowFocus**: Recarga al enfocar ventana

### **Optimistic Updates**
- **Actualización inmediata**: UI se actualiza antes de confirmación del servidor
- **Rollback automático**: Reversión en caso de error
- **Sincronización**: Invalidación de queries para consistencia

### **Lazy Loading**
- **Componentes pesados**: Carga diferida de diálogos
- **Datos por demanda**: Carga de eventos solo cuando es necesario
- **Virtualización**: Renderizado eficiente de listas largas

## 🧪 Testing y Calidad

### **Casos de Prueba**
- **Creación de eventos**: Validación de formularios y datos
- **Edición de eventos**: Modificación y persistencia
- **Eliminación de eventos**: Confirmación y limpieza
- **Filtros**: Funcionamiento de todos los tipos de filtro
- **Navegación**: Cambio entre vistas y períodos

### **Validaciones**
- **Formularios**: React Hook Form + Zod
- **API**: Tipos TypeScript generados automáticamente
- **UI**: Componentes accesibles y responsivos
- **Datos**: Validación de fechas y rangos

## 🚀 Características Avanzadas

### **Animaciones**
- **Framer Motion**: Transiciones fluidas entre vistas
- **Layout animations**: Animaciones de layout automáticas
- **Exit animations**: Animaciones de salida suaves
- **Stagger effects**: Efectos escalonados para listas

### **Responsive Design**
- **Mobile-first**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación a diferentes tamaños
- **Touch interactions**: Gestos táctiles optimizados
- **Progressive enhancement**: Mejoras progresivas

### **Accesibilidad**
- **ARIA labels**: Etiquetas semánticas
- **Keyboard navigation**: Navegación por teclado
- **Screen reader**: Compatibilidad con lectores
- **Focus management**: Gestión de foco automática

## 📝 Guías de Implementación

### **Agregar Nuevo Tipo de Evento**
1. Extender `EventType` enum
2. Actualizar interfaces en `event.interface.ts`
3. Modificar esquemas de validación Zod
4. Actualizar componentes de formulario
5. Agregar colores específicos si es necesario

### **Implementar Nuevo Filtro**
1. Extender `EventFilterParams` interface
2. Agregar lógica en `getEventsByFilter`
3. Crear componente de filtro en `EventFilters.tsx`
4. Actualizar normalización en `useEvents`
5. Agregar validación en schema

### **Agregar Nueva Vista de Calendario**
1. Crear componente en `calendar/body/`
2. Agregar lógica en `CalendarBody.tsx`
3. Extender `Mode` type si es necesario
4. Actualizar `CalendarModeIconMap`
5. Agregar navegación específica

## 🔧 Configuración

### **Variables de Entorno**
```env
# Configuración de caché
EVENT_CACHE_TIME=900000
EVENT_STALE_TIME=900000

# Configuración de paginación
EVENT_PAGE_SIZE=50

# Configuración de filtros
DEFAULT_EVENT_TYPE=TURNO
DEFAULT_EVENT_STATUS=CONFIRMED
```

### **Configuración de Colores**
```typescript
// Personalización de colores por tipo de evento
export const eventTypeColors = {
  TURNO: 'sky',
  CITA: 'emerald',
  OTRO: 'orange'
} as const;
```

### **Configuración de Fechas**
```typescript
// Configuración de zona horaria
export const TIMEZONE_CONFIG = {
  default: 'America/Lima',
  format: 'yyyy-MM-dd HH:mm:ss'
} as const;
```

## 📊 Métricas y Monitoreo

### **Indicadores Clave**
- **Eventos por día**: Cantidad de eventos programados
- **Tasa de confirmación**: Porcentaje de eventos confirmados
- **Conflictos de horario**: Eventos con solapamiento
- **Uso de filtros**: Frecuencia de uso de cada filtro

### **Logs de Debug**
```typescript
// Logs estructurados para debugging
console.log('📅 [Events] Fetching:', normalizedFilters);
console.log('🔄 [Provider] Eventos actualizados:', calendarEvents);
console.log('🔍 [Filtros] Cambio detectado:', { key, value });
```

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
