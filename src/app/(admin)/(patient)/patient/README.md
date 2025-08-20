# 👥 Módulo de Pacientes (Patients) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Pacientes** gestiona toda la información relacionada con los pacientes de la clínica Juan Pablo II. Permite registrar, actualizar y administrar los datos personales, médicos y de contacto de cada paciente, así como su historial médico completo.

## 📁 Estructura del Módulo

```
patient/
├── _actions/
│   └── patient.actions.ts              # Server Actions para operaciones CRUD
├── _components/
│   ├── PatientTable.tsx               # Tabla principal de pacientes
│   ├── PatientTableColumns.tsx        # Definición de columnas
│   ├── PatientTableToolbarActions.tsx # Acciones de la toolbar
│   ├── CreatePatientDialog.tsx        # Diálogo de creación
│   ├── CreatePatientForm.tsx          # Formulario de creación
│   ├── UpdatePatientSheet.tsx         # Sheet de actualización
│   ├── DeactivatePatientDialog.tsx    # Diálogo de desactivación
│   ├── ReactivatePatientDialog.tsx    # Diálogo de reactivación
│   ├── LoadingDialogForm.tsx          # Diálogo de carga
│   └── errorComponents/               # Componentes de error
├── _hooks/
│   └── usePatient.ts                  # Hook principal del módulo
├── _interfaces/
│   └── patient.interface.ts           # Interfaces principales
├── _statics/
├── error.tsx                          # Página de error
├── loading.tsx                        # Página de carga
├── README.md                          # Esta documentación
└── page.tsx                           # Página principal
```

## 🔧 Interfaces y Tipos

### **Tipos Principales**

```typescript
// Tipos base de la API
export type Patient = components['schemas']['Patient'];
export type CreatePatientDto = components['schemas']['CreatePatientDto'];
export type UpdatePatientDto = components['schemas']['UpdatePatientDto'];

// Interfaz para la tabla
export type PatientTableItem = Patient & { selected?: boolean };

// Interfaz para respuesta paginada
export interface PaginatedPatientsResponse {
    patients: Patient[];
    total: number;
}

// Interfaz para datos del paciente
export interface PatientData {
    id: string;
    dni: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
```

### **Schemas de Validación**

```typescript
// Schema para crear paciente
export const createPatientSchema = z.object({
    dni: z.string()
        .min(8, "El DNI debe tener al menos 8 caracteres")
        .max(20, "El DNI no puede exceder 20 caracteres"),
    name: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    email: z.string()
        .email("Email inválido")
        .optional()
        .or(z.literal("")),
    phone: z.string()
        .min(7, "El teléfono debe tener al menos 7 caracteres")
        .max(15, "El teléfono no puede exceder 15 caracteres")
        .optional()
        .or(z.literal("")),
    address: z.string()
        .max(200, "La dirección no puede exceder 200 caracteres")
        .optional()
        .or(z.literal("")),
    birthDate: z.string()
        .optional()
        .or(z.literal("")),
    gender: z.enum(["MALE", "FEMALE", "OTHER"])
        .optional(),
});

// Schema para actualizar paciente
export const updatePatientSchema = z.object({
    dni: z.string()
        .min(8, "El DNI debe tener al menos 8 caracteres")
        .max(20, "El DNI no puede exceder 20 caracteres")
        .optional(),
    name: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres")
        .optional(),
    email: z.string()
        .email("Email inválido")
        .optional()
        .or(z.literal("")),
    phone: z.string()
        .min(7, "El teléfono debe tener al menos 7 caracteres")
        .max(15, "El teléfono no puede exceder 15 caracteres")
        .optional()
        .or(z.literal("")),
    address: z.string()
        .max(200, "La dirección no puede exceder 200 caracteres")
        .optional()
        .or(z.literal("")),
    birthDate: z.string()
        .optional()
        .or(z.literal("")),
    gender: z.enum(["MALE", "FEMALE", "OTHER"])
        .optional(),
});

// Schema para obtener pacientes
export const GetPatientsSchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
});

// Schema para obtener paciente por ID
export const GetPatientByIdSchema = z.object({
    id: z.string().min(1, "El ID del paciente es requerido"),
});
```

## 🎣 Hooks del Módulo

### **usePatient Hook**

```typescript
export const usePatients = () => {
    const queryClient = useQueryClient();

    // Query para obtener todos los pacientes
    const patientsQuery = useQuery({
        queryKey: ['patients'],
        queryFn: getPatients
    });

    // Query para obtener un paciente por ID
    const usePatientById = (id: string) => useQuery({
        queryKey: ['patient', id],
        queryFn: () => getPatientById(id),
        enabled: !!id
    });

    // Mutations para operaciones CRUD
    const createMutation = useMutation({
        mutationFn: createPatient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            toast.success("Paciente creado exitosamente");
        },
        onError: (error) => {
            toast.error("Error al crear el paciente");
            console.error("Error creating patient:", error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePatientDto }) =>
            updatePatient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            toast.success("Paciente actualizado exitosamente");
        },
        onError: (error) => {
            toast.error("Error al actualizar el paciente");
            console.error("Error updating patient:", error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deletePatients,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            toast.success("Pacientes eliminados exitosamente");
        },
        onError: (error) => {
            toast.error("Error al eliminar los pacientes");
            console.error("Error deleting patients:", error);
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: deactivatePatients,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            toast.success("Pacientes desactivados exitosamente");
        },
        onError: (error) => {
            toast.error("Error al desactivar los pacientes");
            console.error("Error deactivating patients:", error);
        }
    });

    const reactivateMutation = useMutation({
        mutationFn: reactivatePatients,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            toast.success("Pacientes reactivados exitosamente");
        },
        onError: (error) => {
            toast.error("Error al reactivar los pacientes");
            console.error("Error reactivating patients:", error);
        }
    });

    return {
        // Queries
        patients: patientsQuery.data?.data || [],
        isLoading: patientsQuery.isLoading,
        error: patientsQuery.error,
        usePatientById,
        // Mutations
        createMutation,
        updateMutation,
        deleteMutation,
        deactivateMutation,
        reactivateMutation
    };
};
```

## 🚀 Server Actions

### **Patient Actions**

```typescript
// Obtener pacientes
export const getPatients = createSafeAction(
    GetPatientsSchema,
    async (data: { page?: number; limit?: number; search?: string }) => {
        const { page = 1, limit = 10, search = "" } = data;
        const url = `/patients?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
        const [patients, error] = await http.get<Patient[]>(url);
        if (error) return { error: "Error al obtener pacientes" };
        return { data: patients };
    }
);

// Obtener pacientes paginados
export const getPatientsPaginated = createSafeAction(
    GetPatientsSchema,
    async (data: { page?: number; limit?: number; search?: string }) => {
        const { page = 1, limit = 10, search = "" } = data;
        const url = `/patients/paginated?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
        const [response, error] = await http.get<PaginatedPatientsResponse>(url);
        if (error) return { error: "Error al obtener pacientes paginados" };
        return { data: response };
    }
);

// Crear paciente
export const createPatient = createSafeAction(
    createPatientSchema,
    async (data: CreatePatientDto) => {
        const [response, error] = await http.post<Patient>("/patients", data);
        if (error) return { error: "Error al crear paciente" };
        return { data: response };
    }
);

// Actualizar paciente
export const updatePatient = createSafeAction(
    updatePatientSchema,
    async (id: string, data: UpdatePatientDto) => {
        const [response, error] = await http.patch<Patient>(`/patients/${id}`, data);
        if (error) return { error: "Error al actualizar paciente" };
        return { data: response };
    }
);

// Eliminar pacientes
export const deletePatients = createSafeAction(
    deletePatientsSchema,
    async (data: DeletePatientsDto) => {
        const [response, error] = await http.delete<BaseApiResponse>("/patients", { data });
        if (error) return { error: "Error al eliminar pacientes" };
        return { data: response };
    }
);

// Desactivar pacientes
export const deactivatePatients = createSafeAction(
    deactivatePatientsSchema,
    async (data: DeletePatientsDto) => {
        const [response, error] = await http.patch<BaseApiResponse>("/patients/deactivate", data);
        if (error) return { error: "Error al desactivar pacientes" };
        return { data: response };
    }
);

// Reactivar pacientes
export const reactivatePatients = createSafeAction(
    reactivatePatientsSchema,
    async (data: DeletePatientsDto) => {
        const [response, error] = await http.patch<BaseApiResponse>("/patients/reactivate", data);
        if (error) return { error: "Error al reactivar pacientes" };
        return { data: response };
    }
);

// Obtener paciente por ID
export const getPatientById = async (id: string) => {
    const [patient, error] = await http.get<Patient>(`/patients/${id}`);
    if (error) throw new Error("Error al obtener paciente");
    return patient;
};
```

## 🎨 Componentes del Módulo

### **PatientTable Component**

```typescript
interface PatientTableProps {
    patients: Patient[];
    onEdit: (patient: Patient) => void;
    onDelete: (ids: string[]) => void;
    onDeactivate: (ids: string[]) => void;
    onReactivate: (ids: string[]) => void;
    loading?: boolean;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
    onPageChange?: (page: number) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
    patients,
    onEdit,
    onDelete,
    onDeactivate,
    onReactivate,
    loading = false,
    pagination,
    onPageChange
}) => {
    return (
        <DataTable
            columns={patientColumns}
            data={patients}
            loading={loading}
            pagination={pagination}
            onPageChange={onPageChange}
        />
    );
};
```

### **PatientTableColumns Component**

```typescript
export const patientColumns: ColumnDef<PatientTableItem>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todo"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Seleccionar fila"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "dni",
        header: "DNI",
        cell: ({ row }) => <div className="font-medium">{row.getValue("dni")}</div>,
    },
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const email = row.getValue("email") as string;
            return email ? <div>{email}</div> : <div className="text-muted-foreground">-</div>;
        },
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string;
            return phone ? <div>{phone}</div> : <div className="text-muted-foreground">-</div>;
        },
    },
    {
        accessorKey: "birthDate",
        header: "Fecha de Nacimiento",
        cell: ({ row }) => {
            const birthDate = row.getValue("birthDate") as string;
            return birthDate ? (
                <div>{format(new Date(birthDate), "dd/MM/yyyy")}</div>
            ) : (
                <div className="text-muted-foreground">-</div>
            );
        },
    },
    {
        accessorKey: "gender",
        header: "Género",
        cell: ({ row }) => {
            const gender = row.getValue("gender") as string;
            const genderMap = {
                MALE: "Masculino",
                FEMALE: "Femenino",
                OTHER: "Otro"
            };
            return gender ? (
                <div>{genderMap[gender as keyof typeof genderMap] || gender}</div>
            ) : (
                <div className="text-muted-foreground">-</div>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: "Estado",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean;
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Fecha de Registro",
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt") as string;
            return <div>{format(new Date(createdAt), "dd/MM/yyyy")}</div>;
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const patient = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(patient)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewHistory(patient.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Historial
                        </DropdownMenuItem>
                        {patient.isActive ? (
                            <DropdownMenuItem onClick={() => onDeactivate([patient.id])}>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Desactivar
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => onReactivate([patient.id])}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Reactivar
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
```

### **CreatePatientForm Component**

```typescript
interface CreatePatientFormProps {
    onSubmit: (data: CreatePatientDto) => void;
    onCancel: () => void;
    loading?: boolean;
}

export const CreatePatientForm: React.FC<CreatePatientFormProps> = ({
    onSubmit,
    onCancel,
    loading = false
}) => {
    const form = useForm<CreatePatientDto>({
        resolver: zodResolver(createPatientSchema),
        defaultValues: {
            dni: "",
            name: "",
            email: "",
            phone: "",
            address: "",
            birthDate: "",
            gender: undefined,
        },
    });

    const handleSubmit = (data: CreatePatientDto) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dni"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>DNI *</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Completo *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Juan Pérez" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="juan@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input placeholder="999888777" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Av. Principal 123, Lima" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de Nacimiento</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Género</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar género" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="MALE">Masculino</SelectItem>
                                        <SelectItem value="FEMALE">Femenino</SelectItem>
                                        <SelectItem value="OTHER">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creando..." : "Crear Paciente"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
```

### **UpdatePatientSheet Component**

```typescript
interface UpdatePatientSheetProps {
    patient: Patient | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (id: string, data: UpdatePatientDto) => void;
    loading?: boolean;
}

export const UpdatePatientSheet: React.FC<UpdatePatientSheetProps> = ({
    patient,
    open,
    onOpenChange,
    onSubmit,
    loading = false
}) => {
    const form = useForm<UpdatePatientDto>({
        resolver: zodResolver(updatePatientSchema),
        defaultValues: {
            dni: patient?.dni || "",
            name: patient?.name || "",
            email: patient?.email || "",
            phone: patient?.phone || "",
            address: patient?.address || "",
            birthDate: patient?.birthDate || "",
            gender: patient?.gender,
        },
    });

    // Actualizar valores del formulario cuando cambie el paciente
    useEffect(() => {
        if (patient) {
            form.reset({
                dni: patient.dni,
                name: patient.name,
                email: patient.email || "",
                phone: patient.phone || "",
                address: patient.address || "",
                birthDate: patient.birthDate || "",
                gender: patient.gender,
            });
        }
    }, [patient, form]);

    const handleSubmit = (data: UpdatePatientDto) => {
        if (patient) {
            onSubmit(patient.id, data);
        }
    };

    if (!patient) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Editar Paciente</SheetTitle>
                    <SheetDescription>
                        Actualiza la información del paciente {patient.name}
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                    <CreatePatientForm
                        onSubmit={handleSubmit}
                        onCancel={() => onOpenChange(false)}
                        loading={loading}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};
```

## 🔄 Guías de Implementación

### **Cómo Agregar un Nuevo Campo al Paciente**

1. **Actualizar la interfaz** en `_interfaces/patient.interface.ts`:
```typescript
export type CreatePatientDto = components['schemas']['CreatePatientDto'] & {
    newField?: string; // ← Agregar aquí
};
```

2. **Actualizar el schema** de validación:
```typescript
export const createPatientSchema = z.object({
    // ... campos existentes
    newField: z.string().optional(), // ← Agregar aquí
});
```

3. **Actualizar el formulario** en `_components/CreatePatientForm.tsx`:
```typescript
const form = useForm<CreatePatientDto>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
        // ... valores existentes
        newField: "", // ← Agregar aquí
    },
});

// Agregar el campo en el JSX
<FormField
    control={form.control}
    name="newField"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Nuevo Campo</FormLabel>
            <FormControl>
                <Input placeholder="Valor del nuevo campo" {...field} />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>
```

4. **Actualizar la tabla** en `_components/PatientTableColumns.tsx`:
```typescript
{
    accessorKey: "newField",
    header: "Nuevo Campo",
    cell: ({ row }) => {
        const newField = row.getValue("newField") as string;
        return newField ? <div>{newField}</div> : <div className="text-muted-foreground">-</div>;
    },
},
```

### **Cómo Agregar un Nuevo Género**

1. **Actualizar el tipo** en `_interfaces/patient.interface.ts`:
```typescript
export type Gender = "MALE" | "FEMALE" | "OTHER" | "NEW_GENDER";
```

2. **Actualizar el schema** de validación:
```typescript
export const createPatientSchema = z.object({
    // ... otros campos
    gender: z.enum(["MALE", "FEMALE", "OTHER", "NEW_GENDER"]).optional(),
});
```

3. **Actualizar el formulario** en `_components/CreatePatientForm.tsx`:
```typescript
<SelectContent>
    <SelectItem value="MALE">Masculino</SelectItem>
    <SelectItem value="FEMALE">Femenino</SelectItem>
    <SelectItem value="OTHER">Otro</SelectItem>
    <SelectItem value="NEW_GENDER">Nuevo Género</SelectItem>
</SelectContent>
```

4. **Actualizar la tabla** en `_components/PatientTableColumns.tsx`:
```typescript
const genderMap = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    OTHER: "Otro",
    NEW_GENDER: "Nuevo Género"
};
```

### **Cómo Agregar Validaciones Personalizadas**

1. **Crear validación personalizada** en el schema:
```typescript
export const createPatientSchema = z.object({
    dni: z.string()
        .min(8, "El DNI debe tener al menos 8 caracteres")
        .max(20, "El DNI no puede exceder 20 caracteres")
        .refine((dni) => /^\d+$/.test(dni), {
            message: "El DNI debe contener solo números"
        }),
    // ... otros campos
});
```

2. **Agregar validación asíncrona** (si es necesario):
```typescript
export const createPatientSchema = z.object({
    dni: z.string()
        .min(8, "El DNI debe tener al menos 8 caracteres")
        .refine(async (dni) => {
            // Verificar si el DNI ya existe
            const exists = await checkDniExists(dni);
            return !exists;
        }, {
            message: "El DNI ya está registrado"
        }),
    // ... otros campos
});
```

## 🧪 Testing del Módulo

### **Casos de Prueba Recomendados**

1. **Creación de pacientes**
   - Crear paciente con todos los campos requeridos
   - Crear paciente con campos opcionales
   - Validar errores con campos faltantes
   - Validar formato de DNI único

2. **Actualización de pacientes**
   - Actualizar campos individuales
   - Validar que el DNI siga siendo único
   - Verificar historial de cambios

3. **Eliminación y desactivación**
   - Desactivar paciente (soft delete)
   - Reactivar paciente desactivado
   - Eliminar paciente permanentemente

4. **Búsqueda y filtros**
   - Buscar por DNI
   - Buscar por nombre
   - Filtrar por estado (activo/inactivo)
   - Filtrar por género

5. **Validaciones**
   - Validar formato de email
   - Validar formato de teléfono
   - Validar fecha de nacimiento
   - Validar DNI único

6. **Paginación**
   - Navegar entre páginas
   - Cambiar límite de registros
   - Mantener filtros al cambiar página

## 📈 Métricas y Monitoreo

### **Métricas Importantes**

- **Total de pacientes registrados**
- **Pacientes activos vs inactivos**
- **Tasa de crecimiento de pacientes**
- **Distribución por género**
- **Distribución por edad**
- **Pacientes con información completa vs incompleta**

### **Logs Recomendados**

```typescript
// En las server actions
console.log(`👥 [PATIENT] Creando paciente con DNI: ${data.dni}`);
console.log(`👥 [PATIENT] Actualizando paciente ID: ${id}`);
console.log(`👥 [PATIENT] Desactivando paciente ID: ${id}`);
console.log(`👥 [PATIENT] Reactivando paciente ID: ${id}`);
```

## 🔒 Seguridad y Permisos

### **Validaciones de Seguridad**

1. **Verificar permisos** antes de cada operación
2. **Validar propiedad** de los datos (si aplica)
3. **Auditoría** de todas las operaciones críticas
4. **Rate limiting** para prevenir spam
5. **Validación de DNI único**

### **Permisos Requeridos**

- `patients:read` - Ver pacientes
- `patients:create` - Crear pacientes
- `patients:update` - Actualizar pacientes
- `patients:delete` - Eliminar pacientes
- `patients:deactivate` - Desactivar pacientes
- `patients:reactivate` - Reactivar pacientes

### **Protección de Datos Personales**

1. **Encriptación** de datos sensibles
2. **Acceso limitado** a información personal
3. **Logs de auditoría** para acceso a datos
4. **Cumplimiento** con leyes de protección de datos
5. **Consentimiento** del paciente para uso de datos

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
