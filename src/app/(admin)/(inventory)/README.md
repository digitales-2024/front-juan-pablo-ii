# 📦 Módulo de Inventario (Inventory) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Inventario** es un sistema integral de gestión de stock que permite administrar el inventario de productos en múltiples almacenes y sucursales. Este módulo incluye funcionalidades para entradas, salidas, transferencias, consulta de stock y filtros avanzados, proporcionando una visión completa del estado del inventario en tiempo real.

## 📁 Estructura del Módulo

```
inventory/
├── income/                    # Gestión de entradas de inventario
│   ├── _actions/
│   │   └── income.actions.ts  # Server Actions para entradas
│   ├── _components/
│   │   ├── CreateIncomingDialog.tsx
│   │   ├── CreateIncomingForm.tsx
│   │   ├── DeactivateIncomingDialog.tsx
│   │   ├── IncomingTable.tsx
│   │   ├── IncomingTableColumns.tsx
│   │   ├── IncomingTableToolbarActions.tsx
│   │   ├── ReactivateIncomingDialog.tsx
│   │   ├── UpdateIncomingSheet.tsx
│   │   ├── Movements/         # Componentes de movimientos
│   │   └── errorComponents/   # Componentes de error
│   ├── _hooks/
│   │   ├── useIncoming.ts     # Hook principal de entradas
│   │   └── useSelectProducts.ts
│   ├── _interfaces/
│   │   └── income.interface.ts
│   ├── _statics/
│   │   ├── errors.ts
│   │   ├── forms.ts
│   │   └── metadata.ts
│   ├── error.tsx
│   ├── loading.tsx
│   └── page.tsx
├── outgoing/                  # Gestión de salidas de inventario
│   ├── _actions/
│   │   └── outgoing.actions.ts
│   ├── _components/
│   │   ├── CreateOutgoingDialog.tsx
│   │   ├── CreateOutgoingForm.tsx
│   │   ├── DeactivateOutgoingDialog.tsx
│   │   ├── OutgoingTable.tsx
│   │   ├── OutgoingTableColumns.tsx
│   │   ├── ProductTableToolbarActions.tsx
│   │   ├── ReactivateOutgoingDialog.tsx
│   │   ├── UpdateOutgoingSheet.tsx
│   │   ├── Movements/
│   │   └── errorComponents/
│   ├── _hooks/
│   │   ├── useOutgoing.ts
│   │   └── useSelectProducts.ts
│   ├── _interfaces/
│   │   └── outgoing.interface.ts
│   ├── _statics/
│   ├── error.tsx
│   ├── loading.tsx
│   └── page.tsx
└── stock/                     # Consulta y gestión de stock
    ├── _actions/
    │   └── stock.actions.ts   # Server Actions para stock
    ├── _components/
    │   ├── StockTable.tsx
    │   ├── StockTableColumns.tsx
    │   ├── StockTableToolbarActions.tsx
    │   ├── FilterComponents/  # Componentes de filtrado
    │   ├── ProductStock/      # Componentes de stock por producto
    │   └── errorComponents/
    ├── _hooks/
    │   ├── useFilterStock.ts  # Hook de filtros unificados
    │   └── useProductStock.ts # Hook de stock por producto
    ├── _interfaces/
    │   ├── filter.interface.ts
    │   └── stock.interface.ts
    ├── _statics/
    │   ├── errors.ts
    │   └── metadata.ts
    ├── error.tsx
    ├── loading.tsx
    └── page.tsx
```

## 🔧 Funcionalidades Principales

### **1. Gestión de Entradas (Income)**
- **Creación de entradas**: Registro de productos que ingresan al inventario
- **Transferencias**: Movimientos entre almacenes con creación automática de salida/entrada
- **Precios de compra**: Registro de costos por producto
- **Estados**: Control de consumación (En proceso/Concretado)
- **Movimientos múltiples**: Gestión de varios productos en una sola entrada

### **2. Gestión de Salidas (Outgoing)**
- **Creación de salidas**: Registro de productos que salen del inventario
- **Validación de stock**: Verificación de disponibilidad antes de salidas
- **Transferencias**: Movimientos entre almacenes con creación automática de entrada
- **Control de stock**: Prevención de salidas que generen stock negativo

### **3. Consulta de Stock (Stock)**
- **Stock por almacén**: Visualización de inventario por ubicación
- **Stock por producto**: Consulta específica de productos
- **Filtros avanzados**: Combinación de almacén y producto
- **Stock general**: Vista consolidada de todo el inventario
- **Actualización en tiempo real**: Sincronización automática con movimientos

## 🏗️ Arquitectura Técnica

### **Server Actions**
```typescript
// Entradas
export async function createIncoming(data: CreateIncomingDto)
export async function updateIncomingStorage(id: string, data: UpdateIncomingStorageDto)
export async function deleteIncoming(data: DeleteIncomingDto)
export async function reactivateIncoming(data: DeleteIncomingDto)

// Salidas
export async function createOutgoing(data: CreateOutgoingDto)
export async function updateOutgoingStorage(id: string, data: UpdateOutgoingStorageDto)
export async function deleteOutgoing(data: DeleteOutgoingDto)
export async function reactivateOutgoing(data: DeleteOutgoingDto)

// Stock
export async function getStockForAllStorages()
export async function getStockByStorage(id: string)
export async function getStockByProduct(id: string)
export async function getStockByStorageProduct({productId, storageId})
```

### **Hooks Principales**
```typescript
// Gestión de entradas
export const useIncoming = () => {
  const detailedIncomingsQuery
  const createMutation
  const updateIncomingStorageMutation
  const deleteMutation
  const reactivateMutation
}

// Gestión de salidas
export const useOutgoing = () => {
  const detailedOutgoingsQuery
  const createMutation
  const updateOutgoingStorageMutation
  const deleteMutation
  const reactivateMutation
}

// Consulta de stock
export const useUnifiedStock = () => {
  const data
  const isLoading
  const setFilterAllStorages
  const setFilterByProduct
  const setFilterByStorage
  const setFilterByStorageAndProduct
}
```

## 📊 Interfaces y Tipos

### **Entradas (Income)**
```typescript
export type DetailedIncoming = {
  id: string;
  name: string;
  description: string;
  storageId: string;
  date: string;
  state: boolean;
  referenceId: string;
  isTransference?: boolean;
  outgoingId?: string;
  isActive: boolean;
  Storage: IncomingStorage;
  Movement: IncomingMovement[];
}

export type IncomingMovement = {
  id: string;
  movementTypeId: string;
  quantity: number;
  date: string;
  state: boolean;
  buyingPrice?: number;
  isActive: boolean;
  Producto: IncomingProduct;
}
```

### **Salidas (Outgoing)**
```typescript
export type DetailedOutgoing = {
  id: string;
  name: string;
  description: string;
  storageId: string;
  date: string;
  state: boolean;
  referenceId: string;
  isTransference?: boolean;
  incomingId?: string;
  isActive: boolean;
  Storage: OutgoingStorage;
  Movement: OutgoingMovement[];
}
```

### **Stock**
```typescript
export type StockByStorage = {
  idStorage: string;
  name: string;
  location: string;
  address: string;
  staff: string;
  description: string;
  stock: ProductStock[];
}

export type ProductStock = {
  idProduct: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  totalPrice: number;
}
```

## 🔄 Flujo de Transferencias

### **Proceso Automático**
1. **Creación de salida**: Se registra la salida del almacén origen
2. **Validación de stock**: Se verifica disponibilidad
3. **Creación automática de entrada**: Se genera entrada en almacén destino
4. **Sincronización**: Se actualizan todas las consultas de stock
5. **Notificaciones**: Se informa el éxito de la transferencia

### **Integridad de Datos**
- **Prevención de stock negativo**: Validaciones en tiempo real
- **Transacciones atómicas**: Rollback automático en caso de error
- **Consistencia**: Sincronización entre entradas y salidas
- **Auditoría**: Trazabilidad completa de movimientos

## 🎨 Componentes Principales

### **Tablas de Datos**
- **IncomingTable**: Tabla de entradas con acciones CRUD
- **OutgoingTable**: Tabla de salidas con validaciones de stock
- **StockTable**: Tabla de stock con filtros dinámicos

### **Formularios**
- **CreateIncomingForm**: Formulario de creación de entradas
- **CreateOutgoingForm**: Formulario de creación de salidas
- **UpdateIncomingSheet**: Panel de actualización de entradas
- **UpdateOutgoingSheet**: Panel de actualización de salidas

### **Diálogos y Modales**
- **CreateIncomingDialog**: Modal de creación de entradas
- **CreateOutgoingDialog**: Modal de creación de salidas
- **FilterStockDialog**: Modal de filtros de stock
- **ShowMovementsDialog**: Modal de visualización de movimientos

## 🔍 Sistema de Filtros

### **Tipos de Filtro**
```typescript
export type StockFilter =
  | { type: "ALL" }
  | { type: "BY_PRODUCT"; productId: string }
  | { type: "BY_STORAGE"; storageId: string }
  | { type: "BY_STORAGE_N_PRODUCT"; productId: string; storageId: string };
```

### **Componentes de Filtrado**
- **FilterStockDialog**: Modal principal de filtros
- **SearchProductCombobox**: Búsqueda de productos
- **FilterStockTabCardContent**: Contenido de pestañas de filtro

## 🚨 Gestión de Errores

### **Tipos de Error**
- **DataDependencyErrorMessage**: Errores de dependencias faltantes
- **GeneralErrorMessage**: Errores generales del sistema
- **ToolbarLoading**: Estados de carga en toolbar
- **NotFoundSearchResults**: Resultados de búsqueda vacíos

### **Validaciones**
- **Stock disponible**: Prevención de salidas sin stock
- **Datos requeridos**: Validación de campos obligatorios
- **Integridad referencial**: Verificación de relaciones entre entidades

## 📈 Métricas y Monitoreo

### **Indicadores Clave**
- **Stock por almacén**: Cantidad de productos por ubicación
- **Movimientos diarios**: Entradas y salidas por día
- **Productos con bajo stock**: Alertas de inventario mínimo
- **Transferencias**: Movimientos entre almacenes

### **Reportes**
- **Stock consolidado**: Vista general del inventario
- **Movimientos por período**: Historial de entradas y salidas
- **Productos más movidos**: Análisis de rotación

## 🔐 Seguridad y Permisos

### **Control de Acceso**
- **Roles por sucursal**: Acceso limitado por ubicación
- **Permisos por operación**: CRUD diferenciado por usuario
- **Auditoría de cambios**: Registro de modificaciones

### **Validaciones de Negocio**
- **Stock mínimo**: Prevención de salidas excesivas
- **Fechas válidas**: Control de períodos de operación
- **Referencias únicas**: Evitar duplicados en transferencias

## 🧪 Testing y Calidad

### **Casos de Prueba**
- **Creación de entradas**: Validación de datos y cálculos
- **Creación de salidas**: Verificación de stock disponible
- **Transferencias**: Integridad de movimientos automáticos
- **Filtros**: Funcionamiento de consultas dinámicas

### **Validaciones**
- **Formularios**: React Hook Form + Zod
- **API**: Tipos TypeScript generados automáticamente
- **UI**: Componentes accesibles y responsivos

## 🚀 Optimizaciones

### **Performance**
- **Caché inteligente**: React Query con stale time configurado
- **Lazy loading**: Carga diferida de componentes pesados
- **Optimistic updates**: Actualizaciones optimistas de UI

### **UX/UI**
- **Responsive design**: Adaptación a diferentes dispositivos
- **Loading states**: Estados de carga informativos
- **Error boundaries**: Manejo graceful de errores
- **Toast notifications**: Feedback inmediato al usuario

## 📝 Guías de Implementación

### **Agregar Nuevo Tipo de Movimiento**
1. Extender interfaces en `_interfaces/`
2. Actualizar Server Actions
3. Modificar formularios de creación
4. Actualizar validaciones Zod
5. Agregar columnas en tablas

### **Implementar Nuevo Filtro**
1. Definir tipo en `StockFilter`
2. Agregar lógica en `useUnifiedStock`
3. Crear componente de filtro
4. Integrar en `FilterStockDialog`

### **Agregar Validación de Negocio**
1. Implementar en Server Actions
2. Agregar validación en formularios
3. Crear mensajes de error específicos
4. Actualizar documentación

## 🔧 Configuración

### **Variables de Entorno**
```env
# Configuración de stock mínimo
MIN_STOCK_THRESHOLD=5

# Configuración de caché
STOCK_CACHE_TIME=300000

# Configuración de transferencias
AUTO_TRANSFER_ENABLED=true
```

### **Metadatos del Módulo**
```typescript
export const METADATA = {
  title: "Stock",
  entityName: "Stock",
  entityPluralName: "Stock",
  description: "Administra el stock de productos.",
  Icon: PackageOpen,
  dataDependencies: [
    { dependencyName: "Personal", dependencyUrl: "/staff" },
    { dependencyName: "Sucursales", dependencyUrl: "/branches" },
    { dependencyName: "Almacenamiento", dependencyUrl: "/storage/storages" }
  ]
}
```

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
