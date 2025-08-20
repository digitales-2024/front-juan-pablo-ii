# 💊 Módulo de Prescripciones (Prescriptions) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Prescripciones** es un sistema integral de gestión de recetas médicas que permite crear, administrar y procesar prescripciones médicas con medicamentos y servicios. Este módulo incluye funcionalidades para visualización de prescripciones, generación de órdenes de facturación, gestión de citas médicas asociadas y un sistema completo de integración con el inventario y servicios médicos.

## 📁 Estructura del Módulo

```
prescriptions/
├── _actions/
│   └── prescriptions.actions.ts      # Server Actions para prescripciones
├── _components/
│   ├── errorComponents/              # Componentes de manejo de errores
│   │   ├── DataDependencyErrorMessage.tsx
│   │   ├── GeneralErrorMessage.tsx
│   │   ├── SmallLoading.tsx
│   │   └── ToolbarLoading.tsx
│   ├── FilterComponents/             # Componentes de filtrado
│   │   ├── SearchPatientCombobox.tsx
│   │   └── SearchPatientDniInput.tsx
│   ├── PrescriptionDetails/          # Componentes de detalles de prescripción
│   │   ├── FormComponents/           # Formularios para órdenes de facturación
│   │   │   ├── ConfirmOrderDialog.tsx
│   │   │   ├── CreatePrescriptionBillingOrderDialog.tsx
│   │   │   ├── CreatePrescriptionBillingOrderForm.tsx
│   │   │   ├── SelectProductTable.tsx
│   │   │   └── SelectProductTableColumns.tsx
│   │   ├── MovementTableColumns.tsx
│   │   ├── PrescriptionMedicamentsCardTable.tsx
│   │   ├── PrescriptionServicesCardTable.tsx
│   │   ├── ShowsPDetailsDialog.tsx
│   │   └── StorageMovementDetail.tsx
│   ├── appointmentComponents/        # Componentes de citas médicas
│   │   └── CreateAppointmentDialog.tsx
│   ├── CreateOutgoingDialog.tsx      # Diálogo para crear salidas (heredado)
│   ├── CreateOutgoingForm.tsx        # Formulario para crear salidas (heredado)
│   ├── DeactivateOutgoingDialog.tsx  # Diálogo para desactivar (heredado)
│   ├── LoadingDialogForm.tsx         # Componente de carga
│   ├── PrescriptionTable.tsx         # Tabla principal de prescripciones
│   ├── PrescriptionTableColumns.tsx  # Columnas de la tabla
│   ├── PrescriptionsTableToolbarActions.tsx # Acciones de la barra de herramientas
│   ├── ReactivateOutgoingDialog.tsx  # Diálogo para reactivar (heredado)
│   └── UpdateOutgoingSheet.tsx       # Hoja para actualizar (heredado)
├── _hooks/
│   ├── useCreateAppointmentForOrder.ts # Hook para crear citas desde órdenes
│   ├── useSelectProducts.ts          # Hook para selección de productos
│   ├── useSelectServices.ts          # Hook para selección de servicios
│   └── useUnifiedPrescriptions.ts    # Hook unificado para prescripciones
├── _interfaces/
│   └── prescription.interface.ts     # Interfaces y tipos de prescripciones
├── _statics/
│   ├── errors.ts                     # Mensajes de error estáticos
│   ├── forms.ts                      # Configuración de formularios
│   └── metadata.ts                   # Metadatos del módulo
├── error.tsx                         # Página de error
├── loading.tsx                       # Página de carga
└── page.tsx                          # Página principal del módulo
```

## 🚀 Funcionalidades Principales

### **Gestión de Prescripciones**
- **Visualización**: Lista completa de prescripciones médicas
- **Filtrado**: Búsqueda por DNI del paciente
- **Detalles**: Visualización completa de medicamentos y servicios
- **Estados**: Gestión de prescripciones activas/inactivas

### **Generación de Órdenes de Facturación**
- **Integración con Inventario**: Selección de productos con stock disponible
- **Servicios Médicos**: Agendamiento automático de citas
- **Cálculo de Precios**: Totalización con IGV y subtotales
- **Métodos de Pago**: Soporte para múltiples formas de pago

### **Gestión de Citas Médicas**
- **Creación Automática**: Generación de citas desde servicios de prescripción
- **Selección de Personal**: Asignación de médicos y especialistas
- **Calendario Integrado**: Agendamiento con disponibilidad
- **Sucursales**: Gestión multi-sucursal

### **Características Avanzadas**
- **Responsive Design**: Adaptación a dispositivos móviles y desktop
- **Validaciones**: Control de stock y disponibilidad
- **Estados de Carga**: Indicadores visuales de progreso
- **Manejo de Errores**: Sistema robusto de gestión de errores

## 🏗️ Arquitectura Técnica

### **Server Actions (`_actions/prescriptions.actions.ts`)**
```typescript
// Funciones principales
export async function getPatientsPrescription(limit = 10, offset = 0)
export async function getPrescriptionsWithPatient(limit = 10, offset = 0)
export async function getPatientPrescriptionsByDni(dni: string)
```

### **Custom Hooks**

#### **useUnifiedPrescriptions.ts**
```typescript
// Hook principal para gestión de prescripciones
export function useUnifiedPrescriptions() {
  // Estados de consulta
  const { data, isLoading, isError, error, refetch }
  
  // Funciones de filtrado
  function setFilterAllPrescriptions(limit = 10, offset = 0)
  function setFilterByDni(dni: string)
}
```

#### **useCreateAppointmentForOrder.ts**
```typescript
// Hook para gestión de citas desde órdenes
export function useSelectedServicesAppointments()
export function useSelectedServicesAppointmentsDispatch()
```

#### **useSelectProducts.ts & useSelectServices.ts**
```typescript
// Hooks para selección de productos y servicios
export function useSelectedProducts()
export function useSelectProductDispatch()
export function useSelectedServices()
export function useSelectServiceDispatch()
```

### **Interfaces (`_interfaces/prescription.interface.ts`)**
```typescript
// Tipos principales
export type PrescriptionWithPatient = {
  id: string;
  patientId: string;
  staffId: string;
  branchId: string;
  registrationDate: string;
  prescriptionMedicaments: PrescriptionItemResponse[];
  prescriptionServices: PrescriptionItemResponse[];
  description?: string;
  purchaseOrderId?: string;
  isActive: boolean;
  patient: PrescriptionPatient;
}

export type PrescriptionItemResponse = {
  id?: string;
  name?: string;
  quantity?: number;
  description?: string;
}
```

## 🎨 Componentes Principales

### **PrescriptionTable.tsx**
- **Propósito**: Tabla principal para mostrar prescripciones
- **Características**: 
  - Paginación y filtrado
  - Selección múltiple
  - Acciones en lote
  - Responsive design

### **ShowPrescriptionDetailsDialog.tsx**
- **Propósito**: Visualización detallada de prescripciones
- **Características**:
  - Modal/Drawer responsive
  - Información del paciente
  - Lista de medicamentos y servicios
  - Metadatos de la prescripción

### **CreatePrescriptionBillingOrderDialog.tsx**
- **Propósito**: Generación de órdenes de facturación
- **Características**:
  - Formulario complejo con validaciones
  - Integración con inventario
  - Cálculo automático de precios
  - Creación de citas médicas

### **PrescriptionMedicamentsCardTable.tsx & PrescriptionServicesCardTable.tsx**
- **Propósito**: Visualización de medicamentos y servicios
- **Características**:
  - Tablas con información detallada
  - Estados de carga y error
  - Diseño de tarjetas

## 📊 Página Principal (`page.tsx`)

### **Estructura**
```typescript
export default function PageOrders() {
  // Estados de consulta
  const { data, isLoading, isError, error, refetch }
  
  // Componentes de filtrado
  const SelectFormItem = () => { /* ... */ }
  
  return (
    <div>
      {/* Header con filtros */}
      {/* Tabla de prescripciones */}
      {/* Componentes de error y carga */}
    </div>
  )
}
```

### **Funcionalidades**
- **Filtrado por DNI**: Búsqueda de prescripciones por paciente
- **Tabla Responsive**: Adaptación a diferentes tamaños de pantalla
- **Estados de Carga**: Indicadores visuales durante consultas
- **Manejo de Errores**: Recuperación y reintento automático

## 🔧 Integración con Otros Módulos

### **Módulo de Órdenes**
- **Generación de Facturas**: Creación automática de órdenes
- **Gestión de Pagos**: Procesamiento de transacciones
- **Estados de Transacción**: Seguimiento de pagos

### **Módulo de Inventario**
- **Verificación de Stock**: Control de disponibilidad
- **Reserva de Productos**: Gestión de inventario en tiempo real
- **Almacenes**: Selección de ubicaciones de stock

### **Módulo de Citas**
- **Agendamiento Automático**: Creación de citas desde servicios
- **Gestión de Horarios**: Disponibilidad de médicos
- **Sucursales**: Multi-sucursal

### **Módulo de Personal**
- **Asignación de Médicos**: Selección de especialistas
- **Roles y Permisos**: Control de acceso
- **Horarios**: Disponibilidad del personal

## 🎯 Flujos de Trabajo

### **Flujo de Visualización de Prescripciones**
1. **Carga Inicial**: Consulta de prescripciones con paginación
2. **Filtrado**: Búsqueda por DNI del paciente
3. **Visualización**: Tabla con información básica
4. **Detalles**: Modal con información completa
5. **Acciones**: Generación de órdenes o citas

### **Flujo de Generación de Órdenes**
1. **Selección**: Elegir prescripción para procesar
2. **Configuración**: Seleccionar productos y servicios
3. **Validación**: Verificar stock y disponibilidad
4. **Cálculo**: Totalización con impuestos
5. **Confirmación**: Diálogo de confirmación
6. **Procesamiento**: Creación de orden y citas

### **Flujo de Creación de Citas**
1. **Servicio**: Seleccionar servicio de la prescripción
2. **Personal**: Elegir médico o especialista
3. **Sucursal**: Seleccionar ubicación
4. **Fecha/Hora**: Agendar en calendario disponible
5. **Confirmación**: Crear cita automáticamente

## 🛡️ Validaciones y Seguridad

### **Validaciones de Datos**
- **DNI**: Formato y existencia del paciente
- **Stock**: Disponibilidad de productos
- **Servicios**: Existencia y estado activo
- **Personal**: Disponibilidad y permisos

### **Control de Acceso**
- **Roles**: Diferentes niveles de acceso
- **Sucursales**: Restricción por ubicación
- **Permisos**: Acciones específicas por rol

### **Integridad de Datos**
- **Transacciones**: Operaciones atómicas
- **Rollback**: Recuperación en caso de error
- **Auditoría**: Registro de cambios

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 640px (Drawer components)
- **Tablet**: 640px - 1024px (Adaptive layout)
- **Desktop**: > 1024px (Dialog components)

### **Componentes Adaptativos**
- **Dialog/Drawer**: Adaptación automática
- **Tablas**: Scroll horizontal en móvil
- **Formularios**: Layout responsive
- **Navegación**: Menús adaptativos

## 🧪 Testing y Calidad

### **Tipos de Testing**
- **Unit Testing**: Componentes individuales
- **Integration Testing**: Flujos completos
- **E2E Testing**: Experiencia de usuario
- **Performance Testing**: Carga y rendimiento

### **Métricas de Calidad**
- **Cobertura de Código**: > 80%
- **Performance**: < 2s de carga
- **Accesibilidad**: WCAG 2.1 AA
- **SEO**: Optimización para motores de búsqueda

## 🚀 Despliegue y Mantenimiento

### **Variables de Entorno**
```env
# Configuración de prescripciones
NEXT_PUBLIC_PRESCRIPTIONS_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_PRESCRIPTIONS_PAGE_SIZE=10
NEXT_PUBLIC_PRESCRIPTIONS_CACHE_TIME=300000
```

### **Scripts de Despliegue**
```bash
# Build de producción
pnpm run build

# Análisis de bundle
pnpm run analyze

# Testing
pnpm run test
pnpm run test:e2e
```

## 📈 Métricas y Analytics

### **Métricas de Uso**
- **Prescripciones Creadas**: Conteo diario/mensual
- **Órdenes Generadas**: Tasa de conversión
- **Citas Agendadas**: Eficiencia del proceso
- **Tiempo de Procesamiento**: Performance del sistema

### **KPIs del Negocio**
- **Conversión**: Prescripciones → Órdenes
- **Eficiencia**: Tiempo de procesamiento
- **Satisfacción**: Feedback de usuarios
- **Rentabilidad**: Análisis de costos

## 🔄 Integración y APIs

### **Endpoints Principales**
```typescript
// Obtener prescripciones
GET /api/v1/receta/patients?limit=10&offset=0

// Obtener prescripciones con paciente
GET /api/v1/receta/withPatient?limit=10&offset=0

// Obtener prescripciones por DNI
GET /api/v1/receta/patient/{dni}
```

### **Tipos de Respuesta**
```typescript
// Respuesta exitosa
type SuccessResponse = PrescriptionWithPatient[]

// Respuesta de error
type ErrorResponse = { error: string }
```

## 📚 Guías de Implementación

### **Agregar Nuevo Campo a Prescripción**
1. **Actualizar Interface**: Modificar `prescription.interface.ts`
2. **Actualizar API**: Modificar Server Actions
3. **Actualizar Componentes**: Modificar formularios y tablas
4. **Testing**: Verificar funcionalidad

### **Crear Nuevo Tipo de Filtro**
1. **Actualizar Hook**: Modificar `useUnifiedPrescriptions.ts`
2. **Actualizar UI**: Agregar componente de filtro
3. **Actualizar API**: Modificar Server Actions
4. **Testing**: Verificar filtrado

### **Integrar Nuevo Servicio**
1. **Actualizar Interfaces**: Agregar tipos del servicio
2. **Actualizar Componentes**: Modificar formularios
3. **Actualizar Hooks**: Agregar lógica de selección
4. **Testing**: Verificar integración

## 🐛 Troubleshooting

### **Problemas Comunes**

#### **Error de Carga de Prescripciones**
```typescript
// Verificar conexión a API
// Verificar autenticación
// Verificar permisos de usuario
```

#### **Error en Generación de Órdenes**
```typescript
// Verificar stock disponible
// Verificar datos del paciente
// Verificar configuración de pagos
```

#### **Error en Creación de Citas**
```typescript
// Verificar disponibilidad del personal
// Verificar horarios disponibles
// Verificar configuración de sucursal
```

### **Logs y Debugging**
```typescript
// Habilitar logs de desarrollo
console.log('Prescription data:', data)

// Verificar estado de queries
console.log('Query state:', { isLoading, isError, error })
```

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
