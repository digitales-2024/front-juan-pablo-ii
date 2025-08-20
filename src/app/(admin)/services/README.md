# 🏥 Módulo de Servicios (Services) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Servicios** administra el catálogo de servicios que ofrece la clínica Juan Pablo II, así como los **tipos de servicio**. Incluye creación, actualización, desactivación y reactivación de servicios y tipos, además de su visualización en tablas con filtros y acciones masivas.

## 📁 Estructura del Módulo

```
services/
├── _actions/
│   ├── service.actions.ts                 # Server Actions de servicios
│   └── service-type.actions.ts            # Server Actions de tipos de servicio
├── _components/
│   ├── CreateServiceDialog.tsx            # Diálogo para crear servicio
│   ├── CreateServiceForm.tsx              # Formulario para crear servicio
│   ├── UpdateServiceSheet.tsx             # Sheet para editar servicio
│   ├── DeactivateServiceDialog.tsx        # Diálogo para desactivar servicios
│   ├── ReactivateServiceDialog.tsx        # Diálogo para reactivar servicios
│   ├── ServicesTable.tsx                  # Tabla principal de servicios
│   ├── ServicesTableColumns.tsx           # Columnas de la tabla de servicios
│   ├── ServicesTableToolbarActions.tsx    # Acciones de la tabla de servicios
│   ├── CreateServiceTypeDialog.tsx        # Diálogo para crear tipo de servicio
│   ├── CreateServiceTypeForm.tsx          # Formulario para crear tipo
│   ├── UpdateServiceTypeSheet.tsx         # Sheet para editar tipo de servicio
│   ├── DeactivateServiceTypeDialog.tsx    # Desactivar tipos de servicio
│   ├── ReactivateServiceTypeDialog.tsx    # Reactivar tipos de servicio
│   ├── ServiceTypeTable.tsx               # Tabla de tipos de servicio
│   └── ServiceTypeTableColumns.tsx        # Columnas de la tabla de tipos
├── _hooks/
│   ├── useServices.ts                     # Hook principal para servicios
│   └── useServiceTypes.ts                 # Hook para tipos de servicio
├── _interfaces/
│   ├── service.interface.ts               # Tipos/DTOs y schemas de servicios
│   └── service-type.interface.ts          # Tipos/DTOs y schemas de tipos
├── page.tsx                               # Página de servicios
└── types/page.tsx                         # Página de tipos de servicio
```

## 🔧 Interfaces y Tipos

### Servicios

```typescript
// src/app/(admin)/services/_interfaces/service.interface.ts
export type Service = components['schemas']['Service'];
export type CreateServiceDto = components['schemas']['CreateServiceDto'];
export type UpdateServiceDto = components['schemas']['UpdateServiceDto'];
export type DeleteServicesDto = components['schemas']['DeleteServicesDto'];

export const createServiceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().transform(v => v === "" ? undefined : v).optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  serviceTypeId: z.string().min(1, "El tipo de servicio es requerido"),
}) satisfies z.ZodType<CreateServiceDto>;

export const updateServiceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().transform(v => v === "" ? undefined : v).optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0").optional(),
  serviceTypeId: z.string().min(1, "El tipo de servicio es requerido").optional(),
}) satisfies z.ZodType<UpdateServiceDto>;
```

### Tipos de Servicio

```typescript
// src/app/(admin)/services/_interfaces/service-type.interface.ts
export type ServiceType = components['schemas']['ServiceType'];
export type CreateServiceTypeDto = components['schemas']['CreateServiceTypeDto'];
export type UpdateServiceTypeDto = components['schemas']['UpdateServiceTypeDto'];
export type DeleteServiceTypesDto = components['schemas']['DeleteServiceTypesDto'];

export const createServiceTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().transform(v => v === "" ? undefined : v).optional(),
}) satisfies z.ZodType<CreateServiceTypeDto>;

export const updateServiceTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().transform(v => v === "" ? undefined : v).optional(),
}) satisfies z.ZodType<UpdateServiceTypeDto>;
```

## 🎣 Hooks del Módulo

### useServices

```typescript
// src/app/(admin)/services/_hooks/useServices.ts
export const useServices = () => {
  const queryClient = useQueryClient();

  // Query lista de servicios
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await getServices({});
      if (!response || response.error || !response.data) {
        throw new Error(response?.error ?? "Error desconocido");
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Obtener un servicio por id
  function useOneServiceQuery(serviceId: string) {
    return useQuery({
      queryKey: ["service", serviceId],
      queryFn: async () => {
        const response = await getServiceById(serviceId);
        if (!response || "error" in response) throw new Error(response?.error ?? "Sin respuesta");
        return response;
      },
      staleTime: 1000 * 60 * 5,
    });
  }

  // Mutations CRUD
  const createMutation = useMutation<BaseApiResponse<Service>, Error, CreateServiceDto>({
    mutationFn: async (data) => {
      const response = await createService(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Service[]>(["services"], (old) => (old ? [...old, res.data] : [res.data]));
      toast.success(res.message);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = useMutation<BaseApiResponse<Service>, Error, { id: string; data: UpdateServiceDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await updateService(id, data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Service[]>(["services"], (old) =>
        (old ?? []).map((s) => (s.id === res.data.id ? res.data : s))
      );
      toast.success("Servicio actualizado exitosamente");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation<BaseApiResponse<Service>, Error, DeleteServicesDto>({
    mutationFn: async (data) => {
      const response = await deleteServices(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Service[]>(["services"], (old) =>
        (old ?? []).map((s) => (variables.ids.includes(s.id) ? { ...s, isActive: false } : s))
      );
      toast.success(variables.ids.length === 1 ? "Servicio desactivado exitosamente" : "Servicios desactivados exitosamente");
    },
    onError: (e) => toast.error(e.message),
  });

  const reactivateMutation = useMutation<BaseApiResponse<Service>, Error, DeleteServicesDto>({
    mutationFn: async (data) => {
      const response = await reactivateServices(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Service[]>(["services"], (old) =>
        (old ?? []).map((s) => (variables.ids.includes(s.id) ? { ...s, isActive: true } : s))
      );
      toast.success(variables.ids.length === 1 ? "Servicio reactivado exitosamente" : "Servicios reactivados exitosamente");
    },
    onError: (e) => toast.error(e.message),
  });

  return { servicesQuery, useOneServiceQuery, createMutation, updateMutation, deleteMutation, reactivateMutation };
};
```

### useServiceTypes

```typescript
// src/app/(admin)/services/_hooks/useServiceTypes.ts
export const useServiceTypes = () => {
  const queryClient = useQueryClient();

  const serviceTypesQuery = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: async () => {
      const response = await getServiceTypes({});
      if (!response || response.error || !response.data) throw new Error(response?.error ?? "Error");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation<BaseApiResponse<ServiceType>, Error, CreateServiceTypeDto>({
    mutationFn: async (data) => {
      const response = await createServiceType(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<ServiceType[]>(["serviceTypes"], (old) => (old ? [...old, res.data] : [res.data]));
      toast.success(res.message);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = useMutation<BaseApiResponse<ServiceType>, Error, { id: string; data: UpdateServiceTypeDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await updateServiceType(id, data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<ServiceType[]>(["serviceTypes"], (old) =>
        (old ?? []).map((t) => (t.id === res.data.id ? res.data : t))
      );
      toast.success("Tipo de servicio actualizado exitosamente");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation<BaseApiResponse<ServiceType>, Error, DeleteServiceTypesDto>({
    mutationFn: async (data) => {
      const response = await deleteServiceTypes(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<ServiceType[]>(["serviceTypes"], (old) =>
        (old ?? []).map((t) => (variables.ids.includes(t.id) ? { ...t, isActive: false } : t))
      );
      toast.success(variables.ids.length === 1 ? "Tipo de servicio desactivado exitosamente" : "Tipos de servicio desactivados exitosamente");
    },
    onError: (e) => toast.error(e.message),
  });

  const reactivateMutation = useMutation<BaseApiResponse<ServiceType>, Error, DeleteServiceTypesDto>({
    mutationFn: async (data) => {
      const response = await reactivateServiceTypes(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<ServiceType[]>(["serviceTypes"], (old) =>
        (old ?? []).map((t) => (variables.ids.includes(t.id) ? { ...t, isActive: true } : t))
      );
      toast.success(variables.ids.length === 1 ? "Tipo de servicio reactivado exitosamente" : "Tipos de servicio reactivados exitosamente");
    },
    onError: (e) => toast.error(e.message),
  });

  return { serviceTypesQuery, serviceTypes: serviceTypesQuery.data, createMutation, updateMutation, deleteMutation, reactivateMutation };
};
```

## 🚀 Server Actions

```typescript
// src/app/(admin)/services/_actions/service.actions.ts
export const getServices = await createSafeAction(GetServicesSchema, async () => {
  const [services, error] = await http.get<Service[]>("/services");
  if (error) return { error: typeof error === 'object' && error && 'message' in error ? String(error.message) : 'Error al obtener los servicios' };
  if (!Array.isArray(services)) return { error: 'Respuesta inválida del servidor' };
  return { data: services };
});

export async function getServiceById(id: string) { /* GET /services/:id */ }
export async function createService(data: CreateServiceDto) { /* POST /services */ }
export async function updateService(id: string, data: UpdateServiceDto) { /* PATCH /services/:id */ }
export async function deleteServices(data: DeleteServicesDto) { /* DELETE /services/remove/all */ }
export async function reactivateServices(data: DeleteServicesDto) { /* PATCH /services/reactivate/all */ }
```

```typescript
// src/app/(admin)/services/_actions/service-type.actions.ts
export const getServiceTypes = await createSafeAction(GetServiceTypesSchema, async () => {
  const [serviceTypes, error] = await http.get<ServiceType[]>("/service-types");
  if (error) return { error: typeof error === 'object' && error && 'message' in error ? String(error.message) : 'Error al obtener los tipos de servicio' };
  if (!Array.isArray(serviceTypes)) return { error: 'Respuesta inválida del servidor' };
  return { data: serviceTypes };
});

export async function createServiceType(data: CreateServiceTypeDto) { /* POST /service-types */ }
export async function updateServiceType(id: string, data: UpdateServiceTypeDto) { /* PATCH /service-types/:id */ }
export async function deleteServiceTypes(data: DeleteServiceTypesDto) { /* DELETE /service-types/remove/all */ }
export async function reactivateServiceTypes(data: DeleteServiceTypesDto) { /* PATCH /service-types/reactivate/all */ }
```

## 🎨 Componentes del Módulo

### Tabla de Servicios

```typescript
// ServicesTable.tsx
export function ServicesTable({ data }: { data: Service[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre o descripción..."
      toolbarActions={(table) => <ServicesTableToolbarActions table={table} />}
    />
  );
}
```

```typescript
// ServicesTableColumns.tsx (fragmento)
export const columns: ColumnDef<Service>[] = [
  { id: "select", /* checkbox de selección */ },
  { accessorKey: "name", header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" /> },
  { accessorKey: "description", header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" /> },
  { accessorKey: "price", header: ({ column }) => <DataTableColumnHeader column={column} title="Precio" />,
    cell: ({ row }) => `S/ ${(row.original.price).toFixed(2)}` },
  { accessorKey: "isActive", header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => <Badge variant={row.original.isActive ? "success" : "destructive"}>{row.original.isActive ? "Activo" : "Inactivo"}</Badge> },
  { id: "Acciones", /* Dropdown: editar, desactivar, reactivar */ },
];
```

### Creación y Edición

```typescript
// CreateServiceDialog.tsx
// Abre Dialog/Drawer con <CreateServiceForm /> y usa useServices().createMutation

// UpdateServiceSheet.tsx
// Sheet para editar con Zod + RHF, y useServices().updateMutation
```

### Tipos de Servicio (UI)

- `ServiceTypeTable.tsx`, `ServiceTypeTableColumns.tsx`, `CreateServiceTypeDialog.tsx`, `UpdateServiceTypeSheet.tsx`, `DeactivateServiceTypeDialog.tsx`, `ReactivateServiceTypeDialog.tsx` replican las mismas funcionalidades para la entidad "Tipo de Servicio".

## 🔄 Guías de Implementación

### Agregar un nuevo campo a Servicio

1) Actualizar DTO y schema:
```typescript
// _interfaces/service.interface.ts
export const createServiceSchema = z.object({
  // ...
  durationMinutes: z.number().min(0).optional(), // ← nuevo campo
}) satisfies z.ZodType<CreateServiceDto & { durationMinutes?: number }>;
```

2) Actualizar formularios:
```tsx
// CreateServiceForm.tsx
<FormField name="durationMinutes" render={({ field }) => (
  <FormItem>
    <FormLabel>Duración (min)</FormLabel>
    <FormControl>
      <Input type="number" min={0} {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)} />
```

3) Actualizar columnas si se desea mostrar:
```typescript
{ accessorKey: "durationMinutes", header: "Duración (min)", cell: ({ row }) => row.original.durationMinutes ?? "-" },
```

4) Validar en server actions si aplica (backend).

### Validaciones personalizadas

- Precios mínimos por tipo de servicio:
```typescript
export const createServiceSchema = z.object({
  // ...
  price: z.number().min(0),
  serviceTypeId: z.string().min(1),
}).refine(({ price, serviceTypeId }) => {
  // regla de negocio (ejemplo): tipos X requieren precio >= 50
  return serviceTypeId !== 'X' || price >= 50;
}, { message: 'El precio mínimo para este tipo es S/ 50', path: ['price'] });
```

### Estados y acciones masivas

- Para desactivar/activar varios servicios o tipos, se usan `DeleteServicesDto` y `DeleteServiceTypesDto` con arreglo de `ids` en los diálogos `Deactivate*`/`Reactivate*`.

## 🧪 Testing del Módulo

- Creación de servicio: campos requeridos, validación de precio, asociación a tipo.
- Actualización: edición de nombre, precio, tipo; validación de reglas.
- Desactivación/React.: selección múltiple, cambios de estado en caché (React Query).
- UI: columnas, formateo de precio, badges de estado, diálogos de confirmación.
- Hooks: estados de loading/error, actualización de caché en onSuccess.

## 📈 Métricas y Monitoreo

- Total de servicios activos vs inactivos.
- Distribución por tipo de servicio.
- Precio promedio por tipo.
- Tasa de creación/edición por periodo.

Logs recomendados en server actions:
```ts
console.log(`🧾 [SERVICES] Creando servicio: ${data.name}`);
console.log(`🧾 [SERVICES] Actualizando servicio: ${id}`);
console.log(`🧾 [SERVICES] Desactivando servicios: ${data.ids.join(',')}`);
console.log(`🧾 [SERVICES] Reactivando servicios: ${data.ids.join(',')}`);
```

## 🔒 Seguridad y Permisos

- Verificar permisos por operación (create/update/delete/reactivate).
- Validar datos con Zod (cliente) y nuevamente en el backend.
- Manejo de errores 401/403 con mensajes de `No autorizado`.
- Evitar precios negativos o datos inconsistentes.

Permisos sugeridos:
- `services:read`, `services:create`, `services:update`, `services:delete`, `services:reactivate`.
- `serviceTypes:*` análogo para tipos de servicio.

---

Versión: 1.0.0  
Última actualización: Diciembre 2024  
Mantenido por: Equipo de desarrollo Juan Pablo II
