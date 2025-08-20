# 🏥 Módulo de Consultas Médicas (Consultations) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Consultas Médicas** es un sistema integral para el agendamiento de citas médicas que permite a médicos, personal administrativo y super administradores crear consultas médicas de manera eficiente. Este módulo incluye un calendario interactivo, selección de horarios disponibles, gestión de turnos médicos y generación automática de órdenes de facturación.

## 📁 Estructura del Módulo

```
consultations/
├── _components/
│   ├── Consultation.tsx                    # Componente principal del módulo
│   ├── ConsultationForm.tsx                # Formulario de detalles de consulta
│   ├── ConsultationCalendarTime.tsx        # Calendario y selección de horarios
│   ├── LeftPanel.tsx                       # Panel lateral de selección
│   ├── available-times.ts                  # Configuración de horarios disponibles
│   └── calendar/
│       └── CalendarBig.tsx                 # Componente de calendario personalizado
├── page.tsx                                # Página principal del módulo
├── type.ts                                 # Tipos y schemas de validación
└── README.md                               # Esta documentación
```

## 🔧 Interfaces y Tipos

```typescript
// src/app/(admin)/(consultations)/consultations/type.ts
import { z } from "zod";
import { createAppointmentSchema } from "@/app/(admin)/(appointments)/appointments/_interfaces/appointments.interface";

export const consultationsSchema = createAppointmentSchema.extend({
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
});

export type ConsultationSchema = z.infer<typeof consultationsSchema>;
```

## 🎨 Componentes Principales

### Consultation (Componente Principal)

El componente principal maneja el estado global del módulo, incluyendo:
- Gestión de formulario con React Hook Form y Zod
- Conversión de zona horaria (Lima UTC-5 → UTC)
- Creación de citas y órdenes de facturación
- Validaciones de campos requeridos

### ConsultationCalendarTime (Calendario y Horarios)

Gestiona la visualización del calendario y selección de horarios:
- Filtrado de días disponibles según turnos médicos
- Validación de horarios disponibles vs citas existentes
- Conversión de formatos de hora (12h ↔ 24h)
- Integración con eventos de turnos médicos

### LeftPanel (Panel de Selección)

Panel lateral para selección de parámetros básicos:
- Selección de médico, servicio, sucursal y paciente
- Integración con hooks de datos (staff, services, branches, patients)
- Validación de campos requeridos
- Soporte para modo de prescripción

### ConsultationForm (Formulario de Detalles)

Formulario final para completar la consulta:
- Campos de fecha y hora (solo lectura)
- Selección de método de pago
- Campo de notas opcionales
- Información de facturación automática

## ⏰ Configuración de Horarios

```typescript
// Horarios base del sistema (intervalos de 15 minutos)
const timeSlots = [
  "08:00am", "08:15am", "08:30am", "08:45am",
  "09:00am", "09:15am", "09:30am", "09:45am",
  "10:00am", "10:15am", "10:30am", "10:45am",
  "11:00am", "11:15am", "11:30am", "11:45am",
  "12:00pm", "12:15pm", "12:30pm", "12:45pm",
  "01:00pm", "01:15pm", "01:30pm", "01:45pm",
  "02:00pm", "02:15pm", "02:30pm", "02:45pm",
  "03:00pm", "03:15pm", "03:30pm", "03:45pm",
  "04:00pm", "04:15pm", "04:30pm", "04:45pm",
  "05:00pm", "05:15pm", "05:30pm", "05:45pm",
  "06:00pm", "06:15pm", "06:30pm", "06:45pm",
  "07:00pm", "07:15pm", "07:30pm", "07:45pm"
];
```

## 🌍 Manejo de Zonas Horarias

### Conversión Lima → UTC
```typescript
// Lima está en UTC-5
const limaToUTCOffset = 5;

// Procesar hora seleccionada
const [time, period] = data.time.split(/(?=[AaPp][Mm])/);
const [hours, minutes] = time.split(':');
let hour24 = parseInt(hours);

if (period.toLowerCase() === 'pm' && hour24 < 12) {
  hour24 += 12;
} else if (period.toLowerCase() === 'am' && hour24 === 12) {
  hour24 = 0;
}

// Convertir a UTC
const utcHour = hour24 + limaToUTCOffset;

// Crear fecha en UTC
const startDate = new Date(Date.UTC(year, month - 1, day, utcHour, parseInt(minutes), 0, 0));
```

## 🔄 Flujo de Trabajo

### 1. Selección de Parámetros Básicos
- Médico (staffId)
- Servicio (serviceId) 
- Sucursal (branchId)
- Paciente (patientId)

### 2. Visualización de Calendario
- Carga turnos médicos para el médico y sucursal seleccionados
- Filtra días disponibles según turnos confirmados
- Muestra calendario con días habilitados/deshabilitados

### 3. Selección de Fecha y Hora
- Usuario selecciona fecha del calendario
- Sistema carga horarios disponibles para esa fecha
- Filtra horarios según turnos y citas existentes
- Usuario selecciona hora disponible

### 4. Completar Formulario
- Completa método de pago
- Agrega notas opcionales
- Revisa información de facturación

### 5. Creación de Cita y Facturación
- Valida todos los campos requeridos
- Convierte hora local a UTC
- Crea appointment con estado PENDING
- Genera orden de facturación automáticamente
- Invalida queries para actualizar UI

## 🔧 Configuraciones Avanzadas

### Switches de Configuración
```typescript
// Permitir fechas pasadas
const [allowPastDates, setAllowPastDates] = useState(false);

// Mostrar solo días con turnos disponibles
const [showAvailableDays, setShowAvailableDays] = useState(false);

// Mostrar solo horas disponibles según turnos
const [showAvailableHours, setShowAvailableHours] = useState(false);
```

## 🔄 Integración con Otros Módulos

### Dependencias
```typescript
// Hooks utilizados
import { useAppointments } from "@/app/(admin)/(appointments)/appointments/_hooks/useAppointments";
import { useBilling } from "@/app/(admin)/(payment)/orders/_hooks/useBilling";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";
import { useServices } from "@/app/(admin)/services/_hooks/useServices";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { useEvents } from "@/app/(admin)/(staff)/schedules/_hooks/useEvents";
```

### Creación Automática de Facturación
```typescript
// Después de crear la cita
const result = await createMutation.mutateAsync(appointmentToCreate);

if (result.data && result.data.id) {
  const billingData: CreateMedicalAppointmentBillingDto = {
    appointmentId: result.data.id,
    paymentMethod: data.paymentMethod as "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET",
    currency: "PEN",
    notes: data.notes || "",
    metadata: {}
  };
  
  await createMedicalAppointmentOrderMutation.mutateAsync(billingData);
}
```

## 🧪 Testing del Módulo

### Casos de Prueba Recomendados
- **Selección de parámetros**: Verificar que todos los comboboxes funcionen correctamente
- **Validación de fechas**: Probar fechas pasadas, futuras y límites
- **Validación de horarios**: Verificar conflictos con citas existentes
- **Conversión de zona horaria**: Validar conversión Lima → UTC
- **Creación de cita**: Verificar que se cree correctamente
- **Generación de facturación**: Confirmar que se genere la orden automáticamente
- **Validaciones de formulario**: Probar campos requeridos y opcionales

### Logs de Debug Importantes
```typescript
console.log("🕒 HORARIOS:", { /* detalles de conversión horaria */ });
console.log("👀 PREVIEW - Así se enviará el appointment:", appointmentPreview);
console.log("📦 OBJETO FINAL PARA CREAR APPOINTMENT:", appointmentToCreate);
console.log("💰 Creando orden de facturación para la cita médica...");
console.log("✅ Orden de facturación creada exitosamente:", billingResult);
```

## 📈 Métricas y Monitoreo

### KPIs Recomendados
- **Tiempo de agendamiento**: Desde selección hasta confirmación
- **Tasa de éxito**: Citas creadas vs intentos
- **Conflictos de horarios**: Citas que no se pudieron crear por conflictos
- **Uso de turnos**: Horarios más y menos utilizados

## 🔒 Seguridad y Permisos

### Permisos Requeridos
```typescript
const requiredPermissions = [
  'appointments:create',
  'appointments:read',
  'staff:read',
  'services:read', 
  'branches:read',
  'patients:read',
  'billing:create',
  'schedules:read'
];
```

## 🚀 Optimizaciones Recomendadas

### Performance
- **Caching**: Cachear datos de staff, servicios, sucursales y pacientes
- **Lazy loading**: Cargar turnos solo cuando se selecciona médico y sucursal
- **Debouncing**: Aplicar debounce en búsquedas de pacientes
- **Optimistic updates**: Actualizar UI inmediatamente al crear cita

### UX/UI
- **Loading states**: Mostrar spinners durante operaciones
- **Error handling**: Mensajes de error claros y específicos
- **Confirmation dialogs**: Confirmar antes de crear citas
- **Auto-save**: Guardar progreso automáticamente

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
