# 🏢 Módulo de Sucursales (Branches) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Sucursales** permite administrar las sucursales de la clínica (creación, edición, desactivación, reactivación y listado). Integra validaciones con Zod, formularios con React Hook Form, manejo de estado del servidor con React Query y Server Actions para comunicación con el backend.

## 📁 Estructura del Módulo

```
branches/
├── _actions/
│   └── branch.actions.ts                # Server Actions (CRUD + listas)
├── _components/
│   ├── BranchesTable.tsx                # Tabla principal
│   ├── BranchesTableColumns.tsx         # Columnas de la tabla
│   ├── BranchesTableToolbarActions.tsx  # Acciones de toolbar
│   ├── CreateBranchDialog.tsx           # Dialog/Drawer de creación
│   ├── CreateBranchForm.tsx             # Formulario de creación
│   ├── UpdateBranchSheet.tsx            # Sheet de edición
│   ├── DeactivateBranchDialog.tsx       # Desactivación (individual/masiva)
│   └── ReactivateBranchDialog.tsx       # Reactivación (individual/masiva)
├── _hooks/
│   └── useBranches.ts                   # Hook principal del módulo
├── _interfaces/
│   └── branch.interface.ts              # Tipos y schemas Zod
├── error.tsx                            # UI de error
├── loading.tsx                          # UI de carga
├── page.tsx                             # Página de listado de sucursales
└── README.md                            # Esta documentación
```

## 🔧 Interfaces y Tipos

```typescript
// src/app/(admin)/branches/_interfaces/branch.interface.ts
import { components } from "@/types/api";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

// Tipos base de la API
export type Branch = components['schemas']['Branch'];
export type CreateBranchDto = components['schemas']['CreateBranchDto'];
export type UpdateBranchDto = components['schemas']['UpdateBranchDto'];
export type DeleteBranchesDto = components['schemas']['DeleteBranchesDto'];

// Interfaz para tabla
export interface BranchTableItem extends Branch { selected?: boolean }

// Schemas Zod
export const createBranchSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string()
    .transform(val => val === "" ? undefined : val)
    .optional()
    .refine(value => !value || isValidPhoneNumber(value), {
      message: "El número de teléfono no es válido",
    }),
}) satisfies z.ZodType<CreateBranchDto>;

export const updateBranchSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  address: z.string().min(1, "La dirección es requerida").optional(),
  phone: z.string().optional(),
}) satisfies z.ZodType<UpdateBranchDto>;

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
```

## 🎣 Hooks del Módulo

```typescript
// src/app/(admin)/branches/_hooks/useBranches.ts
export const useBranches = () => {
  const queryClient = useQueryClient();

  // Listado de sucursales
  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await getBranches({});
      if (!response) throw new Error("No se recibió respuesta del servidor");
      if (response.error || !response.data) throw new Error(response.error ?? "Error desconocido");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Sucursales activas
  const activeBranchesQuery = useQuery({
    queryKey: ["active-branches"],
    queryFn: async () => {
      const response = await getActiveBranches({});
      if (!response) throw new Error("No se recibió respuesta del servidor");
      if (response.error || !response.data) throw new Error(response.error ?? "Error desconocido");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Una sucursal por ID
  function oneBranchQuery(id: string) {
    return useQuery<Branch, Error>({
      queryKey: ["branch", id],
      queryFn: async () => {
        const response = await getOneBranch(id);
        if (!response) throw new Error("No se recibió respuesta del servidor");
        if ("error" in response) throw new Error(response.error);
        return response;
      },
      staleTime: 1000 * 60 * 5,
    });
  }

  // Crear
  const createMutation = useMutation<BaseApiResponse<Branch>, Error, CreateBranchDto>({
    mutationFn: async (data) => {
      const response = await createBranch(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Branch[]>(["branches"], (old) => old ? [...old, res.data] : [res.data]);
      toast.success(res.message);
    },
    onError: (error) => toast.error(error.message),
  });

  // Actualizar
  const updateMutation = useMutation<BaseApiResponse<Branch>, Error, { id: string; data: UpdateBranchDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await updateBranch(id, data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Branch[]>(["branches"], (old) =>
        (old ?? []).map((b) => (b.id === res.data.id ? res.data : b))
      );
      toast.success("Sucursal actualizada exitosamente");
    },
    onError: (error) => {
      if (/(No autorizado|Unauthorized)/i.test(error.message)) toast.error("No tienes permisos para realizar esta acción");
      else toast.error(error.message || "Error al actualizar la sucursal");
    },
  });

  // Desactivar
  const deleteMutation = useMutation<BaseApiResponse<Branch>, Error, DeleteBranchesDto>({
    mutationFn: async (data) => {
      const response = await deleteBranches(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Branch[]>(["branches"], (old) =>
        (old ?? []).map((b) => (variables.ids.includes(b.id) ? { ...b, isActive: false } : b))
      );
      toast.success(variables.ids.length === 1 ? "Sucursal desactivada exitosamente" : "Sucursales desactivadas exitosamente");
    },
    onError: (error) => {
      if (/(No autorizado|Unauthorized)/i.test(error.message)) toast.error("No tienes permisos para realizar esta acción");
      else toast.error(error.message || "Error al desactivar la(s) sucursal(es)");
    },
  });

  // Reactivar
  const reactivateMutation = useMutation<BaseApiResponse<Branch>, Error, DeleteBranchesDto>({
    mutationFn: async (data) => {
      const response = await reactivateBranches(data);
      if ("error" in response) throw new Error(response.error);
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Branch[]>(["branches"], (old) =>
        (old ?? []).map((b) => (variables.ids.includes(b.id) ? { ...b, isActive: true } : b))
      );
      toast.success(variables.ids.length === 1 ? "Sucursal reactivada exitosamente" : "Sucursales reactivadas exitosamente");
    },
    onError: (error) => {
      if (/(No autorizado|Unauthorized)/i.test(error.message)) toast.error("No tienes permisos para realizar esta acción");
      else toast.error(error.message || "Error al reactivar la(s) sucursal(es)");
    },
  });

  return { branchesQuery, activeBranchesQuery, oneBranchQuery, createMutation, updateMutation, deleteMutation, reactivateMutation };
};
```

## 🚀 Server Actions

```typescript
// src/app/(admin)/branches/_actions/branch.actions.ts
export const getBranches = await createSafeAction(GetBranchesSchema, async () => {
  const [branches, error] = await http.get<Branch[]>("/branch");
  if (error) return { error: typeof error === 'object' && error && 'message' in error ? String(error.message) : 'Error al obtener las sucursales' };
  if (!Array.isArray(branches)) return { error: 'Respuesta inválida del servidor' };
  return { data: branches };
});

export const getActiveBranches = await createSafeAction(GetBranchesSchema, async () => {
  const [branches, error] = await http.get<Branch[]>("/branch/active");
  if (error) return { error: typeof error === 'object' && error && 'message' in error ? String(error.message) : 'Error al obtener las sucursales' };
  if (!Array.isArray(branches)) return { error: 'Respuesta inválida del servidor' };
  return { data: branches };
});

export const getOneBranch = async (id: string) => { /* GET /branch/:id */ };
export async function createBranch(data: CreateBranchDto) { /* POST /branch */ }
export async function updateBranch(id: string, data: UpdateBranchDto) { /* PATCH /branch/:id */ }
export async function deleteBranches(data: DeleteBranchesDto) { /* DELETE /branch/remove/all */ }
export async function reactivateBranches(data: DeleteBranchesDto) { /* PATCH /branch/reactivate/all */ }
```

## 🎨 Componentes del Módulo

### Tabla principal

```typescript
// BranchesTable.tsx
export function BranchesTable({ data }: { data: Branch[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre o dirección..."
      toolbarActions={(table) => <BranchesTableToolbarActions table={table} />}
    />
  );
}
```

```typescript
// BranchesTableColumns.tsx (fragmento)
export const columns: ColumnDef<Branch>[] = [
  { id: "select", /* checkbox de selección */ },
  { accessorKey: "name", header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" /> },
  { accessorKey: "address", header: ({ column }) => <DataTableColumnHeader column={column} title="Dirección" /> },
  { accessorKey: "phone", header: ({ column }) => <DataTableColumnHeader column={column} title="Teléfono" />, cell: ({ row }) => row.original.phone ?? "---" },
  { accessorKey: "isActive", header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />, cell: ({ row }) => <Badge variant={row.original.isActive ? "success" : "destructive"}>{row.original.isActive ? "Activo" : "Inactivo"}</Badge> },
  { id: "Acciones", /* Dropdown: editar, desactivar, reactivar */ },
];
```

### Crear y Editar

```tsx
// CreateBranchDialog.tsx
// - Usa RHF + zodResolver(createBranchSchema)
// - Dialog/Drawer según media-query
// - onSubmit => useBranches().createMutation

// UpdateBranchSheet.tsx
// - Sheet con RHF + zodResolver(updateBranchSchema)
// - onSubmit => useBranches().updateMutation
// - Campo phone integra <PhoneInput /> con defaultCountry="PE"
```

### Desactivar / Reactivar

- `DeactivateBranchDialog.tsx` y `ReactivateBranchDialog.tsx` soportan acciones individuales o masivas usando arreglos de `ids` y las mutaciones correspondientes (`deleteMutation`, `reactivateMutation`).

## 🔄 Guías de Implementación

### Agregar un nuevo campo (ej. `managerName`)

1) Actualizar tipos y schemas:
```ts
// branch.interface.ts
export const createBranchSchema = z.object({
  // ...
  managerName: z.string().min(1, "El nombre del encargado es requerido").optional(),
}) satisfies z.ZodType<CreateBranchDto & { managerName?: string }>;

export const updateBranchSchema = z.object({
  managerName: z.string().min(1).optional(),
}) satisfies z.ZodType<UpdateBranchDto & { managerName?: string }>;
```

2) Actualizar formularios:
```tsx
// CreateBranchForm.tsx / UpdateBranchSheet.tsx
<FormField name="managerName" render={({ field }) => (
  <FormItem>
    <FormLabel>Encargado</FormLabel>
    <FormControl>
      <Input placeholder="Nombre del encargado" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)} />
```

3) Mostrar en tabla (opcional):
```ts
{ accessorKey: "managerName", header: "Encargado", cell: ({ row }) => row.original.managerName ?? "---" },
```

### Validaciones personalizadas

- Validar formato de teléfono (ya implementado con `isValidPhoneNumber`).
- Reglas de negocio propias (ej. dirección única por nombre) pueden añadirse con `refine` en el schema o en el backend.

### Acciones masivas

- Para desactivar/reactivar múltiples sucursales, construir `DeleteBranchesDto` con `{ ids: string[] }` y usar los diálogos provistos. La caché se actualiza en `onSuccess` para reflejar estados.

## 🧪 Testing del Módulo

- Crear sucursal: requeridos (`name`, `address`), teléfono opcional válido.
- Editar sucursal: actualización de uno/múltiples campos.
- Desactivar/React. masivo: selección múltiple, actualización de caché React Query.
- UI: tabla, columnas, badges de estado, diálogos de confirmación, formularios con error states.
- Hooks: estados `isLoading`, `isError`, `onSuccess` actualiza caché local.

## 📈 Métricas y Monitoreo

- Total de sucursales activas vs inactivas.
- Distribución por ciudad/zona (si aplica como campo adicional).
- Tasa de creación/edición por periodo.

Logs recomendados:
```ts
console.log(`🏢 [BRANCH] Creando sucursal: ${data.name}`);
console.log(`🏢 [BRANCH] Actualizando sucursal: ${id}`);
console.log(`🏢 [BRANCH] Desactivando sucursales: ${data.ids.join(',')}`);
console.log(`🏢 [BRANCH] Reactivando sucursales: ${data.ids.join(',')}`);
```

## 🔒 Seguridad y Permisos

- Autorización para operaciones de escritura (create/update/delete/reactivate).
- Manejo de errores 401 con mensajes amigables.
- Sanitización de entradas y validación en cliente + servidor.

Permisos sugeridos:
- `branches:read`, `branches:create`, `branches:update`, `branches:delete`, `branches:reactivate`.

---

Versión: 1.0.0  
Última actualización: Diciembre 2024  
Mantenido por: Equipo de desarrollo Juan Pablo II
