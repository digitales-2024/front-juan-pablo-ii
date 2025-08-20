# 👥 Módulo de Personal (Staff) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Personal** es un sistema integral de gestión de personal médico y administrativo que permite administrar tanto el personal como los tipos de personal en la clínica. Este módulo incluye funcionalidades para crear, editar, desactivar y reactivar personal, así como gestionar los diferentes tipos de personal (médicos, enfermeros, administrativos, etc.) con sus respectivas características y permisos.

## 📁 Estructura del Módulo

```
staff/
├── _actions/
│   ├── staff.actions.ts           # Server Actions para personal
│   └── staff-type.actions.ts      # Server Actions para tipos de personal
├── _components/
│   ├── CreateStaffDialog.tsx      # Diálogo para crear personal
│   ├── CreateStaffForm.tsx        # Formulario de creación de personal
│   ├── CreateStaffTypeDialog.tsx  # Diálogo para crear tipo de personal
│   ├── CreateStaffTypeForm.tsx    # Formulario de creación de tipo de personal
│   ├── DeactivateStaffDialog.tsx  # Diálogo para desactivar personal
│   ├── DeactivateStaffTypeDialog.tsx # Diálogo para desactivar tipo de personal
│   ├── ReactivateStaffDialog.tsx  # Diálogo para reactivar personal
│   ├── ReactivateStaffTypeDialog.tsx # Diálogo para reactivar tipo de personal
│   ├── StaffTable.tsx             # Tabla principal de personal
│   ├── StaffTableColumns.tsx      # Definición de columnas de la tabla
│   ├── StaffTableToolbarActions.tsx # Acciones de la barra de herramientas
│   ├── StaffTypeTable.tsx         # Tabla de tipos de personal
│   ├── StaffTypeTableColumns.tsx  # Definición de columnas de tipos
│   ├── StaffTypeTableToolbarActions.tsx # Acciones de la barra de tipos
│   ├── UpdateStaffSheet.tsx       # Panel lateral para editar personal
│   └── UpdateStaffTypeSheet.tsx   # Panel lateral para editar tipo de personal
├── _hooks/
│   ├── useStaff.ts                # Hook principal para gestión de personal
│   └── useStaffTypes.ts           # Hook para gestión de tipos de personal
├── _interfaces/
│   ├── staff.interface.ts         # Interfaces y schemas para personal
│   └── staff-type.interface.ts    # Interfaces y schemas para tipos de personal
├── types/
│   └── page.tsx                   # Página de gestión de tipos de personal
├── page.tsx                       # Página principal del módulo
└── README.md                      # Esta documentación
```

## 🔧 Funcionalidades Principales

### **Gestión de Personal**
- **CRUD Completo**: Crear, leer, actualizar y desactivar personal
- **Asignación de Usuarios**: Vincular personal con usuarios del sistema (solo SUPER_ADMIN y GERENTE)
- **Gestión de Sucursales**: Asignar personal a sucursales específicas
- **Código CMP**: Campo especial para médicos con número de colegiatura
- **Estados**: Activo/Inactivo con reactivación
- **Validaciones**: DNI, email, teléfono, fechas

### **Gestión de Tipos de Personal**
- **CRUD de Tipos**: Crear, editar, desactivar tipos de personal
- **Categorización**: Médicos, enfermeros, administrativos, etc.
- **Descripciones**: Información adicional para cada tipo
- **Estados**: Activo/Inactivo con reactivación

### **Características Avanzadas**
- **Selección Múltiple**: Operaciones en lote (desactivar/reactivar)
- **Filtros y Búsqueda**: Por nombre, DNI, CMP, tipo de personal
- **Responsive Design**: Adaptable a móviles y tablets
- **Validación en Tiempo Real**: Feedback inmediato al usuario

## 🏗️ Arquitectura Técnica

### **Server Actions**

#### **staff.actions.ts**
```typescript
// Funciones principales
- getStaff()                    # Obtener todo el personal
- getACtiveStaff()             # Obtener personal activo
- getStaffById(id)             # Obtener personal específico
- createStaff(data)            # Crear nuevo personal
- updateStaff(id, data)        # Actualizar personal
- deleteStaff(data)            # Desactivar personal
- reactivateStaff(data)        # Reactivar personal
```

#### **staff-type.actions.ts**
```typescript
// Funciones principales
- getStaffTypes()              # Obtener tipos de personal
- createStaffType(data)        # Crear tipo de personal
- updateStaffType(id, data)    # Actualizar tipo de personal
- deleteStaffTypes(data)       # Desactivar tipos de personal
- reactivateStaffTypes(data)   # Reactivar tipos de personal
```

### **Custom Hooks**

#### **useStaff.ts**
```typescript
// Queries
- staffQuery                   # Query para todo el personal
- activeStaffQuery            # Query para personal activo
- oneStaffQuery(id)           # Query para personal específico

// Mutations
- createMutation              # Crear personal
- updateMutation              # Actualizar personal
- deleteMutation              # Desactivar personal
- reactivateMutation          # Reactivar personal
```

#### **useStaffTypes.ts**
```typescript
// Queries
- staffTypesQuery             # Query para tipos de personal

// Mutations
- createMutation              # Crear tipo de personal
- updateMutation              # Actualizar tipo de personal
- deleteMutation              # Desactivar tipo de personal
- reactivateMutation          # Reactivar tipo de personal
```

### **Tipos de Retorno de Hooks**

#### **useStaff.ts - Tipos de Retorno**
```typescript
interface UseStaffReturn {
  // Queries
  staffQuery: UseQueryResult<Staff[], Error>;
  activeStaffQuery: UseQueryResult<Staff[], Error>;
  oneStaffQuery: (id: string) => UseQueryResult<Staff, Error>;
  
  // Data directa
  staff: Staff[] | undefined;
  
  // Mutations
  createMutation: UseMutationResult<BaseApiResponse<Staff>, Error, CreateStaffDto>;
  updateMutation: UseMutationResult<BaseApiResponse<Staff>, Error, UpdateStaffVariables>;
  deleteMutation: UseMutationResult<BaseApiResponse<Staff>, Error, DeleteStaffDto>;
  reactivateMutation: UseMutationResult<BaseApiResponse<Staff>, Error, DeleteStaffDto>;
}

interface UpdateStaffVariables {
  id: string;
  data: UpdateStaffDto;
}
```

#### **useStaffTypes.ts - Tipos de Retorno**
```typescript
interface UseStaffTypesReturn {
  // Queries
  staffTypesQuery: UseQueryResult<StaffType[], Error>;
  
  // Data directa
  staffTypes: StaffType[] | undefined;
  
  // Mutations
  createMutation: UseMutationResult<BaseApiResponse<StaffType>, Error, CreateStaffTypeDto>;
  updateMutation: UseMutationResult<BaseApiResponse<StaffType>, Error, UpdateStaffTypeVariables>;
  deleteMutation: UseMutationResult<BaseApiResponse<StaffType>, Error, DeleteStaffTypeDto>;
  reactivateMutation: UseMutationResult<BaseApiResponse<StaffType>, Error, DeleteStaffTypeDto>;
}

interface UpdateStaffTypeVariables {
  id: string;
  data: UpdateStaffTypeDto;
}
```

### **Tipos de Respuesta de Server Actions**

#### **Respuestas de Staff Actions**
```typescript
// Respuestas exitosas
type CreateStaffResponse = BaseApiResponse<Staff>;
type UpdateStaffResponse = BaseApiResponse<Staff>;
type DeleteStaffResponse = BaseApiResponse<Staff>;
type GetStaffResponse = { data: Staff[] } | { error: string };
type GetOneStaffResponse = Staff | { error: string };

// BaseApiResponse
interface BaseApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
```

#### **Respuestas de Staff Type Actions**
```typescript
// Respuestas exitosas
type CreateStaffTypeResponse = BaseApiResponse<StaffType>;
type UpdateStaffTypeResponse = BaseApiResponse<StaffType>;
type DeleteStaffTypeResponse = BaseApiResponse<StaffType>;
type GetStaffTypesResponse = { data: StaffType[] } | { error: string };
```

### **Interfaces y Schemas**

#### **staff.interface.ts**
```typescript
// Tipos base de la API
export type Staff = components['schemas']['Staff'] & {
  staffType?: {
    name: string;
  };
};

// DTOs para operaciones CRUD
export type CreateStaffDto = components['schemas']['CreateStaffDto'];
export type UpdateStaffDto = components['schemas']['UpdateStaffDto'];
export type DeleteStaffDto = components['schemas']['DeleteStaffDto'];
export type ReactivateStaffDto = DeleteStaffDto;

// Tipos extendidos para UI
export type StaffTableItem = Staff & { selected?: boolean };

// Schemas de validación con Zod
export const createStaffSchema = z.object({
  staffTypeId: z.string().min(1, "El tipo de personal es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  dni: z.string().min(8, "El DNI debe tener 8 dígitos").max(8, "El DNI debe tener 8 dígitos"),
  birth: z.string().min(1, "La fecha de nacimiento es requerida"),
  email: z.string().email("El email es requerido"),
  phone: z.string().optional(),
  cmp: z.string().optional(),
  userId: z.string().optional(),
  branchId: z.string().min(1, "La sucursal es requerida"),
}) satisfies z.ZodType<CreateStaffDto>;

export const updateStaffSchema = z.object({
  staffTypeId: z.string().min(1, "El tipo de personal es requerido").optional(),
  name: z.string().min(1, "El nombre es requerido").optional(),
  lastName: z.string().min(1, "El apellido es requerido").optional(),
  dni: z.string().min(8, "El DNI debe tener 8 dígitos").max(8, "El DNI debe tener 8 dígitos").optional(),
  birth: z.string().min(1, "La fecha de nacimiento es requerida").optional(),
  email: z.string().email("El email no es válido").optional(),
  phone: z.string().optional(),
  cmp: z.string().optional(),
  userId: z.string().optional(),
  branchId: z.string().min(1, "La sucursal es requerida").optional(),
}) satisfies z.ZodType<UpdateStaffDto>;
```

#### **staff-type.interface.ts**
```typescript
// Tipos base de la API
export type StaffType = components['schemas']['StaffType'];

// DTOs para operaciones CRUD
export type CreateStaffTypeDto = components['schemas']['CreateStaffTypeDto'];
export type UpdateStaffTypeDto = components['schemas']['UpdateStaffTypeDto'];
export type DeleteStaffTypeDto = components['schemas']['DeleteStaffTypeDto'];
export type ReactivateStaffTypeDto = DeleteStaffTypeDto;

// Tipos extendidos para UI
export type StaffTypeTableItem = StaffType & { selected?: boolean };

// Schemas de validación con Zod
export const createStaffTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string(),
}) satisfies z.ZodType<CreateStaffTypeDto>;

export const updateStaffTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional(),
}) satisfies z.ZodType<UpdateStaffTypeDto>;
```

### **Tipos de la API (Generados Automáticamente)**

Los siguientes tipos son generados automáticamente desde el Swagger/OpenAPI del backend:

#### **Staff (Tipo Base)**
```typescript
interface Staff {
  id: string;
  staffTypeId: string;
  name: string;
  lastName: string;
  dni: string;
  birth: string;
  email: string;
  phone?: string;
  cmp?: string;
  userId?: string;
  branchId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  staffType?: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  };
}
```

#### **StaffType (Tipo Base)**
```typescript
interface StaffType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### **DTOs para Operaciones**
```typescript
// Crear Personal
interface CreateStaffDto {
  staffTypeId: string;
  name: string;
  lastName: string;
  dni: string;
  birth: string;
  email: string;
  phone?: string;
  cmp?: string;
  userId?: string;
  branchId?: string;
}

// Actualizar Personal
interface UpdateStaffDto {
  staffTypeId?: string;
  name?: string;
  lastName?: string;
  dni?: string;
  birth?: string;
  email?: string;
  phone?: string;
  cmp?: string;
  userId?: string;
  branchId?: string;
}

// Eliminar/Reactivar Personal
interface DeleteStaffDto {
  ids: string[];
}

// Crear Tipo de Personal
interface CreateStaffTypeDto {
  name: string;
  description?: string;
}

// Actualizar Tipo de Personal
interface UpdateStaffTypeDto {
  name?: string;
  description?: string;
}

// Eliminar/Reactivar Tipo de Personal
interface DeleteStaffTypeDto {
  ids: string[];
}
```

## 🎨 Componentes Principales

### **StaffTable.tsx**
- **Propósito**: Tabla principal para mostrar el personal
- **Características**: 
  - Selección múltiple con checkboxes
  - Filtros y búsqueda integrados
  - Acciones en lote
  - Responsive design

### **CreateStaffDialog.tsx**
- **Propósito**: Diálogo para crear nuevo personal
- **Características**:
  - Formulario completo con validaciones
  - Asignación de usuarios (con permisos)
  - Selección de sucursal
  - Responsive (Dialog/Drawer)

### **UpdateStaffSheet.tsx**
- **Propósito**: Panel lateral para editar personal
- **Características**:
  - Formulario de edición completo
  - Gestión de usuarios existentes
  - Validaciones en tiempo real
  - Actualización optimista

### **StaffTypeTable.tsx**
- **Propósito**: Tabla para gestionar tipos de personal
- **Características**:
  - CRUD completo de tipos
  - Estados activo/inactivo
  - Acciones en lote

### **Tipos de Props de Componentes**

#### **StaffTable.tsx**
```typescript
interface StaffTableProps {
  data: Staff[];
}
```

#### **CreateStaffDialog.tsx**
```typescript
// No requiere props externas
// Estado interno gestionado con useState
```

#### **UpdateStaffSheet.tsx**
```typescript
interface UpdateStaffSheetProps {
  staff: Staff;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}
```

#### **DeactivateStaffDialog.tsx**
```typescript
interface DeactivateStaffDialogProps {
  staff?: Staff;
  staffs?: Staff[];
  variant?: "default" | "outline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  onSuccess?: () => void;
}
```

#### **CreateStaffForm.tsx**
```typescript
interface CreateStaffFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateStaffDto>;
  onSubmit: (data: CreateStaffDto) => void;
}
```

#### **StaffTableToolbarActions.tsx**
```typescript
interface StaffTableToolbarActionsProps {
  table?: Table<Staff>;
}
```

## 📊 Páginas del Módulo

### **page.tsx (Principal)**
```typescript
// Funcionalidades
- Carga de datos con React Query
- Manejo de estados de carga y error
- Renderizado de StaffTable
- Gestión de errores con notFound()
```

### **types/page.tsx**
```typescript
// Funcionalidades
- Gestión específica de tipos de personal
- Carga de datos con useStaffTypes
- Renderizado de StaffTypeTable
- Manejo de errores
```

## 🔐 Sistema de Permisos

### **Asignación de Usuarios**
- **SUPER_ADMIN**: Acceso completo a asignar usuarios
- **GERENTE**: Acceso completo a asignar usuarios
- **Otros roles**: Sin acceso a esta funcionalidad

### **Validaciones de Seguridad**
- Verificación de permisos en tiempo real
- Validación de roles antes de mostrar opciones
- Protección de rutas sensibles

## 🎯 Flujos de Trabajo

### **Creación de Personal**
1. Usuario hace clic en "Crear Personal"
2. Se abre el diálogo con formulario
3. Usuario completa datos básicos
4. Si tiene permisos, puede asignar usuario existente
5. Selecciona sucursal y tipo de personal
6. Validación en tiempo real
7. Envío y creación exitosa

### **Edición de Personal**
1. Usuario hace clic en "Editar" en la tabla
2. Se abre panel lateral con datos actuales
3. Modificación de campos permitidos
4. Gestión de usuario asignado (si tiene permisos)
5. Validación y actualización

### **Desactivación/Reactivación**
1. Selección individual o múltiple
2. Confirmación mediante diálogo
3. Operación en lote
4. Actualización optimista de la UI

## 🧪 Testing y Validación

### **Validaciones de Formularios**
```typescript
// Campos requeridos
- staffTypeId: Tipo de personal obligatorio
- name: Nombre obligatorio
- lastName: Apellido obligatorio
- dni: 8 dígitos exactos
- birth: Fecha válida
- email: Formato de email válido
- branchId: Sucursal obligatoria

// Campos opcionales
- phone: Teléfono con formato internacional
- cmp: Código de colegiatura médica
- userId: Usuario del sistema (solo con permisos)
```

### **Manejo de Errores**
- **Errores de red**: Reintentos automáticos
- **Errores de validación**: Feedback inmediato
- **Errores de permisos**: Mensajes específicos
- **Errores del servidor**: Toast notifications

## 📈 Métricas y Monitoreo

### **Logs de Debug**
```typescript
// Logs principales
- "🏁 Iniciando PageStaff"           # Inicio de página
- "📊 Estado de la query"            # Estado de datos
- "✅ Renderizando página con datos"  # Renderizado exitoso
- "💥 Error en la página"            # Errores críticos
```

### **Métricas de Performance**
- **Tiempo de carga**: < 2 segundos
- **Tiempo de respuesta**: < 500ms para operaciones CRUD
- **Optimistic updates**: Actualización inmediata de UI
- **Cache invalidation**: Gestión inteligente de caché

## 🔄 Integración con Otros Módulos

### **Dependencias**
- **Users**: Para asignación de usuarios existentes
- **Branches**: Para asignación de sucursales
- **Auth**: Para verificación de permisos
- **Common UI**: Componentes reutilizables

### **APIs Consumidas**
```typescript
// Endpoints principales
- GET /staff                    # Listar personal
- GET /staff/active            # Personal activo
- GET /staff/:id               # Personal específico
- POST /staff                  # Crear personal
- PATCH /staff/:id             # Actualizar personal
- DELETE /staff/remove/all     # Desactivar personal
- PATCH /staff/reactivate/all  # Reactivar personal

// Endpoints de tipos
- GET /staff-type              # Listar tipos
- POST /staff-type             # Crear tipo
- PATCH /staff-type/:id        # Actualizar tipo
- DELETE /staff-type/remove/all # Desactivar tipos
- PATCH /staff-type/reactivate/all # Reactivar tipos
```

## 🚀 Guías de Implementación

### **Agregar Nuevo Campo**
1. Actualizar interfaces en `staff.interface.ts`
2. Modificar schemas de validación
3. Actualizar formularios (Create y Update)
4. Modificar columnas de tabla
5. Actualizar Server Actions
6. Probar validaciones

### **Agregar Nuevo Tipo de Personal**
1. Crear registro en base de datos
2. Verificar que aparezca en formularios
3. Probar asignación a personal
4. Validar permisos si aplica

### **Modificar Permisos**
1. Actualizar lógica en `useAuth`
2. Modificar componentes que usan permisos
3. Actualizar validaciones de formularios
4. Probar con diferentes roles

## 🔧 Configuración y Personalización

### **Variables de Entorno**
```env
# No requiere variables específicas
# Usa configuración global del sistema
```

### **Configuración de Caché**
```typescript
// React Query Configuration
staleTime: 1000 * 60 * 5,        # 5 minutos
refetchOnWindowFocus: true,       # Recargar al enfocar ventana
refetchOnMount: true,            # Recargar al montar componente
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
- **Validación**: Zod schemas

### **Optimizaciones**
- **Optimistic Updates**: Actualización inmediata de UI
- **Cache Management**: Invalidación inteligente
- **Lazy Loading**: Carga bajo demanda
- **Error Boundaries**: Manejo robusto de errores

### **Tipos de Eventos y Callbacks**

#### **Eventos de Formularios**
```typescript
// Eventos de submit
type FormSubmitHandler = (data: CreateStaffDto | UpdateStaffDto) => void;

// Eventos de cambio
type FormChangeHandler = (field: string, value: any) => void;

// Eventos de validación
type ValidationHandler = (errors: FieldErrors) => void;
```

#### **Eventos de UI**
```typescript
// Eventos de diálogo/sheet
type OpenChangeHandler = (open: boolean) => void;

// Eventos de tabla
type RowSelectionHandler = (selectedRows: Staff[]) => void;

// Eventos de acciones
type ActionSuccessHandler = () => void;
type ActionErrorHandler = (error: Error) => void;
```

#### **Tipos de Estados**
```typescript
// Estados de carga
type LoadingState = boolean;

// Estados de error
type ErrorState = Error | null;

// Estados de selección
type SelectionState = {
  selectedRows: Staff[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
};
```

### **Tipos de Configuración**

#### **Configuración de React Query**
```typescript
interface QueryConfig {
  staleTime: number;           // 5 minutos
  refetchOnWindowFocus: boolean; // true
  refetchOnMount: boolean;     // true
  retry: number;               // 3 intentos
  retryDelay: number;          // 1000ms
}
```

#### **Configuración de Validación**
```typescript
interface ValidationConfig {
  mode: "onChange" | "onBlur" | "onSubmit";
  reValidateMode: "onChange" | "onBlur" | "onSubmit";
  criteriaMode: "firstError" | "all";
}
```

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
