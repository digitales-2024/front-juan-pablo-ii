# 🛒 Módulo de Órdenes (Orders) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Órdenes** es un sistema integral de gestión de facturación y pagos que permite crear, administrar y procesar diferentes tipos de órdenes comerciales en la clínica. Este módulo incluye funcionalidades para venta de productos, prescripciones médicas, citas médicas, gestión de pagos, filtros avanzados y un sistema completo de estados de transacciones.

## 📁 Estructura del Módulo

```
orders/
├── _actions/
│   ├── billing.actions.ts           # Server Actions para facturación
│   ├── order.actions.ts             # Server Actions para órdenes
│   └── payment.actions.ts           # Server Actions para pagos
├── _components/
│   ├── errorComponents/             # Componentes de manejo de errores
│   │   ├── DataDependencyErrorMessage.tsx
│   │   ├── GeneralErrorMessage.tsx
│   │   ├── NotFoundSearchResults.tsx
│   │   ├── SmallErrorMessage.tsx
│   │   └── SmallLoading.tsx
│   ├── paymentComponents/           # Componentes de gestión de pagos
│   │   ├── cancelPayment/
│   │   ├── processPayment/
│   │   ├── refundPayment/
│   │   ├── rejectPayment/
│   │   └── verifyPayment/
│   ├── detailComponents/            # Componentes de detalles
│   │   ├── BaseServiceItemMetadataCardTable.tsx
│   │   ├── CommonDataMetadata.tsx
│   │   ├── MedicalAppointementDetails.tsx
│   │   ├── OrderPatientDetailsMetadataCardTable.tsx
│   │   ├── ProductMovementMetadataCardTable.tsx
│   │   ├── ShowAppointmentMetadataDialog.tsx
│   │   ├── ShowOrderPrescriptionMetadataDialog.tsx
│   │   ├── ShowProductSaleMetadataDialog.tsx
│   │   ├── TableSkeleton.tsx
│   │   └── TransactionDetailMetadataCardTable.tsx
│   ├── FilterComponents/            # Componentes de filtros
│   │   ├── FilterOrdersDialog.tsx
│   │   ├── FilterOrdersTabCardContent.tsx
│   │   └── SearchOrderCombobox.tsx
│   ├── DeactivateOrderDialog.tsx    # Diálogo para desactivar órdenes
│   ├── LoadingDialogForm.tsx        # Componente de carga
│   ├── OrderTable.tsx               # Tabla principal de órdenes
│   ├── OrderTableColumns.tsx        # Definición de columnas
│   ├── OrderTableToolbarActions.tsx # Acciones de la barra
│   └── ReactivateOrderDialog.tsx    # Diálogo para reactivar órdenes
├── _hooks/
│   ├── useBilling.ts                # Hook para facturación
│   ├── useFilterOrders.ts           # Hook para filtros
│   ├── useOrders.ts                 # Hook principal para órdenes
│   ├── usePayment.ts                # Hook para pagos
│   └── u8seBillingbackup.ts         # Hook de respaldo
├── _interfaces/
│   ├── order.interface.tsx          # Interfaces y schemas principales
│   └── filter.interface.ts          # Interfaces de filtros
├── _statics/
│   ├── errors.ts                    # Configuración de errores
│   ├── forms.ts                     # Configuración de formularios
│   └── metadata.ts                  # Metadatos del módulo
├── error.tsx                        # Página de error
├── loading.tsx                      # Página de carga
├── page.tsx                         # Página principal
└── README.md                        # Esta documentación
```

## 🔧 Funcionalidades Principales

### **Gestión de Órdenes**
- **Tipos de Órdenes**: Venta de productos, prescripciones médicas, citas médicas
- **Estados de Órdenes**: DRAFT, PENDING, COMPLETED, CANCELLED, REFUNDED
- **Estados de Pagos**: PENDING, PROCESSING, COMPLETED, CANCELLED, REFUNDED
- **Métodos de Pago**: CASH, BANK_TRANSFER, DIGITAL_WALLET

### **Sistema de Facturación**
- **Venta de Productos**: Gestión de inventario y facturación
- **Prescripciones Médicas**: Órdenes con servicios y productos
- **Citas Médicas**: Facturación de consultas médicas
- **Metadatos Detallados**: Información completa de transacciones

### **Gestión de Pagos**
- **Procesamiento de Pagos**: Flujo completo de transacciones
- **Verificación de Pagos**: Confirmación de transacciones
- **Cancelación de Pagos**: Reversión de transacciones
- **Rechazo de Pagos**: Gestión de pagos rechazados
- **Reembolsos**: Sistema de devoluciones

### **Filtros y Búsqueda**
- **Filtros por Estado**: Órdenes por estado específico
- **Filtros por Tipo**: Órdenes por tipo de transacción
- **Filtros Combinados**: Estado y tipo simultáneos
- **Búsqueda por Código**: Búsqueda específica de órdenes

## 🏗️ Arquitectura Técnica

### **Server Actions**

#### **order.actions.ts**
```typescript
// Funciones principales de órdenes
- getOrders()                           # Obtener todas las órdenes
- getActiveOrders()                     # Obtener órdenes activas
- getAllOrdersByType(type)              # Órdenes por tipo
- getAllOrdersByStatus(status)          # Órdenes por estado
- getAllOrdersByStatusAndType(status, type) # Órdenes filtradas
- getOrderById(id)                      # Obtener orden específica
- getDetailedOrderById(id)              # Obtener orden detallada
- getDetailedOrderByCode(code)          # Obtener por código
- searchDetailedOrderByCode(code)       # Búsqueda por código
- createOrder(data)                     # Crear orden
- updateOrder(id, data)                 # Actualizar orden
- deleteOrder(data)                     # Desactivar órdenes
- reactivateOrder(data)                 # Reactivar órdenes
- submitDraftOrder(id, data)            # Confirmar borrador
```

#### **billing.actions.ts**
```typescript
// Funciones de facturación
- createProductSaleOrder(data)          # Crear orden de venta
- createPrescriptionOrder(data)         # Crear orden de prescripción
- createMedicalAppointmentOrder(data)   # Crear orden de cita
```

#### **payment.actions.ts**
```typescript
// Funciones de pagos
- processPayment(paymentId, data)       # Procesar pago
- verifyPayment(paymentId, data)        # Verificar pago
- cancelPayment(paymentId, data)        # Cancelar pago
- rejectPayment(paymentId, data)        # Rechazar pago
- refundPayment(paymentId, data)        # Reembolsar pago
```

### **Custom Hooks**

#### **useOrders.ts**
```typescript
// Queries principales
- ordersQuery                           # Query para todas las órdenes
- activeOrdersQuery                     # Query para órdenes activas
- useOneOrderQuery(id)                  # Query para orden específica
- useOneDetailedOrderQuery(id)          # Query para orden detallada
- useSearchDetailedOrderQuery(code)     # Query de búsqueda

// Mutations
- createMutation                         # Crear orden
- updateMutation                         # Actualizar orden
- deleteMutation                         # Desactivar orden
- reactivateMutation                     # Reactivar orden
- submitDraftMutation                    # Confirmar borrador
```

#### **useFilterOrders.ts**
```typescript
// Sistema de filtros unificado
- useUnifiedOrders()                    # Hook principal de filtros
- setFilterAllOrders()                  # Mostrar todas las órdenes
- setFilterByStatus(status)             # Filtrar por estado
- setFilterByType(type)                 # Filtrar por tipo
- setFilterByStatusAndType(status, type) # Filtro combinado
- setFilterByOrdeCode(code)             # Filtrar por código
```

#### **usePayment.ts**
```typescript
// Mutations de pagos
- processPaymentMutation                # Procesar pago
- verifyPaymentMutation                 # Verificar pago
- cancelPaymentMutation                 # Cancelar pago
- rejectPaymentMutation                 # Rechazar pago
- refundPaymentMutation                 # Reembolsar pago
```

#### **useBilling.ts**
```typescript
// Mutations de facturación
- createSaleOrderMutation               # Crear orden de venta
- createPrescriptionOrderMutation       # Crear orden de prescripción
- createMedicalAppointmentOrderMutation # Crear orden de cita
```

### **Interfaces y Schemas**

#### **order.interface.tsx**
```typescript
// Tipos base de la API
export type Order = components['schemas']['Order'];
export type DetailedOrder = components['schemas']['DetailedOrder'];
export type OrderType = components['schemas']['OrderType'];
export type OrderStatus = components['schemas']['OrderStatus'];

// Tipos de pagos
export type Payment = {
  id: string;
  orderId: string;
  date: string;
  status: PaymentStatus;
  type: PaymentType;
  amount: number;
  description?: string;
  paymentMethod: PaymentMethod;
  voucherNumber?: string;
  originalPaymentId?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// DTOs para operaciones CRUD
export type CreateOrderDto = components['schemas']['CreateOrderDto'];
export type UpdateOrderDto = components['schemas']['UpdateOrderDto'];
export type DeleteOrdersDto = components['schemas']['DeleteOrdersDto'];
export type SubmitDraftOrderDto = components['schemas']['SubmitDraftOrderDto'];

// DTOs de facturación
export type CreateProductSaleBillingDto = {
  branchId: string;
  patientId: string;
  storageLocation?: string;
  batchNumber?: string;
  referenceId?: string;
  currency: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  notes?: string;
  products: ProductSaleItemDto[];
  metadata?: Record<string, never>;
};

export type CreatePrescriptionBillingLocalDto = {
  branchId: string;
  patientId: string;
  recipeId: string;
  currency: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  notes?: string;
  products: ProductSaleItemDto[];
  services: ServiceSaleLocalItemDto[];
  metadata?: Record<string, never>;
};

export type CreateMedicalAppointmentBillingDto = {
  appointmentId: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  amountPaid?: number;
  currency: string;
  voucherNumber?: string;
  notes?: string;
  metadata?: Record<string, never>;
};

// DTOs de pagos
export type ProcessPaymentDto = components['schemas']['ProcessPaymentDto'];
export type VerifyPaymentDto = components['schemas']['VerifyPaymentDto'];
export type CancelPaymentDto = components['schemas']['CancelPaymentDto'];
export type RejectPaymentDto = components['schemas']['RejectPaymentDto'];
export type RefundPaymentDto = components['schemas']['RefundPaymentDto'];

// Schemas de validación con Zod
export const createOrderSchema = z.object({
  // ... configuración del schema
});

export const processPaymentSchema = z.object({
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]),
  amount: z.number().positive(),
  voucherNumber: z.string().optional(),
  date: z.string(),
  description: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  verificationNotes: z.string().optional(),
  verifiedAt: z.string().optional(),
});
```

#### **filter.interface.ts**
```typescript
// Tipos de filtros
export type FilterByStatus = {
  orderStatus: OrderStatus;
};

export type FilterByType = {
  orderType: OrderType;
};

export type FilterByStatusAndType = FilterByStatus & FilterByType;

// Schemas de validación para filtros
export const FilterByStatusSchema = z.object({
  orderStatus: z.enum(["DRAFT", "PENDING", "COMPLETED", "CANCELLED", "REFUNDED"]),
});

export const FilterByTypeSchema = z.object({
  orderType: z.enum(["PRODUCT_SALE_ORDER", "MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_APPOINTMENT_ORDER"]),
});

export const FilterByStatusAndTypeSchema = z.object({
  orderStatus: z.enum(["DRAFT", "PENDING", "COMPLETED", "CANCELLED", "REFUNDED"]),
  orderType: z.enum(["PRODUCT_SALE_ORDER", "MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_APPOINTMENT_ORDER"]),
});
```

## 🎨 Componentes Principales

### **OrderTable.tsx**
- **Propósito**: Tabla principal para mostrar órdenes
- **Características**:
  - Columnas: Fecha, Tipo, Estado, Estado de Pago, Impuestos, Subtotal, Total
  - Estados visuales con badges coloridos
  - Acciones contextuales por estado
  - Filtros y búsqueda integrados

### **OrderTableColumns.tsx**
- **Propósito**: Definición detallada de columnas
- **Características**:
  - Columnas configurables y ordenables
  - Formateo de fechas y monedas
  - Estados con iconos y colores
  - Acciones dinámicas según estado
  - Componentes de detalles integrados

### **FilterOrdersDialog.tsx**
- **Propósito**: Diálogo de filtros avanzados
- **Características**:
  - Filtros por estado, tipo y combinados
  - Búsqueda por código de orden
  - Interfaz responsive (Dialog/Drawer)
  - Validación en tiempo real

### **Payment Components**
- **ProcessPaymentDialog**: Procesamiento inicial de pagos
- **VerifyPaymentDialog**: Verificación de transacciones
- **CancelPaymentDialog**: Cancelación de pagos
- **RejectPaymentDialog**: Rechazo de pagos
- **RefundPaymentDialog**: Sistema de reembolsos

### **Detail Components**
- **ShowProductSaleMetadataDialog**: Detalles de venta de productos
- **ShowOrderPrescriptionMetadataDialog**: Detalles de prescripciones
- **ShowAppointmentMetadataDialog**: Detalles de citas médicas
- **ProductMovementMetadataCardTable**: Tabla de movimientos de productos
- **BaseServiceItemMetadataCardTable**: Tabla de servicios contratados

## 📊 Tipos de Datos

### **Tipos Base de la API**

#### **Order (Tipo Base)**
```typescript
interface Order {
  id: string;
  code?: string;
  type: OrderType;
  movementTypeId: string;
  referenceId: string;
  sourceId?: string;
  targetId?: string;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  notes?: string;
  isActive: boolean;
  metadata?: string;
  payments: Payment[];
}
```

#### **DetailedOrder (Tipo Extendido)**
```typescript
interface DetailedOrder extends Order {
  // Incluye todos los campos de Order más:
  // - Relaciones expandidas
  // - Metadatos parseados
  // - Información de pagos detallada
}
```

#### **Payment (Tipo de Pago)**
```typescript
interface Payment {
  id: string;
  orderId: string;
  date: string;
  status: PaymentStatus;
  type: PaymentType;
  amount: number;
  description?: string;
  paymentMethod: PaymentMethod;
  voucherNumber?: string;
  originalPaymentId?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### **Tipos de Enumeraciones**

#### **OrderType**
```typescript
type OrderType = 
  | "PRODUCT_SALE_ORDER"           // Venta de productos
  | "MEDICAL_PRESCRIPTION_ORDER"   // Prescripción médica
  | "MEDICAL_APPOINTMENT_ORDER";   // Cita médica
```

#### **OrderStatus**
```typescript
type OrderStatus = 
  | "DRAFT"                        // Borrador
  | "PENDING"                      // Pendiente
  | "COMPLETED"                    // Completada
  | "CANCELLED"                    // Cancelada
  | "REFUNDED";                    // Reembolsada
```

#### **PaymentStatus**
```typescript
type PaymentStatus = 
  | "PENDING"                      // Pendiente
  | "PROCESSING"                   // Procesando
  | "COMPLETED"                    // Completado
  | "CANCELLED"                    // Cancelado
  | "REFUNDED";                    // Reembolsado
```

#### **PaymentMethod**
```typescript
type PaymentMethod = 
  | "CASH"                         // Efectivo
  | "BANK_TRANSFER"                // Transferencia bancaria
  | "DIGITAL_WALLET";              // Billetera digital
```

### **Tipos de Retorno de Hooks**

#### **useOrders.ts - Tipos de Retorno**
```typescript
interface UseOrdersReturn {
  // Queries
  ordersQuery: UseQueryResult<DetailedOrder[], Error>;
  activeOrdersQuery: UseQueryResult<Order[], Error>;
  
  // Query functions
  useOneOrderQuery: (id: string) => UseQueryResult<Order, Error>;
  useOneDetailedOrderQuery: (id: string) => UseQueryResult<DetailedOrder, Error>;
  useSearchDetailedOrderQuery: (code: string) => UseQueryResult<DetailedOrder[], Error>;
  
  // Mutations
  createMutation: UseMutationResult<BaseApiResponse<Order>, Error, CreateOrderDto>;
  updateMutation: UseMutationResult<BaseApiResponse<Order>, Error, UpdateOrderVariables>;
  deleteMutation: UseMutationResult<BaseApiResponse<Order>, Error, DeleteOrdersDto>;
  reactivateMutation: UseMutationResult<BaseApiResponse<Order>, Error, DeleteOrdersDto>;
  submitDraftMutation: UseMutationResult<BaseApiResponse<Order>, Error, SubmitDraftOrderVariables>;
}

interface UpdateOrderVariables {
  id: string;
  data: UpdateOrderDto;
}

interface SubmitDraftOrderVariables {
  id: string;
  data: SubmitDraftOrderDto;
}
```

#### **useFilterOrders.ts - Tipos de Retorno**
```typescript
interface UseUnifiedOrdersReturn {
  // Data y estado
  data: DetailedOrder[] | undefined;
  isLoading: boolean;
  isError: boolean;
  query: UseQueryResult<DetailedOrder[], Error>;
  filter: OrdersFilter;
  
  // Funciones de filtrado
  setFilterAllOrders: () => void;
  setFilterByStatus: (status: OrderStatus) => void;
  setFilterByType: (type: OrderType) => void;
  setFilterByStatusAndType: (params: { orderStatus: OrderStatus; orderType: OrderType }) => void;
  setFilterByOrdeCode: (params: { orderCode: string; order?: DetailedOrder }) => void;
}

type OrdersFilter =
  | { type: "ALL" }
  | { type: "BY_STATUS"; orderStatus: OrderStatus }
  | { type: "BY_TYPE"; orderType: OrderType }
  | { type: "BY_STATUS_AND_TYPE"; orderStatus: OrderStatus; orderType: OrderType }
  | { type: "BY_ORDER_NUMBER"; orderCode: string; order?: DetailedOrder };
```

#### **usePayment.ts - Tipos de Retorno**
```typescript
interface UsePaymentsReturn {
  // Mutations de pagos
  processPaymentMutation: UseMutationResult<PaymentResponse, Error, PaymentVariables<ProcessPaymentDto>>;
  verifyPaymentMutation: UseMutationResult<PaymentResponse, Error, PaymentVariables<VerifyPaymentDto>>;
  cancelPaymentMutation: UseMutationResult<PaymentResponse, Error, PaymentVariables<CancelPaymentDto>>;
  rejectPaymentMutation: UseMutationResult<PaymentResponse, Error, PaymentVariables<RejectPaymentDto>>;
  refundPaymentMutation: UseMutationResult<PaymentResponse, Error, PaymentVariables<RefundPaymentDto>>;
}

interface PaymentVariables<T> {
  paymentId: string;
  data: T;
}

type PaymentResponse = BaseApiResponse<Payment> | { error: string };
```

### **Tipos de Props de Componentes**

#### **OrderTable.tsx**
```typescript
interface OrderTableProps {
  data: DetailedOrder[];
}
```

#### **FilterOrdersDialog.tsx**
```typescript
// No requiere props externas
// Estado interno gestionado con useState
```

#### **ProcessPaymentDialog.tsx**
```typescript
interface ProcessPaymentDialogProps extends DialogProps {
  order: Order;
  payment: Payment;
  showTrigger?: boolean;
  onSuccess?: () => void;
}
```

#### **ShowProductSaleMetadataDialog.tsx**
```typescript
interface ShowProductSaleMetadataDialogProps {
  data: ProductSaleMetadata;
  orderId: string;
}
```

#### **DeactivateOrderDialog.tsx**
```typescript
interface DeactivateOrderDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  order?: Order;
  orders?: Order[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}
```

## 🎯 Flujos de Trabajo

### **Creación de Orden de Venta**
1. Usuario selecciona "Crear Orden de Venta"
2. Completa formulario con:
   - Sucursal y paciente
   - Productos y cantidades
   - Método de pago
   - Notas opcionales
3. Sistema crea orden en estado DRAFT
4. Genera metadatos de transacción
5. Actualiza inventario automáticamente

### **Creación de Orden de Prescripción**
1. Usuario selecciona "Crear Orden de Prescripción"
2. Completa formulario con:
   - Sucursal, paciente y receta
   - Productos y servicios
   - Método de pago
3. Sistema crea orden con servicios y productos
4. Vincula con citas médicas si aplica
5. Genera metadatos completos

### **Procesamiento de Pago**
1. Usuario hace clic en "Procesar Pago"
2. Completa formulario con:
   - Método de pago
   - Número de voucher
   - Fecha de transacción
   - Descripción
3. Sistema cambia estado a PROCESSING
4. Actualiza información de pago
5. Mantiene orden en estado PENDING

### **Verificación de Pago**
1. Usuario hace clic en "Verificar Pago"
2. Confirma detalles de transacción
3. Sistema cambia estado a COMPLETED
4. Genera salidas de inventario
5. Marca orden como completada

### **Cancelación de Pago**
1. Usuario hace clic en "Cancelar Pago"
2. Proporciona razón de cancelación
3. Sistema cambia estado a CANCELLED
4. No genera salidas de inventario
5. Marca orden como cancelada

## 🧪 Validaciones y Reglas de Negocio

### **Validaciones de Formularios**
```typescript
// Campos requeridos para órdenes
- branchId: Sucursal obligatoria
- patientId: Paciente obligatorio
- currency: Moneda obligatoria
- paymentMethod: Método de pago obligatorio
- products: Al menos un producto
- services: Al menos un servicio (prescripciones)

// Validaciones de pagos
- paymentMethod: Método válido
- amount: Monto positivo
- voucherNumber: Formato válido
- date: Fecha válida
- description: Descripción opcional

// Validaciones de negocio
- order must be active
- payment must be pending for processing
- payment must be processing for verification
- order status must match payment status
- inventory must have sufficient stock
```

### **Estados de Órdenes**
```typescript
const ORDER_STATUS_FLOW = {
  DRAFT: {
    next: ["PENDING"],
    actions: ["submit-draft"],
    description: "Borrador - Pendiente de confirmación"
  },
  PENDING: {
    next: ["COMPLETED", "CANCELLED"],
    actions: ["process-payment", "cancel-order"],
    description: "Pendiente - Esperando procesamiento de pago"
  },
  COMPLETED: {
    next: ["REFUNDED"],
    actions: ["refund-payment"],
    description: "Completada - Pago verificado y procesado"
  },
  CANCELLED: {
    next: [],
    actions: [],
    description: "Cancelada - Orden cancelada"
  },
  REFUNDED: {
    next: [],
    actions: [],
    description: "Reembolsada - Pago reembolsado"
  }
};
```

### **Estados de Pagos**
```typescript
const PAYMENT_STATUS_FLOW = {
  PENDING: {
    next: ["PROCESSING", "CANCELLED"],
    actions: ["process", "cancel"],
    description: "Pendiente - Esperando procesamiento"
  },
  PROCESSING: {
    next: ["COMPLETED", "CANCELLED", "REJECTED"],
    actions: ["verify", "cancel", "reject"],
    description: "Procesando - Pago en proceso"
  },
  COMPLETED: {
    next: ["REFUNDED"],
    actions: ["refund"],
    description: "Completado - Pago verificado"
  },
  CANCELLED: {
    next: [],
    actions: [],
    description: "Cancelado - Pago cancelado"
  },
  REJECTED: {
    next: [],
    actions: [],
    description: "Rechazado - Pago rechazado"
  },
  REFUNDED: {
    next: [],
    actions: [],
    description: "Reembolsado - Pago reembolsado"
  }
};
```

## 🔄 Integración con Otros Módulos

### **Dependencias**
- **Patients**: Para selección de pacientes
- **Branches**: Para selección de sucursales
- **Products**: Para gestión de productos
- **Services**: Para gestión de servicios
- **Staff**: Para información del personal
- **Inventory**: Para gestión de stock
- **Appointments**: Para citas médicas

### **APIs Consumidas**
```typescript
// Endpoints principales de órdenes
- GET /order                           # Listar órdenes
- GET /order/active                    # Órdenes activas
- GET /order/type/:type               # Órdenes por tipo
- GET /order/status/:status           # Órdenes por estado
- GET /order/:type/status/:status     # Órdenes filtradas
- GET /order/:id                      # Obtener orden
- GET /order/detailed/:id             # Obtener orden detallada
- GET /order/detailed/code/:code      # Obtener por código
- GET /order/search/detailed/code/:code # Búsqueda por código
- POST /order                         # Crear orden
- PATCH /order/:id                    # Actualizar orden
- DELETE /order/remove/all            # Desactivar órdenes
- PATCH /order/reactivate/all         # Reactivar órdenes
- POST /order/:id/submit-draft        # Confirmar borrador

// Endpoints de facturación
- POST /billing/product-sale          # Crear orden de venta
- POST /billing/medical-prescription  # Crear orden de prescripción
- POST /billing/medical-appointment   # Crear orden de cita

// Endpoints de pagos
- POST /payment/:id/process           # Procesar pago
- POST /payment/:id/verify            # Verificar pago
- POST /payment/:id/cancel            # Cancelar pago
- POST /payment/:id/reject            # Rechazar pago
- POST /payment/:id/refund            # Reembolsar pago
```

## 📈 Métricas y Monitoreo

### **Logs de Debug**
```typescript
// Logs principales
- "Error al obtener las órdenes"        # Errores de obtención
- "Error al filtrar Ordenes"            # Errores de filtrado
- "Error al cargar la sucursal"         # Errores de dependencias
- "Error al cargar el personal"         # Errores de personal
- "Error al parsear metadata"           # Errores de metadatos
```

### **Métricas de Performance**
- **Tiempo de carga**: < 3 segundos
- **Procesamiento de pagos**: < 5 segundos
- **Filtrado de órdenes**: < 2 segundos
- **Búsqueda por código**: < 1 segundo
- **Cache invalidation**: Inteligente por filtros

## 🚀 Guías de Implementación

### **Agregar Nuevo Tipo de Orden**
1. Actualizar `OrderType` en `order.interface.tsx`
2. Agregar configuración en `orderTypeConfig`
3. Crear DTO específico para el tipo
4. Implementar Server Action correspondiente
5. Agregar componente de detalles
6. Actualizar validaciones y filtros

### **Agregar Nuevo Estado de Pago**
1. Actualizar `PaymentStatus` en `order.interface.tsx`
2. Agregar configuración en `paymentStatusConfig`
3. Implementar lógica de transición
4. Actualizar componentes de UI
5. Modificar validaciones

### **Agregar Nuevo Método de Pago**
1. Actualizar `PaymentMethod` en `order.interface.tsx`
2. Agregar configuración en `paymentMethodConfig`
3. Actualizar formularios de pago
4. Modificar validaciones
5. Probar flujo completo

### **Integrar con Nuevo Módulo**
1. Actualizar dependencias en hooks
2. Modificar queries y mutations
3. Actualizar invalidación de caché
4. Probar sincronización
5. Documentar integración

## 🔧 Configuración y Personalización

### **Variables de Entorno**
```env
# No requiere variables específicas
# Usa configuración global del sistema
```

### **Configuración de Caché**
```typescript
// React Query Configuration
staleTime: 1000 * 60 * 5,              # 5 minutos para órdenes
refetchOnWindowFocus: true,             # Recargar al enfocar ventana
refetchOnMount: true,                   # Recargar al montar componente
```

### **Configuración de Moneda**
```typescript
// Configuración de moneda por defecto
const DEFAULT_CURRENCY = "PEN";

// Formateo de moneda
new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
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
- **Skeleton Loading**: Estados de carga optimizados

### **Consideraciones Especiales**
- **Estados Complejos**: Gestión de estados de órdenes y pagos
- **Metadatos Dinámicos**: Parsing y renderizado de metadatos
- **Filtros Avanzados**: Sistema de filtros unificado
- **Responsive Design**: Adaptación a móviles y tablets
- **Accesibilidad**: Componentes accesibles por defecto

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
