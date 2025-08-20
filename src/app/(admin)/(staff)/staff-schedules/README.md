# 🕐 Módulo de Horarios del Personal (Staff Schedules) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Horarios del Personal** es un sistema avanzado de gestión de turnos y horarios que permite crear, administrar y programar horarios para el personal médico y administrativo de la clínica. Este módulo incluye funcionalidades para horarios predefinidos (turnos mañana/tarde), horarios personalizados, gestión de excepciones, feriados y generación automática de eventos en el calendario.

## 📁 Estructura del Módulo

```
staff-schedules/
├── _actions/
│   └── staff-schedules.action.ts    # Server Actions para horarios del personal
├── _components/
│   ├── CreateStaffScheduleDialog.tsx    # Diálogo para crear horarios
│   ├── CreateStaffScheduleForm.tsx      # Formulario avanzado de creación
│   ├── DeactivateStaffScheduleDialog.tsx # Diálogo para desactivar horarios
│   ├── ReactivateStaffScheduleDialog.tsx # Diálogo para reactivar horarios
│   ├── StaffSchedulesTable.tsx          # Tabla principal de horarios
│   ├── StaffSchedulesTableColumns.tsx   # Definición de columnas
│   ├── StaffSchedulesTableToolbarActions.tsx # Acciones de la barra
│   └── UpdateStaffScheduleSheet.tsx     # Panel lateral para editar
├── _hooks/
│   └── useStaffSchedules.ts             # Hook principal para gestión
├── _interfaces/
│   ├── staff-schedules.interface.ts     # Interfaces y schemas
│   └── holidayGenerator.ts              # Generador de feriados
├── error.tsx                            # Página de error
├── loading.tsx                          # Página de carga
├── page.tsx                             # Página principal
└── README.md                            # Esta documentación
```

## 🔧 Funcionalidades Principales

### **Gestión de Horarios**
- **Horarios Predefinidos**: Turnos mañana (09:00-14:00) y tarde (14:00-18:00)
- **Horarios Personalizados**: Creación de horarios específicos con patrones de recurrencia
- **Patrones de Recurrencia**: Diario, semanal, quincenal, mensual, sin patrón
- **Gestión de Excepciones**: Fechas específicas donde no se aplica el horario
- **Feriados Automáticos**: Generación automática de feriados peruanos

### **Características Avanzadas**
- **Generación Automática de Eventos**: Creación de eventos en el calendario
- **Filtros por Personal y Sucursal**: Consultas específicas de horarios
- **Estados Activo/Inactivo**: Gestión de estados con reactivación
- **Selección Múltiple**: Operaciones en lote (desactivar/reactivar)
- **Responsive Design**: Adaptable a móviles y tablets

### **Integración con Calendario**
- **Sincronización Automática**: Actualización en tiempo real del calendario
- **Generación de Eventos**: Creación automática basada en patrones
- **Eliminación en Cascada**: Eliminación de eventos al desactivar horarios

## 🏗️ Arquitectura Técnica

### **Server Actions**

#### **staff-schedules.action.ts**
```typescript
// Funciones principales
- getStaffSchedules()                    # Obtener todos los horarios
- createStaffSchedule(data)              # Crear nuevo horario
- updateStaffSchedule(id, data)          # Actualizar horario
- deleteStaffSchedules(data)             # Desactivar horarios
- reactivateStaffSchedules(data)         # Reactivar horarios
- getFilteredStaffSchedules(filters)     # Obtener horarios filtrados
```

### **Custom Hooks**

#### **useStaffSchedules.ts**
```typescript
// Queries
- allStaffSchedulesQuery                 # Query para todos los horarios
- filteredSchedulesQuery                 # Query para horarios filtrados

// Mutations
- createMutation                         # Crear horario
- updateMutation                         # Actualizar horario
- deleteMutation                         # Desactivar horario
- reactivateMutation                     # Reactivar horario

// Integración con eventos
- generateEventsMutation                 # Generar eventos automáticamente
- deleteByScheduleIdMutation             # Eliminar eventos por horario
```

### **Interfaces y Schemas**

#### **staff-schedules.interface.ts**
```typescript
// Tipos base de la API
export type StaffSchedule = components['schemas']['StaffSchedule'] & {
  staff?: {
    name: string;
    lastName: string;
  };
  branch?: {
    name: string;
  };
};

// DTOs para operaciones CRUD
export type CreateStaffScheduleDto = components['schemas']['CreateStaffScheduleDto'];
export type UpdateStaffScheduleDto = components['schemas']['UpdateStaffScheduleDto'];
export type DeleteStaffSchedulesDto = components['schemas']['DeleteStaffSchedulesDto'];

// Schemas de validación con Zod
export const createStaffScheduleSchema = z.object({
  staffId: z.string().min(1, "El personal es requerido"),
  branchId: z.string().min(1, "La sucursal es requerida"),
  title: z.string().min(1, "El título es requerido"),
  color: z.string().min(1, "El color es requerido"),
  startTime: timeSchema,
  endTime: timeSchema,
  daysOfWeek: z.array(z.enum([
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
    "FRIDAY", "SATURDAY", "SUNDAY"
  ])).min(1, "Se requiere al menos un día"),
  recurrence: z.object({
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    interval: z.number().int().positive().min(1),
    until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD requerido")
  }),
  exceptions: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
});
```

#### **holidayGenerator.ts**
```typescript
// Generador de feriados peruanos
export function generateHolidays(year: number = new Date().getFullYear()): string[] {
  // Fechas fijas
  const FIXED_HOLIDAYS = [
    { month: 1, day: 1, description: "Año Nuevo" },
    { month: 5, day: 1, description: "Día del Trabajo" },
    // ... más feriados
  ];

  // Cálculo de Semana Santa (fechas móviles)
  function calculateEaster(year: number): Date {
    // Algoritmo de Meeus/Jones/Butcher
  }

  // Retorna array de fechas en formato YYYY-MM-DD
}
```

## 🎨 Componentes Principales

### **CreateStaffScheduleDialog.tsx**
- **Propósito**: Diálogo principal para crear horarios
- **Características**:
  - Modo simple con horarios predefinidos
  - Modo avanzado con formulario completo
  - Generación automática de títulos
  - Selección de personal y sucursal
  - Gestión de excepciones y feriados

### **CreateStaffScheduleForm.tsx**
- **Propósito**: Formulario avanzado para horarios personalizados
- **Características**:
  - Patrones de recurrencia configurables
  - Selección de días de la semana
  - Gestión de excepciones con calendario
  - Presets de días laborables
  - Validación en tiempo real

### **StaffSchedulesTable.tsx**
- **Propósito**: Tabla principal para mostrar horarios
- **Características**:
  - Columnas: Título, Personal, Sucursal, Días, Horarios, Recurrencia
  - Estados activo/inactivo
  - Acciones de edición y eliminación
  - Filtros y búsqueda integrados

### **UpdateStaffScheduleSheet.tsx**
- **Propósito**: Panel lateral para editar horarios
- **Características**:
  - Edición de campos específicos
  - Gestión de excepciones
  - Actualización optimista
  - Validación de cambios

## 📊 Tipos de Datos

### **Tipos Base de la API**

#### **StaffSchedule (Tipo Base)**
```typescript
interface StaffSchedule {
  id: string;
  staffId: string;
  branchId: string;
  title: string;
  color: string;
  startTime: string;        // Formato HH:mm
  endTime: string;          // Formato HH:mm
  daysOfWeek: string[];     // ["MONDAY", "TUESDAY", ...]
  recurrence: {
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    interval: number;
    until: string;          // Formato YYYY-MM-DD
  };
  exceptions: string[];     // Fechas en formato YYYY-MM-DD
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  staff?: {
    name: string;
    lastName: string;
  };
  branch?: {
    name: string;
  };
}
```

#### **DTOs para Operaciones**
```typescript
// Crear Horario
interface CreateStaffScheduleDto {
  staffId: string;
  branchId: string;
  title: string;
  color: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  recurrence: {
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    interval: number;
    until: string;
  };
  exceptions: string[];
}

// Actualizar Horario
interface UpdateStaffScheduleDto {
  title?: string;
  staffId?: string;
  branchId?: string;
  color?: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: string[];
  recurrence?: {
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    interval: number;
    until: string;
  };
  exceptions?: string[];
}

// Eliminar/Reactivar Horarios
interface DeleteStaffSchedulesDto {
  ids: string[];
}
```

### **Tipos de Retorno de Hooks**

#### **useStaffSchedules.ts - Tipos de Retorno**
```typescript
interface UseStaffSchedulesReturn {
  // Queries
  allStaffSchedulesQuery: UseQueryResult<StaffSchedule[], Error>;
  filteredSchedulesQuery: UseQueryResult<StaffSchedule[], Error>;
  
  // Data directa
  schedules: StaffSchedule[] | undefined;
  
  // Mutations
  createMutation: UseMutationResult<BaseApiResponse<StaffSchedule>, Error, CreateStaffScheduleDto>;
  updateMutation: UseMutationResult<BaseApiResponse<StaffSchedule>, Error, UpdateStaffScheduleVariables>;
  deleteMutation: UseMutationResult<BaseApiResponse<StaffSchedule>, Error, DeleteStaffSchedulesDto>;
  reactivateMutation: UseMutationResult<BaseApiResponse<StaffSchedule>, Error, DeleteStaffSchedulesDto>;
}

interface UpdateStaffScheduleVariables {
  id: string;
  data: UpdateStaffScheduleDto;
}
```

### **Tipos de Props de Componentes**

#### **CreateStaffScheduleDialog.tsx**
```typescript
// No requiere props externas
// Estado interno gestionado con useState
```

#### **CreateStaffScheduleForm.tsx**
```typescript
interface CreateStaffScheduleFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateStaffScheduleDto>;
  onSubmit: (data: CreateStaffScheduleDto) => void;
}
```

#### **StaffSchedulesTable.tsx**
```typescript
interface StaffSchedulesTableProps {
  data: StaffSchedule[];
}
```

#### **UpdateStaffScheduleSheet.tsx**
```typescript
interface UpdateStaffScheduleSheetProps {
  schedule: StaffSchedule;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}
```

#### **DeactivateStaffScheduleDialog.tsx**
```typescript
interface DeleteStaffScheduleDialogProps {
  schedule?: StaffSchedule;
  schedules?: StaffSchedule[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}
```

## 🎯 Flujos de Trabajo

### **Creación de Horario Predefinido**
1. Usuario selecciona "Crear Horario"
2. Elige entre Turno Mañana o Turno Tarde
3. Selecciona personal y sucursal
4. Define fecha de validez
5. Opcionalmente agrega excepciones
6. Sistema crea automáticamente:
   - Horario para días de semana
   - Horario para sábados
   - Genera eventos en el calendario

### **Creación de Horario Personalizado**
1. Usuario activa "Opciones Avanzadas"
2. Completa formulario completo:
   - Personal y sucursal
   - Horarios de inicio y fin
   - Días de la semana
   - Patrón de recurrencia
   - Fecha de validez
   - Excepciones
3. Sistema valida y crea el horario
4. Genera eventos automáticamente

### **Edición de Horario**
1. Usuario hace clic en "Editar"
2. Se abre panel lateral con datos actuales
3. Modifica campos permitidos
4. Sistema detecta cambios automáticamente
5. Actualiza horario y regenera eventos

### **Eliminación de Horario**
1. Usuario selecciona horario(s)
2. Confirma eliminación
3. Sistema elimina eventos del calendario
4. Desactiva horario en base de datos
5. Actualiza caché y UI

## 🧪 Validaciones y Reglas de Negocio

### **Validaciones de Formularios**
```typescript
// Campos requeridos
- staffId: Personal obligatorio
- branchId: Sucursal obligatoria
- title: Título obligatorio
- color: Color obligatorio
- startTime: Formato HH:mm válido
- endTime: Formato HH:mm válido y posterior a startTime
- daysOfWeek: Al menos un día seleccionado
- recurrence: Patrón válido con fecha de fin

// Validaciones de negocio
- startTime < endTime
- until date > today
- exceptions dates > today
- staff must be active
- branch must be active
```

### **Patrones de Recurrencia**
```typescript
const RECURRENCE_OPTIONS = [
  {
    label: "Sin patrón",
    frequency: "YEARLY",
    interval: 1,
    description: "Calendario sin eventos automáticos"
  },
  {
    label: "Días específicos",
    frequency: "WEEKLY",
    interval: 1,
    description: "Selecciona los días de la semana"
  },
  {
    label: "Diario",
    frequency: "DAILY",
    interval: 1,
    description: "Todos los días de la semana"
  },
  {
    label: "Quincenal",
    frequency: "WEEKLY",
    interval: 2,
    description: "Mismos días cada 15 días"
  }
];
```

### **Presets de Días**
```typescript
const DAYS_PRESETS = [
  {
    label: "Días laborables (L-V)",
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
  },
  {
    label: "L-S",
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
  },
  {
    label: "Todos los días",
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
  }
];
```

## 🔄 Integración con Otros Módulos

### **Dependencias**
- **Staff**: Para selección de personal
- **Branches**: Para selección de sucursales
- **Schedules**: Para generación de eventos en calendario
- **Events**: Para gestión de eventos automáticos

### **APIs Consumidas**
```typescript
// Endpoints principales
- GET /staff-schedule                    # Listar horarios
- GET /staff-schedule/filter            # Horarios filtrados
- POST /staff-schedule                  # Crear horario
- PATCH /staff-schedule/:id             # Actualizar horario
- DELETE /staff-schedule/remove/all     # Desactivar horarios
- PATCH /staff-schedule/reactivate/all  # Reactivar horarios

// Endpoints de eventos (integración)
- POST /events/generate/:scheduleId     # Generar eventos
- DELETE /events/schedule/:scheduleId   # Eliminar eventos por horario
```

## 📈 Métricas y Monitoreo

### **Logs de Debug**
```typescript
// Logs principales
- "💥 Error en getStaffSchedulesHandler"    # Errores de obtención
- "Datos enviados al backend"               # Datos de actualización
- "Error creating schedules"                # Errores de creación
- "Error al actualizar"                     # Errores de actualización
```

### **Métricas de Performance**
- **Tiempo de carga**: < 3 segundos
- **Generación de eventos**: < 5 segundos
- **Actualización optimista**: Inmediata
- **Cache invalidation**: Inteligente por filtros

## 🚀 Guías de Implementación

### **Agregar Nuevo Patrón de Recurrencia**
1. Actualizar `RECURRENCE_OPTIONS` en `CreateStaffScheduleForm.tsx`
2. Modificar validaciones en schema
3. Actualizar lógica de generación de eventos
4. Probar con diferentes intervalos

### **Agregar Nuevo Preset de Días**
1. Actualizar `DAYS_PRESETS` en `CreateStaffScheduleForm.tsx`
2. Verificar que funcione en formularios
3. Probar selección y validación

### **Modificar Feriados**
1. Actualizar `FIXED_HOLIDAYS` en `holidayGenerator.ts`
2. Verificar cálculo de Semana Santa
3. Probar generación automática

### **Integrar con Nuevo Módulo**
1. Actualizar dependencias en `useStaffSchedules.ts`
2. Modificar queries y mutations
3. Actualizar invalidación de caché
4. Probar sincronización

## 🔧 Configuración y Personalización

### **Variables de Entorno**
```env
# No requiere variables específicas
# Usa configuración global del sistema
```

### **Configuración de Caché**
```typescript
// React Query Configuration
staleTime: 1000 * 30,                    # 30 segundos para filtrados
staleTime: 1000 * 60,                    # 1 minuto para lista completa
refetchOnWindowFocus: true,              # Recargar al enfocar ventana
refetchOnMount: true,                    # Recargar al montar componente
```

### **Configuración de Zona Horaria**
```typescript
export const TIME_ZONE = 'America/Lima';

// Uso en fechas
format(date, "yyyy-MM-dd", { timeZone: TIME_ZONE })
toDate(dateString, { timeZone: TIME_ZONE })
```

## 📝 Notas de Desarrollo

### **Convenciones de Código**
- **Archivos**: kebab-case
- **Componentes**: PascalCase
- **Hooks**: camelCase con prefijo `use`
- **Interfaces**: PascalCase con sufijo descriptivo
- **Actions**: camelCase descriptivo

### **Patrones Utilizados**
- **Server Actions**: Para operaciones del servidor
- **React Query**: Para gestión de estado del servidor
- **Formularios**: React Hook Form + Zod
- **UI**: Radix UI + Tailwind CSS
- **Validación**: Zod schemas con transformaciones

### **Optimizaciones**
- **Optimistic Updates**: Actualización inmediata de UI
- **Cache Management**: Invalidación inteligente por filtros
- **Lazy Loading**: Carga bajo demanda
- **Error Boundaries**: Manejo robusto de errores
- **Generación Asíncrona**: Eventos generados en background

### **Consideraciones Especiales**
- **Recarga Automática**: La página se recarga automáticamente al entrar
- **Eliminación en Cascada**: Los eventos se eliminan antes que los horarios
- **Generación Automática**: Los eventos se generan automáticamente al crear horarios
- **Feriados Dinámicos**: Los feriados se calculan dinámicamente por año

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
