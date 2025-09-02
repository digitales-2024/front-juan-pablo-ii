# 📋 Módulo de Citas (Appointments) - Documentación Técnica

## 🎯 Descripción del Módulo

El **Módulo de Citas** es el núcleo del sistema de gestión de la clínica Juan Pablo II. Permite administrar todas las citas médicas, desde su creación hasta su finalización, incluyendo estados, reprogramaciones, cancelaciones y reembolsos.

## 📁 Estructura del Módulo

```
appointments/
├── _actions/
│   └── appointments.action.ts          # Server Actions para operaciones CRUD
├── _components/
│   ├── AppointmentTable.tsx           # Tabla principal de citas
│   ├── AppointmentTableColumns.tsx    # Definición de columnas
│   ├── AppointmentTableToolbarActions.tsx # Acciones de la toolbar
│   ├── AppointmentDetailsDialog.tsx   # Diálogo de detalles
│   ├── AppointmentStatusFilter.tsx    # Filtro por estado
│   ├── CancelAppointmentDialog.tsx    # Diálogo de cancelación
│   ├── DeactivateAppointmentDialog.tsx # Diálogo de desactivación
│   ├── ReactivateAppointmentDialog.tsx # Diálogo de reactivación
│   ├── RefundAppointmentDialog.tsx    # Diálogo de reembolso
│   ├── RescheduleAppointmentDialog.tsx # Diálogo de reprogramación
│   └── FilterComponents/
│       ├── FilterAppointmentsDialog.tsx # Diálogo de filtros avanzados
│       ├── FilterAppointmentsTabCardContent.tsx # Contenido de filtros
│       └── FilterStatusBadge.tsx      # Badge de estado
├── _hooks/
│   ├── useAppointments.ts             # Hook principal del módulo
│   └── useFilterAppointments.ts       # Hook para filtros
├── _interfaces/
│   ├── appointments.interface.ts      # Interfaces principales
│   └── filter.interface.ts            # Interfaces de filtros
├── _constants/
├── README.md                          # Esta documentación
└── page.tsx                           # Página principal
```

## 🔧 Interfaces y Tipos

### **Tipos Principales**

```typescript
// Tipos base de la API
export type Appointment = components['schemas']['Appointment'] & {
    notes?: string;
};

export type CreateAppointmentDto = components['schemas']['CreateAppointmentDto'];
export type UpdateAppointmentDto = components['schemas']['UpdateAppointmentDto'];
export type CancelAppointmentDto = components['schemas']['CancelAppointmentDto'];
export type RefundAppointmentDto = components['schemas']['RefundAppointmentDto'];

// Estados de citas
export type AppointmentStatus = 
    | "PENDING"      // Pendiente
    | "CONFIRMED"    // Confirmada
    | "COMPLETED"    // Completada
    | "CANCELLED"    // Cancelada
    | "NO_SHOW"      // No asistió
    | "RESCHEDULED"  // Reprogramada
    | "all";         // Todas (para filtros)

// Interfaz para la tabla
export type AppointmentTableItem = Appointment & { selected?: boolean };

// Interfaz para respuesta paginada
export interface PaginatedAppointmentsResponse {
    appointments: Appointment[];
    total: number;
}
```

### **Schemas de Validación**

```typescript
// Schema para crear cita
export const createAppointmentSchema = z.object({
    staffId: z.string().min(1, "El ID del personal médico es requerido"),
    serviceId: z.string().min(1, "El ID del servicio es requerido"),
    branchId: z.string().min(1, "El ID de la sucursal es requerido"),
    patientId: z.string().min(1, "El ID del paciente es requerido"),
    start: z.string().min(1, "La fecha y hora de inicio son requeridas"),
    end: z.string().min(1, "La fecha y hora de fin son requeridas"),
    type: z.enum(["CONSULTA", "OTRO"]).optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"])
});

// Schema para actualizar cita
export const updateAppointmentSchema = z.object({
    staffId: z.string().optional(),
    serviceId: z.string().optional(),
    branchId: z.string().optional(),
    patientId: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    type: z.enum(["CONSULTA", "OTRO"]).optional(),
    notes: z.string().optional(),
});

// Schema para cancelar cita
export const cancelAppointmentSchema = z.object({
    cancellationReason: z.string().min(1, "El motivo de cancelación es requerido"),
});

// Schema para reembolsar cita
export const refundAppointmentSchema = z.object({
    refundReason: z.string().min(1, "El motivo de reembolso es requerido"),
});

// Schema para reprogramar cita
export const rescheduleAppointmentSchema = z.object({
    newDateTime: z.string().min(1, "La nueva fecha y hora son requeridas"),
    rescheduleReason: z.string().min(1, "El motivo de reprogramación es requerido"),
});
```

## 🎣 Hooks del Módulo

### **useAppointments Hook**

```typescript
export const useAppointments = () => {
    const queryClient = useQueryClient();
    
    // Estados locales
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus>("all");

    // Query principal con paginación y filtros
    const appointmentsQuery = useQuery({
        queryKey: buildAppointmentsQueryKey(statusFilter, pagination.page, pagination.limit),
        queryFn: () => getAppointmentsByStatus({
            status: statusFilter,
            page: pagination.page,
            limit: pagination.limit
        })
    });

    // Mutations para operaciones CRUD
    const createMutation = useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments-paginated"] });
            toast.success("Cita creada exitosamente");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: UpdateAppointmentVariables) => 
            updateAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments-paginated"] });
            toast.success("Cita actualizada exitosamente");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAppointments,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments-paginated"] });
            toast.success("Citas eliminadas exitosamente");
        }
    });

    const cancelMutation = useMutation({
        mutationFn: ({ id, data }: CancelAppointmentVariables) => 
            cancelAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments-paginated"] });
            toast.success("Cita cancelada exitosamente");
        }
    });

    const refundMutation = useMutation({
        mutationFn: ({ id, data }: RefundAppointmentVariables) => 
            refundAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments-paginated"] });
            toast.success("Reembolso procesado exitosamente");
        }
    });

    const rescheduleMutation = useMutation({
        mutationFn: ({ id, data }: RescheduleAppointmentVariables) => 
            rescheduleAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments-paginated"] });
            toast.success("Cita reprogramada exitosamente");
        }
    });

    // Función para actualizar filtros
    const updateStatusFilter = useCallback((newStatus: AppointmentStatus) => {
        if (newStatus !== statusFilter) {
            queryClient.removeQueries({
                queryKey: ["appointments-paginated"],
                exact: false
            });
            setStatusFilter(newStatus);
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    }, [statusFilter, queryClient]);

    return {
        // Queries
        appointmentsQuery,
        // Mutations
        createMutation,
        updateMutation,
        deleteMutation,
        cancelMutation,
        refundMutation,
        rescheduleMutation,
        // Estados
        pagination,
        setPagination,
        statusFilter,
        setStatusFilter,
        updateStatusFilter
    };
};
```

### **useFilterAppointments Hook**

```typescript
export const useFilterAppointments = () => {
    const [filters, setFilters] = useState<AppointmentFilters>({
        status: "all",
        dateRange: undefined,
        staffId: "",
        patientId: "",
        serviceId: "",
        branchId: ""
    });

    const applyFilters = useCallback((newFilters: AppointmentFilters) => {
        setFilters(newFilters);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            status: "all",
            dateRange: undefined,
            staffId: "",
            patientId: "",
            serviceId: "",
            branchId: ""
        });
    }, []);

    return {
        filters,
        applyFilters,
        clearFilters
    };
};
```

## 🚀 Server Actions

### **Appointments Actions**

```typescript
// Obtener citas paginadas
export const getAppointments = createSafeAction(
    GetAppointmentsSchema, 
    async () => {
        const [appointments, error] = await http.get<Appointment[]>("/appointments");
        if (error) return { error: "Error al obtener las citas" };
        return { data: appointments };
    }
);

// Obtener citas activas
export const getActiveAppointments = createSafeAction(
    GetActiveAppointmentsSchema,
    async () => {
        const [appointments, error] = await http.get<Appointment[]>("/appointments/active");
        if (error) return { error: "Error al obtener las citas activas" };
        return { data: appointments };
    }
);

// Obtener citas paginadas
export const getAllAppointments = createSafeAction(
    GetAllAppointmentsSchema,
    async (data: { page?: number; limit?: number }) => {
        const { page = 1, limit = 10 } = data;
        const url = `/appointments/paginated?page=${page}&limit=${limit}`;
        const [response, error] = await http.get<PaginatedAppointmentsResponse>(url);
        if (error) return { error: "Error al obtener las citas paginadas" };
        return { data: response };
    }
);

// Obtener cita por ID
export const getAppointmentById = createSafeAction(
    GetAppointmentByIdSchema,
    async (data: { id: string }) => {
        const [appointment, error] = await http.get<Appointment>(`/appointments/${data.id}`);
        if (error) return { error: "Error al obtener la cita" };
        return { data: appointment };
    }
);

// Obtener citas por estado
export const getAppointmentsByStatus = createSafeAction(
    GetAppointmentsByStatusSchema,
    async (data: { status: AppointmentStatus; page?: number; limit?: number }) => {
        const { status, page = 1, limit = 10 } = data;
        const url = status === "all" 
            ? `/appointments/paginated?page=${page}&limit=${limit}`
            : `/appointments/status/${status}?page=${page}&limit=${limit}`;
        const [response, error] = await http.get<PaginatedAppointmentsResponse>(url);
        if (error) return { error: "Error al obtener las citas por estado" };
        return { data: response };
    }
);

// Crear cita
export const createAppointment = createSafeAction(
    createAppointmentSchema,
    async (data: CreateAppointmentDto) => {
        const [response, error] = await http.post<BaseApiResponse>("/appointments", data);
        if (error) return { error: "Error al crear la cita" };
        return { data: response };
    }
);

// Actualizar cita
export const updateAppointment = createSafeAction(
    updateAppointmentSchema,
    async (id: string, data: UpdateAppointmentDto) => {
        const [response, error] = await http.patch<BaseApiResponse>(`/appointments/${id}`, data);
        if (error) return { error: "Error al actualizar la cita" };
        return { data: response };
    }
);

// Eliminar citas
export const deleteAppointments = createSafeAction(
    deleteAppointmentsSchema,
    async (data: DeleteAppointmentsDto) => {
        const [response, error] = await http.delete<BaseApiResponse>("/appointments", { data });
        if (error) return { error: "Error al eliminar las citas" };
        return { data: response };
    }
);

// Cancelar cita
export const cancelAppointment = createSafeAction(
    cancelAppointmentSchema,
    async (id: string, data: CancelAppointmentDto) => {
        const [response, error] = await http.patch<BaseApiResponse>(`/appointments/${id}/cancel`, data);
        if (error) return { error: "Error al cancelar la cita" };
        return { data: response };
    }
);

// Reembolsar cita
export const refundAppointment = createSafeAction(
    refundAppointmentSchema,
    async (id: string, data: RefundAppointmentDto) => {
        const [response, error] = await http.patch<BaseApiResponse>(`/appointments/${id}/refund`, data);
        if (error) return { error: "Error al procesar el reembolso" };
        return { data: response };
    }
);

// Reprogramar cita
export const rescheduleAppointment = createSafeAction(
    rescheduleAppointmentSchema,
    async (id: string, data: RescheduleAppointmentDto) => {
        const [response, error] = await http.patch<BaseApiResponse>(`/appointments/${id}/reschedule`, data);
        if (error) return { error: "Error al reprogramar la cita" };
        return { data: response };
    }
);

// Reactivar citas
export const reactivateAppointments = createSafeAction(
    reactivateAppointmentsSchema,
    async (data: DeleteAppointmentsDto) => {
        const [response, error] = await http.patch<BaseApiResponse>("/appointments/reactivate", data);
        if (error) return { error: "Error al reactivar las citas" };
        return { data: response };
    }
);
```

## 🎨 Componentes del Módulo

### **AppointmentTable Component**

```typescript
interface AppointmentTableProps {
    appointments: Appointment[];
    onEdit: (appointment: Appointment) => void;
    onDelete: (id: string) => void;
    onCancel: (id: string) => void;
    onRefund: (id: string) => void;
    onReschedule: (id: string) => void;
    onViewDetails: (appointment: Appointment) => void;
    loading?: boolean;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
    onPageChange?: (page: number) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
    appointments,
    onEdit,
    onDelete,
    onCancel,
    onRefund,
    onReschedule,
    onViewDetails,
    loading = false,
    pagination,
    onPageChange
}) => {
    // Implementación del componente de tabla
};
```

### **AppointmentTableColumns Component**

```typescript
export const appointmentColumns: ColumnDef<AppointmentTableItem>[] = [
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
        accessorKey: "patient.name",
        header: "Paciente",
        cell: ({ row }) => <div>{row.getValue("patient.name")}</div>,
    },
    {
        accessorKey: "staff.name",
        header: "Médico",
        cell: ({ row }) => <div>{row.getValue("staff.name")}</div>,
    },
    {
        accessorKey: "service.name",
        header: "Servicio",
        cell: ({ row }) => <div>{row.getValue("service.name")}</div>,
    },
    {
        accessorKey: "start",
        header: "Fecha y Hora",
        cell: ({ row }) => {
            const start = new Date(row.getValue("start"));
            return <div>{format(start, "dd/MM/yyyy HH:mm")}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as AppointmentStatus;
            const config = appointmentStatusConfig[status];
            return (
                <Badge className={`${config.backgroundColor} ${config.textColor}`}>
                    <config.icon className="w-3 h-3 mr-1" />
                    {config.name}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const appointment = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(appointment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(appointment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReschedule(appointment.id)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Reprogramar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCancel(appointment.id)}>
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRefund(appointment.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reembolsar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
```

### **AppointmentDetailsDialog Component**

```typescript
interface AppointmentDetailsDialogProps {
    appointment: Appointment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({
    appointment,
    open,
    onOpenChange
}) => {
    if (!appointment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalles de la Cita</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Paciente</Label>
                        <p>{appointment.patient?.name}</p>
                    </div>
                    <div>
                        <Label>Médico</Label>
                        <p>{appointment.staff?.name}</p>
                    </div>
                    <div>
                        <Label>Servicio</Label>
                        <p>{appointment.service?.name}</p>
                    </div>
                    <div>
                        <Label>Sucursal</Label>
                        <p>{appointment.branch?.name}</p>
                    </div>
                    <div>
                        <Label>Fecha y Hora</Label>
                        <p>{format(new Date(appointment.start), "dd/MM/yyyy HH:mm")}</p>
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Badge className={appointmentStatusConfig[appointment.status].backgroundColor}>
                            {appointmentStatusConfig[appointment.status].name}
                        </Badge>
                    </div>
                    {appointment.notes && (
                        <div className="col-span-2">
                            <Label>Notas</Label>
                            <p>{appointment.notes}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
```

## 📊 Configuración de Estados

### **Configuración de Estados de Citas**

```typescript
export const appointmentStatusConfig: Record<AppointmentStatus, EnumConfig> = {
    PENDING: {
        name: "Pendiente",
        backgroundColor: "bg-[#FFF8E1]",
        hoverBgColor: "hover:bg-[#FFECB3]",
        textColor: "text-[#FFA000]",
        icon: Clock,
    },
    CONFIRMED: {
        name: "Confirmada",
        backgroundColor: "bg-[#E0F2F1]",
        hoverBgColor: "hover:bg-[#B2DFDB]",
        textColor: "text-[#00796B]",
        icon: CalendarCheck,
    },
    COMPLETED: {
        name: "Completada",
        backgroundColor: "bg-[#E8F5E9]",
        hoverBgColor: "hover:bg-[#C8E6C9]",
        textColor: "text-[#388E3C]",
        icon: CheckCircle,
    },
    CANCELLED: {
        name: "Cancelada",
        backgroundColor: "bg-[#FFEBEE]",
        hoverBgColor: "hover:bg-[#FFCDD2]",
        textColor: "text-[#D32F2F]",
        icon: XCircle,
    },
    NO_SHOW: {
        name: "No asistió",
        backgroundColor: "bg-[#FFF3E0]",
        hoverBgColor: "hover:bg-[#FFE0B2]",
        textColor: "text-[#F57C00]",
        icon: AlertTriangle,
    },
    RESCHEDULED: {
        name: "Reprogramada",
        backgroundColor: "bg-[#F3E5F5]",
        hoverBgColor: "hover:bg-[#CE93D8]",
        textColor: "text-[#8E24AA]",
        icon: RefreshCcw,
    },
    all: {
        name: "Todas",
        backgroundColor: "bg-[#F5F5F5]",
        hoverBgColor: "hover:bg-[#E0E0E0]",
        textColor: "text-[#616161]",
        icon: List,
    }
};

export const appointmentStatusEnumOptions: EnumOptions<AppointmentStatus>[] = [
    { label: "Todas", value: "all" },
    { label: "Pendiente", value: "PENDING" },
    { label: "Confirmada", value: "CONFIRMED" },
    { label: "Completada", value: "COMPLETED" },
    { label: "Cancelada", value: "CANCELLED" },
    { label: "No asistió", value: "NO_SHOW" },
    { label: "Reprogramada", value: "RESCHEDULED" }
];
```

## 🔄 Guías de Implementación

### **Cómo Agregar un Nuevo Estado de Cita**

1. **Actualizar el tipo** en `_interfaces/appointments.interface.ts`:
```typescript
export type AppointmentStatus = 
    | "PENDING" 
    | "CONFIRMED" 
    | "COMPLETED" 
    | "CANCELLED" 
    | "NO_SHOW" 
    | "RESCHEDULED" 
    | "NEW_STATUS"  // ← Agregar aquí
    | "all";
```

2. **Agregar configuración** en `appointmentStatusConfig`:
```typescript
NEW_STATUS: {
    name: "Nuevo Estado",
    backgroundColor: "bg-[#E3F2FD]",
    hoverBgColor: "hover:bg-[#BBDEFB]",
    textColor: "text-[#1976D2]",
    icon: NewIcon,
},
```

3. **Actualizar opciones** en `appointmentStatusEnumOptions`:
```typescript
{
    label: "Nuevo Estado",
    value: "NEW_STATUS"
},
```

4. **Actualizar schemas** que usen el enum:
```typescript
const GetAppointmentsByStatusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED', 'NEW_STATUS', 'all']),
    page: z.number().optional(),
    limit: z.number().optional(),
});
```

### **Cómo Agregar un Nuevo Campo a las Citas**

1. **Actualizar la interfaz** en `_interfaces/appointments.interface.ts`:
```typescript
export type CreateAppointmentDto = components['schemas']['CreateAppointmentDto'] & {
    newField?: string; // ← Agregar aquí
};
```

2. **Actualizar el schema** de validación:
```typescript
export const createAppointmentSchema = z.object({
    // ... campos existentes
    newField: z.string().optional(), // ← Agregar aquí
});
```

3. **Actualizar componentes** que usen el formulario:
```typescript
const form = useForm<CreateAppointmentDto>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
        // ... valores existentes
        newField: "", // ← Agregar aquí
    },
});
```

4. **Actualizar la tabla** en `_components/AppointmentTableColumns.tsx`:
```typescript
{
    accessorKey: "newField",
    header: "Nuevo Campo",
    cell: ({ row }) => <div>{row.getValue("newField")}</div>,
},
```

### **Cómo Agregar una Nueva Acción**

1. **Crear el diálogo** en `_components/`:
```typescript
// NewActionDialog.tsx
interface NewActionDialogProps {
    appointment: Appointment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: NewActionData) => void;
}

export const NewActionDialog: React.FC<NewActionDialogProps> = ({
    appointment,
    open,
    onOpenChange,
    onConfirm
}) => {
    // Implementación del diálogo
};
```

2. **Agregar la mutation** en `_hooks/useAppointments.ts`:
```typescript
const newActionMutation = useMutation({
    mutationFn: newAction,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments-paginated"] });
        toast.success("Acción ejecutada exitosamente");
    }
});
```

3. **Agregar la server action** en `_actions/appointments.action.ts`:
```typescript
export const newAction = createSafeAction(
    newActionSchema,
    async (id: string, data: NewActionData) => {
        const [response, error] = await http.patch<BaseApiResponse>(`/appointments/${id}/new-action`, data);
        if (error) return { error: "Error al ejecutar la acción" };
        return { data: response };
    }
);
```

4. **Agregar el botón** en `_components/AppointmentTableColumns.tsx`:
```typescript
<DropdownMenuItem onClick={() => onNewAction(appointment.id)}>
    <NewIcon className="mr-2 h-4 w-4" />
    Nueva Acción
</DropdownMenuItem>
```

## 🧪 Testing del Módulo

### **Casos de Prueba Recomendados**

1. **Creación de citas**
   - Crear cita con todos los campos requeridos
   - Validar errores con campos faltantes
   - Verificar conflictos de horarios

2. **Actualización de citas**
   - Actualizar campos individuales
   - Validar permisos de edición
   - Verificar historial de cambios

3. **Cancelación de citas**
   - Cancelar cita con motivo
   - Validar restricciones de cancelación
   - Verificar notificaciones

4. **Reprogramación de citas**
   - Reprogramar a nueva fecha/hora
   - Validar disponibilidad
   - Verificar notificaciones

5. **Filtros y búsqueda**
   - Filtrar por estado
   - Filtrar por fecha
   - Filtrar por médico/paciente

6. **Paginación**
   - Navegar entre páginas
   - Cambiar límite de registros
   - Mantener filtros al cambiar página

## 📈 Métricas y Monitoreo

### **Métricas Importantes**

- **Tasa de asistencia**: Citas completadas vs total
- **Tasa de cancelación**: Citas canceladas vs total
- **Tiempo promedio de reprogramación**
- **Satisfacción del paciente** (si aplica)
- **Utilización de horarios médicos**

### **Logs Recomendados**

```typescript
// En las server actions
console.log(`🏥 [APPOINTMENT] Creando cita para paciente ${data.patientId}`);
console.log(`🏥 [APPOINTMENT] Cita ${id} cancelada por: ${data.cancellationReason}`);
console.log(`🏥 [APPOINTMENT] Cita ${id} reprogramada a: ${data.newDateTime}`);
```

## 🔒 Seguridad y Permisos

### **Validaciones de Seguridad**

1. **Verificar permisos** antes de cada operación
2. **Validar propiedad** de la cita (solo el médico asignado puede modificar)
3. **Auditoría** de todas las operaciones críticas
4. **Rate limiting** para prevenir spam

### **Permisos Requeridos**

- `appointments:read` - Ver citas
- `appointments:create` - Crear citas
- `appointments:update` - Actualizar citas
- `appointments:delete` - Eliminar citas
- `appointments:cancel` - Cancelar citas
- `appointments:reschedule` - Reprogramar citas
- `appointments:refund` - Reembolsar citas

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de desarrollo Juan Pablo II
