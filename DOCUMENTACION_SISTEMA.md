# Documentación del Sistema - Clínica Juan Pablo II

## 📋 Descripción General

El **Sistema de Gestión Juan Pablo II** es una aplicación web moderna diseñada para la gestión integral de una clínica estética. El sistema permite administrar citas médicas, pacientes, personal médico, servicios, inventario, facturación y más, proporcionando una interfaz completa para la operación diaria de la clínica.

## 🏗️ Arquitectura del Sistema

### **Frontend (Next.js 15)**
- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **UI Framework**: React 19
- **Estilos**: Tailwind CSS + Radix UI
- **Gestión de Estado**: Zustand + React Query (TanStack Query)
- **Formularios**: React Hook Form + Zod
- **Autenticación**: JWT con cookies httpOnly

### **Backend (API REST)**
- **URL Base**: `http://localhost:5000/api/v1` (desarrollo)
- **Autenticación**: JWT con access_token y refresh_token
- **Documentación**: OpenAPI/Swagger
- **Tipos**: Generación automática de tipos TypeScript desde Swagger

### **Base de Datos**
- **Tipo**: No especificado en el frontend (probablemente PostgreSQL/MySQL)
- **Entidades principales**: Usuarios, Pacientes, Personal, Servicios, Citas, Órdenes, Productos

## 🔧 Tecnologías Principales

### **Frontend**
```json
{
  "next": "15.1.4",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "@radix-ui/*": "Componentes UI",
  "@tanstack/react-query": "^5.64.1",
  "zustand": "^5.0.3",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1"
}
```

### **Herramientas de Desarrollo**
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Build Tool**: Turbopack
- **Contenedores**: Docker + Docker Compose

## 📁 Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── (admin)/                  # Rutas protegidas del admin
│   │   ├── (appointments)/       # Gestión de citas
│   │   ├── (consultations)/      # Consultas médicas
│   │   ├── (patient)/           # Gestión de pacientes
│   │   ├── (staff)/             # Personal médico
│   │   ├── (payment)/           # Facturación y pagos
│   │   ├── (inventory)/         # Inventario
│   │   ├── (catalog)/           # Catálogo de servicios
│   │   ├── (settings)/          # Configuraciones
│   │   ├── users/               # Gestión de usuarios
│   │   ├── roles/               # Roles y permisos
│   │   ├── branches/            # Sucursales
│   │   └── services/            # Servicios médicos
│   ├── (auth)/                  # Autenticación
│   │   └── sign-in/             # Login
│   └── (dashboard)/             # Dashboard principal
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes base (Radix UI)
│   ├── layout/                  # Componentes de layout
│   ├── providers/               # Providers de contexto
│   ├── data-table/              # Tablas de datos
│   └── common/                  # Componentes comunes
├── hooks/                       # Custom hooks
├── lib/                         # Utilidades y configuraciones
├── utils/                       # Funciones utilitarias
├── types/                       # Tipos TypeScript
├── context/                     # Contextos de React
└── middleware.ts                # Middleware de autenticación
```

## 🔐 Sistema de Autenticación

### **Flujo de Autenticación**
1. **Login**: POST `/api/v1/auth/login`
2. **Cookies**: Se establecen `access_token` y `refresh_token` como httpOnly
3. **Middleware**: Valida tokens en cada request
4. **Refresh**: Renovación automática de tokens expirados
5. **Logout**: Eliminación de cookies y redirección

### **Protección de Rutas**
- **Rutas públicas**: `/sign-in`
- **Rutas protegidas**: Todas las demás requieren autenticación
- **Middleware**: Intercepta requests y valida tokens

## 📊 Módulos Principales

### **1. Gestión de Usuarios**
- **CRUD** de usuarios del sistema
- **Roles y permisos**
- **Activación/desactivación** de usuarios

### **2. Gestión de Pacientes**
- **Registro** de pacientes
- **Historial médico**
- **Datos personales** (DNI, contacto, etc.)

### **3. Gestión de Personal**
- **Médicos y personal** médico
- **Especialidades** y CMP
- **Horarios** y disponibilidad

### **4. Gestión de Citas**
- **Agendamiento** de consultas
- **Calendario** interactivo
- **Estados**: PENDING, CONFIRMED, CANCELLED
- **Tipos**: CONSULTA, OTRO

### **5. Servicios Médicos**
- **Catálogo** de servicios
- **Precios** y descripciones
- **Categorías** de servicios

### **6. Facturación y Pagos**
- **Órdenes** de facturación
- **Métodos de pago**: CASH, BANK_TRANSFER, DIGITAL_WALLET
- **Prescripciones** médicas
- **Generación** de PDFs

### **7. Inventario**
- **Productos** médicos
- **Categorías** y tipos
- **Stock** y proveedores
- **Uso**: VENTA, INTERNO, OTRO

### **8. Sucursales**
- **Gestión** de múltiples ubicaciones
- **Configuración** por sucursal

## 🔄 Gestión de Estado

### **Zustand (Estado Global)**
- **Configuración** de la aplicación
- **Estado** de la UI (sidebar, modales, etc.)
- **Datos** compartidos entre componentes

### **React Query (Estado del Servidor)**
- **Caché** de datos del servidor
- **Sincronización** automática
- **Optimistic updates**
- **Invalidación** de queries

## 🌐 Comunicación con el Backend

### **Client Fetch (`src/utils/clientFetch.ts`)**
```typescript
// Para requests del lado del cliente
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true
});
```

### **Server Fetch (`src/utils/serverFetch.ts`)**
```typescript
// Para Server Actions y SSR
export async function serverFetch<Success>(
  url: string,
  options?: RequestInit
): Promise<Result<Success, ServerFetchError>>
```

### **Tipos Automáticos**
- **Generación**: `pnpm run generate-types`
- **Fuente**: Swagger/OpenAPI del backend
- **Archivo**: `src/types/api.ts`

## 🎨 UI/UX

### **Design System**
- **Radix UI**: Componentes accesibles y personalizables
- **Tailwind CSS**: Sistema de utilidades CSS
- **Lucide React**: Iconografía consistente
- **Framer Motion**: Animaciones fluidas

### **Responsive Design**
- **Mobile-first**: Diseño adaptativo
- **Breakpoints**: Tailwind CSS
- **Componentes**: Adaptables a diferentes tamaños

## 🚀 Despliegue

### **Desarrollo Local**
```bash
pnpm run dev          # Servidor de desarrollo
pnpm run build        # Build de producción
pnpm run start        # Servidor de producción
```

### **Docker**
- **Dockerfile**: Configuración de producción
- **Dockerfile.dev**: Configuración de desarrollo
- **docker-compose-dev.yml**: Orquestación local

### **Variables de Entorno**
```env
BACKEND_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_ENV=development
```

## 📈 Características Técnicas

### **Performance**
- **Turbopack**: Compilación rápida en desarrollo
- **Code Splitting**: Carga lazy de componentes
- **Image Optimization**: Next.js Image component
- **Caching**: React Query + HTTP caching

### **Seguridad**
- **JWT**: Autenticación segura
- **HttpOnly Cookies**: Protección contra XSS
- **CORS**: Configuración de origen
- **Input Validation**: Zod schemas

### **Accesibilidad**
- **Radix UI**: Componentes accesibles por defecto
- **ARIA Labels**: Etiquetas semánticas
- **Keyboard Navigation**: Navegación por teclado
- **Screen Reader**: Compatibilidad con lectores

## 🔧 Scripts Disponibles

```json
{
  "dev": "next dev --turbopack",
  "build": "next build --no-lint",
  "start": "next start",
  "lint": "next lint",
  "generate-types": "pnpx tsx ./src/types/generateTypes.ts"
}
```

## 📝 Notas de Desarrollo

### **Convenciones**
- **Archivos**: kebab-case
- **Componentes**: PascalCase
- **Hooks**: camelCase con prefijo `use`
- **Tipos**: PascalCase con sufijo descriptivo

### **Patrones**
- **Server Actions**: Para operaciones del servidor
- **Custom Hooks**: Para lógica reutilizable
- **Compound Components**: Para componentes complejos
- **Render Props**: Para flexibilidad

### **Testing**
- **ESLint**: Linting de código
- **TypeScript**: Verificación de tipos
- **Zod**: Validación de datos en runtime

---

**Versión**: 0.1.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
