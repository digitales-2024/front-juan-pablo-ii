# 🛍️ Módulo de Venta de Productos (Product Sale) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Venta de Productos** es un sistema integral de gestión de ventas que permite crear, administrar y procesar ventas de productos del inventario. Este módulo incluye funcionalidades para selección de productos, gestión de stock, cálculo automático de precios, integración con prescripciones médicas y generación de órdenes de facturación.

## 📁 Estructura del Módulo

```
productSale/
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
│   ├── ProductDetails/               # Componentes de detalles de productos
│   │   ├── FormComponents/           # Formularios de productos
│   │   │   ├── CreateProductSaleBillingOrderDialog.tsx
│   │   │   ├── CreateProductSaleBillingOrderForm.tsx
│   │   │   ├── SelectProductDialog.tsx
│   │   │   ├── SelectProductTable.tsx
│   │   │   └── SelectProductTableColumns.tsx
│   │   ├── MovementTableColumns.tsx
│   │   ├── PrescriptionDetailsTable.tsx
│   │   ├── PrescriptionMedicamentsCardTable.tsx
│   │   ├── PrescriptionServicesCardTable.tsx
│   │   ├── ShowsPDetailsDialog.tsx
│   │   └── StorageMovementDetail.tsx
│   ├── CreateOutgoingDialog.tsx      # Diálogo para crear salidas (comentado)
│   ├── CreateOutgoingForm.tsx        # Formulario para crear salidas (comentado)
│   ├── DeactivateOutgoingDialog.tsx  # Diálogo para desactivar (comentado)
│   ├── LoadingDialogForm.tsx         # Componente de carga
│   ├── PrescriptionsTableToolbarActions.tsx  # Acciones de la barra de herramientas
│   ├── ProductSalePopover.tsx        # Popover de detalles de productos
│   ├── ProductSaleTable.tsx          # Tabla principal de productos
│   ├── ProductSaleTableColumns.tsx   # Columnas de la tabla
│   ├── ReactivateOutgoingDialog.tsx  # Diálogo para reactivar (comentado)
│   └── UpdateOutgoingSheet.tsx       # Hoja de actualización (comentado)
├── _hooks/
│   ├── useSelectProducts.ts          # Hook para selección de productos
│   └── useUnifiedProductStock.ts     # Hook unificado para stock de productos
├── _interfaces/
│   └── prescription.interface.ts     # Interfaces de prescripciones
├── _statics/
│   ├── errors.ts                     # Mensajes de error
│   ├── forms.ts                      # Configuración de formularios
│   └── metadata.ts                   # Metadatos del módulo
├── error.tsx                         # Página de error
├── loading.tsx                       # Página de carga
└── page.tsx                          # Página principal
```

## 🚀 Funcionalidades Principales

### **Gestión de Productos para Venta**
- **Visualización de Stock**: Lista de productos disponibles para venta
- **Filtrado por Sucursal**: Filtros avanzados por ubicación
- **Selección Múltiple**: Selección de múltiples productos para venta
- **Validación de Stock**: Verificación automática de disponibilidad

### **Proceso de Venta**
- **Creación de Órdenes**: Generación de órdenes de venta
- **Cálculo Automático**: Precios, impuestos y totales
- **Gestión de Pacientes**: Asociación con pacientes
- **Métodos de Pago**: Soporte para diferentes formas de pago

### **Integración con Prescripciones**
- **Visualización de Recetas**: Detalles de prescripciones médicas
- **Medicamentos y Servicios**: Separación por tipo de prescripción
- **Asociación de Productos**: Vinculación con inventario

### **Características Avanzadas**
- **Responsive Design**: Adaptación a diferentes dispositivos
- **Validaciones en Tiempo Real**: Verificación de datos
- **Gestión de Estados**: Control de carga y errores
- **Optimistic Updates**: Actualizaciones inmediatas de UI

## 🏗️ Arquitectura Técnica

### **Server Actions**
```typescript
// prescriptions.actions.ts
export async function getPatientsPrescription(limit = 10, offset = 0)
export async function getPrescriptionsWithPatient(limit = 10, offset = 0)
export async function getPatientPrescriptionsByDni(dni: string)
```

### **Custom Hooks**

#### **useSelectProducts.ts**
```typescript
// Gestión de estado para productos seleccionados
const useSelectedProducts = () => OutgoingProductStock[]
const useSelectProductDispatch = () => (action: Action) => void

// Acciones disponibles:
// - append: Agregar productos
// - replace: Reemplazar lista
// - remove: Eliminar producto específico
// - clear: Limpiar selección
```

#### **useUnifiedProductStock.ts**
```typescript
// Hook unificado para gestión de stock
export function useUnifiedProductsStock() {
  return {
    data: OutgoingProductStock[],
    isLoading: boolean,
    isError: boolean,
    filter: ProductsStockFilter,
    setFilterAllForSaleProductsStock: (limit?, offset?) => void,
    setFilterForSaleProductsStockByBranch: (branchId: string) => void
  }
}
```

### **Interfaces Principales**

#### **Prescription Interfaces**
```typescript
export type PrescriptionItemResponse = {
  id?: string;
  name?: string;
  quantity?: number;
  description?: string;
}

export type PrescriptionWithPatient = {
  id: string;
  patient: PrescriptionPatient;
  prescriptionMedicaments: PrescriptionItemResponse[];
  prescriptionServices: PrescriptionItemResponse[];
  // ... otros campos
}
```

## 🎨 Componentes Principales

### **ProductSaleTable.tsx**
```typescript
// Tabla principal de productos para venta
interface ProductStockTableProps {
  data: OutgoingProductStock[];
}

// Características:
// - Selección múltiple con checkboxes
// - Columnas configurables
// - Acciones de barra de herramientas
// - Integración con filtros
```

### **CreateProductSaleBillingOrderDialog.tsx**
```typescript
// Diálogo para crear órdenes de venta
export function CreateProductSaleBillingOrderDialog() {
  // Características:
  // - Formulario completo de venta
  // - Selección de productos
  // - Cálculo automático de totales
  // - Validaciones en tiempo real
  // - Responsive (Dialog/Drawer)
}
```

### **SelectProductDialog.tsx**
```typescript
// Diálogo para seleccionar productos
interface SelectProductDialogProps {
  form: UseFormReturn<CreateProductSaleBillingInput>;
}

// Características:
// - Tabla de productos disponibles
// - Filtros por almacén
// - Selección múltiple
// - Validación de stock
```

### **ProductSalePopover.tsx**
```typescript
// Popover con detalles de stock
interface ProductStockDetailProps {
  productStock: OutgoingProductStock;
}

// Características:
// - Detalles por almacén
// - Stock total
// - Información de sucursal
```

## 📊 Página Principal

### **page.tsx**
```typescript
export default function PageOrders() {
  // Funcionalidades:
  // - Filtrado por sucursal
  // - Gestión de estado de carga
  // - Manejo de errores
  // - Integración con hooks unificados
  // - Componentes de tabla y filtros
}
```

### **Características de la Página**
- **Header con Metadatos**: Título, descripción e icono
- **Filtros Dinámicos**: Por sucursal con opción "Todas"
- **Tabla Responsive**: Con selección múltiple
- **Estados de Carga**: Loading, error y éxito
- **Acciones de Toolbar**: Crear venta, filtros

## 🔧 Configuración y Estáticos

### **Metadata**
```typescript
export const METADATA: PageMetadata = {
  title: "Venta de Productos",
  entityName: "Venta",
  entityPluralName: "Ventas",
  description: "Gestiona las ventas de productos de tu negocio...",
  Icon: HandCoins,
}
```

### **Formularios**
```typescript
export const CREATE_PRESCRIPTION_ORDER_FORMSTATICS = {
  products: {
    required: true,
    type: "array",
    subFields: {
      productId: { required: true, type: "select" },
      quantity: { required: true, type: "number" },
      storageId: { required: true, type: "text" }
    }
  },
  patientId: { required: true, type: "select" },
  branchId: { required: true, type: "text" },
  paymentMethod: { required: true, type: "text" },
  // ... otros campos
}
```

### **Mensajes de Error**
```typescript
export const ERRORS: ErrorMessages = {
  loading: "Ha ocurrido un error al cargar las ventas de productos.",
  notFound: "No se encontraron ventas de productos.",
  generic: "Ha ocurrido un error inesperado.",
  create: "Ha ocurrido un error al crear la venta de productos.",
  // ... otros mensajes
}
```

## 🔄 Flujo de Trabajo

### **1. Visualización de Productos**
1. Carga inicial de productos disponibles para venta
2. Filtrado por sucursal (opcional)
3. Visualización en tabla con información de stock

### **2. Selección de Productos**
1. Apertura del diálogo de selección
2. Filtrado y búsqueda de productos
3. Selección múltiple con validación de stock
4. Confirmación y cierre del diálogo

### **3. Creación de Venta**
1. Apertura del formulario de venta
2. Selección de paciente (opcional)
3. Configuración de productos y cantidades
4. Selección de método de pago
5. Validación y envío

### **4. Procesamiento**
1. Validación de stock en tiempo real
2. Cálculo automático de totales
3. Generación de orden de facturación
4. Actualización de inventario
5. Confirmación y redirección

## 🎯 Integración con Otros Módulos

### **Inventario (Stock)**
- **Consulta de Disponibilidad**: Verificación de stock en tiempo real
- **Actualización Automática**: Modificación de inventario al vender
- **Filtrado por Uso**: Solo productos marcados para venta

### **Prescripciones**
- **Visualización de Recetas**: Detalles de prescripciones médicas
- **Asociación de Productos**: Vinculación con medicamentos recetados
- **Historial de Pacientes**: Consulta de prescripciones por DNI

### **Órdenes**
- **Generación Automática**: Creación de órdenes de facturación
- **Integración de Pagos**: Procesamiento de transacciones
- **Seguimiento de Estado**: Control de estados de órdenes

## 🛡️ Validaciones y Seguridad

### **Validaciones de Formulario**
- **Campos Requeridos**: Validación de campos obligatorios
- **Tipos de Datos**: Verificación de tipos correctos
- **Rangos Válidos**: Cantidades y precios positivos
- **Stock Disponible**: Verificación de disponibilidad

### **Validaciones de Negocio**
- **Stock Suficiente**: Cantidad disponible vs solicitada
- **Productos Activos**: Solo productos habilitados
- **Sucursal Válida**: Verificación de permisos por sucursal
- **Paciente Válido**: DNI y datos correctos

## 📱 Responsive Design

### **Desktop (≥640px)**
- **Dialog**: Ventanas modales completas
- **Tabla Completa**: Todas las columnas visibles
- **Formularios Expandidos**: Campos en múltiples columnas

### **Mobile (<640px)**
- **Drawer**: Paneles deslizables
- **Tabla Adaptativa**: Columnas esenciales
- **Formularios Compactos**: Campos en una columna

## 🧪 Testing y Calidad

### **Casos de Prueba Recomendados**
1. **Carga de Productos**: Verificar carga correcta de datos
2. **Filtrado**: Probar filtros por sucursal
3. **Selección**: Validar selección múltiple
4. **Validaciones**: Probar límites de stock
5. **Responsive**: Verificar en diferentes dispositivos

### **Métricas de Rendimiento**
- **Tiempo de Carga**: < 2 segundos para tabla inicial
- **Responsividad**: < 100ms para interacciones
- **Validación**: < 500ms para cálculos automáticos

## 🔧 Configuración de Desarrollo

### **Variables de Entorno**
```env
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1
```

### **Dependencias Principales**
```json
{
  "@tanstack/react-query": "^5.64.1",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-drawer": "latest"
}
```

## 📈 Mejoras Futuras

### **Funcionalidades Planificadas**
- **Descuentos**: Sistema de descuentos por producto
- **Promociones**: Gestión de ofertas especiales
- **Reportes**: Generación de reportes de ventas
- **Integración POS**: Conexión con terminales de punto de venta

### **Optimizaciones Técnicas**
- **Caché Inteligente**: Mejora en gestión de caché
- **Lazy Loading**: Carga diferida de componentes
- **Web Workers**: Cálculos en background
- **Service Workers**: Funcionalidad offline

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
